const { query } = require("../_lib/db");
const { SITE_ASSET_KEYS } = require("../_lib/content-keys");
const { json, methodNotAllowed, serverError } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");

  try {
    const [
      assetsResult,
      tournamentsResult,
      clientsResult,
      achievementsTitleResult,
      achievementStatsResult,
      achievementHighlightsResult
    ] = await Promise.all([
      query("SELECT key, url, alt FROM site_assets"),
      query(
        `
        SELECT id, title, short_description, season, image_url, link_url, tags, ordering, published,
               modal_subtitle, modal_description, prize_pool, tournament_format, teams, modal_image_url, image_fit
        FROM tournaments
        WHERE published = TRUE
        ORDER BY ordering ASC, id DESC
        `
      ),
      query(
        `
        SELECT id, name, ordering, published
        FROM clients
        WHERE published = TRUE
        ORDER BY ordering ASC, id DESC
        `
      ),
      query("SELECT value FROM site_texts WHERE key = 'achievements.title' LIMIT 1"),
      query(
        `
        SELECT id, value_text, label, ordering, published
        FROM achievement_stats
        WHERE published = TRUE
        ORDER BY ordering ASC, id DESC
        `
      ),
      query(
        `
        SELECT id, text, ordering, published
        FROM achievement_highlights
        WHERE published = TRUE
        ORDER BY ordering ASC, id DESC
        `
      )
    ]);

    const assetsByKey = Object.create(null);
    for (const item of SITE_ASSET_KEYS) {
      assetsByKey[item.key] = { url: "", alt: "" };
    }
    for (const row of assetsResult.rows) {
      assetsByKey[row.key] = { url: row.url, alt: row.alt || "" };
    }

    return json(res, 200, {
      assets: assetsByKey,
      tournaments: tournamentsResult.rows,
      clients: clientsResult.rows,
      achievements: {
        title: achievementsTitleResult.rows[0]?.value || "НАШИ ДОСТИЖЕНИЯ",
        stats: achievementStatsResult.rows,
        highlights: achievementHighlightsResult.rows
      }
    });
  } catch (error) {
    return serverError(res, error);
  }
};
