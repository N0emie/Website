const { query } = require("../_lib/db");
const { SITE_ASSET_KEYS } = require("../_lib/content-keys");
const { json, methodNotAllowed, serverError, getRequestBody } = require("../_lib/http");
const { requireAuth, validateCsrf } = require("../_lib/auth");

function mapAssetRows(rows) {
  const byKey = new Map(rows.map((row) => [row.key, row]));
  return SITE_ASSET_KEYS.map((item) => {
    const row = byKey.get(item.key);
    return {
      key: item.key,
      label: item.label,
      url: row?.url || "",
      alt: row?.alt || ""
    };
  });
}

module.exports = async function handler(req, res) {
  try {
    const session = requireAuth(req, res);
    if (!session) return;

    if (req.method === "GET") {
      const result = await query("SELECT key, url, alt FROM site_assets ORDER BY key");
      return json(res, 200, { items: mapAssetRows(result.rows) });
    }

    if (req.method !== "PUT") return methodNotAllowed(res, "GET, PUT");
    if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });

    const body = await getRequestBody(req);
    const key = String(body.key || "").trim();
    const url = String(body.url || "").trim();
    const alt = String(body.alt || "").trim();

    const validKey = SITE_ASSET_KEYS.some((item) => item.key === key);
    if (!validKey) return json(res, 400, { error: "Unknown asset key" });
    if (!url) return json(res, 400, { error: "Asset URL is required" });

    await query(
      `
      INSERT INTO site_assets (key, url, alt, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (key)
      DO UPDATE SET url = EXCLUDED.url, alt = EXCLUDED.alt, updated_at = NOW()
      `,
      [key, url, alt || null]
    );

    return json(res, 200, { ok: true });
  } catch (error) {
    return serverError(res, error);
  }
};
