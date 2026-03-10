const { query } = require("../_lib/db");
const { json, methodNotAllowed, serverError, getRequestBody } = require("../_lib/http");
const { requireAuth, validateCsrf } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  try {
    const session = requireAuth(req, res);
    if (!session) return;

    if (req.method === "GET") {
      const result = await query(
        `
        SELECT id, name, ordering, published, created_at, updated_at
        FROM clients
        ORDER BY ordering ASC, id DESC
        `
      );
      return json(res, 200, { items: result.rows });
    }

    if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });

    if (req.method === "POST") {
      const body = await getRequestBody(req);
      const name = String(body.name || "").trim();
      const published = body.published !== false;

      if (!name) return json(res, 400, { error: "name is required" });

      const minOrderingResult = await query("SELECT COALESCE(MIN(ordering), 0) AS min_ordering FROM clients");
      const minOrdering = Number(minOrderingResult.rows?.[0]?.min_ordering ?? 0);
      const ordering = minOrdering - 1;

      const result = await query(
        `
        INSERT INTO clients (name, ordering, published, updated_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id
        `,
        [name, ordering, published]
      );

      return json(res, 201, { ok: true, id: result.rows[0].id });
    }

    if (req.method === "PUT") {
      const body = await getRequestBody(req);

      if (Array.isArray(body.orderIds)) {
        const orderIds = body.orderIds
          .map((value) => Number(value))
          .filter((value) => Number.isInteger(value) && value > 0);

        if (!orderIds.length) return json(res, 400, { error: "orderIds is required" });

        const uniqueIds = [...new Set(orderIds)];
        for (let i = 0; i < uniqueIds.length; i += 1) {
          await query("UPDATE clients SET ordering = $1, updated_at = NOW() WHERE id = $2", [i, uniqueIds[i]]);
        }

        return json(res, 200, { ok: true });
      }

      const id = Number(body.id);
      const name = String(body.name || "").trim();
      const order = Number.isFinite(Number(body.order)) ? Number(body.order) : 0;
      const published = Boolean(body.published);

      if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });
      if (!name) return json(res, 400, { error: "name is required" });

      await query(
        `
        UPDATE clients
        SET name = $1,
            ordering = $2,
            published = $3,
            updated_at = NOW()
        WHERE id = $4
        `,
        [name, order, published, id]
      );

      return json(res, 200, { ok: true });
    }

    if (req.method === "DELETE") {
      const body = await getRequestBody(req);
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });
      await query("DELETE FROM clients WHERE id = $1", [id]);
      return json(res, 200, { ok: true });
    }

    return methodNotAllowed(res, "GET, POST, PUT, DELETE");
  } catch (error) {
    return serverError(res, error);
  }
};
