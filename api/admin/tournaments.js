const { query } = require("../_lib/db");
const { json, methodNotAllowed, serverError, getRequestBody } = require("../_lib/http");
const { requireAuth, validateCsrf } = require("../_lib/auth");

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((t) => String(t || "").trim())
      .filter(Boolean)
      .slice(0, 10);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);
  }
  return [];
}

module.exports = async function handler(req, res) {
  try {
    const session = requireAuth(req, res);
    if (!session) return;

    if (req.method === "GET") {
      const result = await query(
        `
        SELECT id, title, short_description, season, image_url, link_url, tags, ordering, published,
               modal_subtitle, modal_description, prize_pool, tournament_format, teams, modal_image_url, image_fit, created_at, updated_at
        FROM tournaments
        ORDER BY ordering ASC, id DESC
        `
      );
      return json(res, 200, { items: result.rows });
    }

    if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });

    if (req.method === "POST") {
      const body = await getRequestBody(req);
      const title = String(body.title || "").trim();
      const shortDescription = String(body.shortDescription || "").trim();
      const season = String(body.season || "").trim();
      const imageUrl = String(body.imageUrl || "").trim();
      const linkUrl = String(body.linkUrl || "").trim();
      const modalSubtitle = String(body.modalSubtitle || "").trim();
      const modalDescription = String(body.modalDescription || "").trim();
      const prizePool = String(body.prizePool || "").trim();
      const tournamentFormat = String(body.tournamentFormat || "").trim();
      const teams = String(body.teams || "").trim();
      const modalImageUrl = String(body.modalImageUrl || "").trim();
      const imageFitRaw = String(body.imageFit || "").trim().toLowerCase();
      const imageFit = ["cover", "contain", "fill"].includes(imageFitRaw) ? imageFitRaw : "cover";
      const order = Number.isFinite(Number(body.order)) ? Number(body.order) : 0;
      const published = Boolean(body.published);
      const tags = normalizeTags(body.tags);

      if (!title || !shortDescription || !imageUrl) {
        return json(res, 400, { error: "title, shortDescription and imageUrl are required" });
      }

      const result = await query(
        `
        INSERT INTO tournaments (
          title, short_description, season, image_url, link_url, tags, ordering, published,
          modal_subtitle, modal_description, prize_pool, tournament_format, teams, modal_image_url, image_fit, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
        RETURNING id
        `,
        [
          title,
          shortDescription,
          season || null,
          imageUrl,
          linkUrl || null,
          JSON.stringify(tags),
          order,
          published,
          modalSubtitle || null,
          modalDescription || null,
          prizePool || null,
          tournamentFormat || null,
          teams || null,
          modalImageUrl || null,
          imageFit
        ]
      );

      return json(res, 201, { ok: true, id: result.rows[0].id });
    }

    if (req.method === "PUT") {
      const body = await getRequestBody(req);
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });

      const title = String(body.title || "").trim();
      const shortDescription = String(body.shortDescription || "").trim();
      const season = String(body.season || "").trim();
      const imageUrl = String(body.imageUrl || "").trim();
      const linkUrl = String(body.linkUrl || "").trim();
      const modalSubtitle = String(body.modalSubtitle || "").trim();
      const modalDescription = String(body.modalDescription || "").trim();
      const prizePool = String(body.prizePool || "").trim();
      const tournamentFormat = String(body.tournamentFormat || "").trim();
      const teams = String(body.teams || "").trim();
      const modalImageUrl = String(body.modalImageUrl || "").trim();
      const imageFitRaw = String(body.imageFit || "").trim().toLowerCase();
      const imageFit = ["cover", "contain", "fill"].includes(imageFitRaw) ? imageFitRaw : "cover";
      const order = Number.isFinite(Number(body.order)) ? Number(body.order) : 0;
      const published = Boolean(body.published);
      const tags = normalizeTags(body.tags);

      if (!title || !shortDescription || !imageUrl) {
        return json(res, 400, { error: "title, shortDescription and imageUrl are required" });
      }

      await query(
        `
        UPDATE tournaments
        SET title = $1,
            short_description = $2,
            season = $3,
            image_url = $4,
            link_url = $5,
            tags = $6::jsonb,
            ordering = $7,
            published = $8,
            modal_subtitle = $9,
            modal_description = $10,
            prize_pool = $11,
            tournament_format = $12,
            teams = $13,
            modal_image_url = $14,
            image_fit = $15,
            updated_at = NOW()
        WHERE id = $16
        `,
        [
          title,
          shortDescription,
          season || null,
          imageUrl,
          linkUrl || null,
          JSON.stringify(tags),
          order,
          published,
          modalSubtitle || null,
          modalDescription || null,
          prizePool || null,
          tournamentFormat || null,
          teams || null,
          modalImageUrl || null,
          imageFit,
          id
        ]
      );
      return json(res, 200, { ok: true });
    }

    if (req.method === "DELETE") {
      const body = await getRequestBody(req);
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });
      await query("DELETE FROM tournaments WHERE id = $1", [id]);
      return json(res, 200, { ok: true });
    }

    return methodNotAllowed(res, "GET, POST, PUT, DELETE");
  } catch (error) {
    return serverError(res, error);
  }
};
