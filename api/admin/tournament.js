const { query } = require("../_lib/db");
const { json, methodNotAllowed, serverError } = require("../_lib/http");
const { requireAuth } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");

  try {
    const session = requireAuth(req, res);
    if (!session) return;

    const id = Number(req.query.id);
    if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });

    const result = await query(
      `
      SELECT id, title, short_description, season, image_url, link_url, tags, ordering, published,
             modal_subtitle, modal_description, prize_pool, tournament_format, teams, modal_image_url, image_fit, created_at, updated_at
      FROM tournaments
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );
    const item = result.rows[0];
    if (!item) return json(res, 404, { error: "Not found" });
    return json(res, 200, { item });
  } catch (error) {
    return serverError(res, error);
  }
};
