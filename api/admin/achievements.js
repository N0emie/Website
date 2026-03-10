const { query } = require("../_lib/db");
const { json, methodNotAllowed, serverError, getRequestBody } = require("../_lib/http");
const { requireAuth, validateCsrf } = require("../_lib/auth");

const DEFAULT_TITLE = "НАШИ ДОСТИЖЕНИЯ";
const DEFAULT_STATS = [
  { valueText: "50+", label: "ПРОВЕДЕННЫХ ТУРНИРОВ", ordering: 0 },
  { valueText: "10,000+", label: "УЧАСТНИКОВ", ordering: 1 },
  { valueText: "5M₽", label: "ОБЩИЙ ПРИЗОВОЙ ФОНД", ordering: 2 },
  { valueText: "100+", label: "ПАРТНЕРОВ", ordering: 3 }
];
const DEFAULT_HIGHLIGHTS = [
  { text: "Первый турнир по CS2 в регионе с призовым фондом 500,000₽", ordering: 0 },
  { text: "Организация крупнейшего Dota 2 турнира в СНГ", ordering: 1 },
  { text: "Партнерство с ведущими киберспортивными организациями", ordering: 2 }
];

async function ensureDefaults() {
  const [titleResult, statsCountResult, highlightsCountResult] = await Promise.all([
    query("SELECT value FROM site_texts WHERE key = 'achievements.title' LIMIT 1"),
    query("SELECT COUNT(*)::int AS count FROM achievement_stats"),
    query("SELECT COUNT(*)::int AS count FROM achievement_highlights")
  ]);

  if (!titleResult.rows[0]?.value) {
    await query(
      `
      INSERT INTO site_texts (key, value, updated_at)
      VALUES ('achievements.title', $1, NOW())
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `,
      [DEFAULT_TITLE]
    );
  }

  if (Number(statsCountResult.rows[0]?.count || 0) === 0) {
    for (const item of DEFAULT_STATS) {
      await query(
        `
        INSERT INTO achievement_stats (value_text, label, ordering, published, updated_at)
        VALUES ($1, $2, $3, TRUE, NOW())
        `,
        [item.valueText, item.label, item.ordering]
      );
    }
  }

  if (Number(highlightsCountResult.rows[0]?.count || 0) === 0) {
    for (const item of DEFAULT_HIGHLIGHTS) {
      await query(
        `
        INSERT INTO achievement_highlights (text, ordering, published, updated_at)
        VALUES ($1, $2, TRUE, NOW())
        `,
        [item.text, item.ordering]
      );
    }
  }
}

async function getPayload() {
  await ensureDefaults();

  const [titleResult, statsResult, highlightsResult] = await Promise.all([
    query("SELECT value FROM site_texts WHERE key = 'achievements.title' LIMIT 1"),
    query(
      `
      SELECT id, value_text, label, ordering, published
      FROM achievement_stats
      ORDER BY ordering ASC, id DESC
      `
    ),
    query(
      `
      SELECT id, text, ordering, published
      FROM achievement_highlights
      ORDER BY ordering ASC, id DESC
      `
    )
  ]);

  return {
    title: titleResult.rows[0]?.value || DEFAULT_TITLE,
    stats: statsResult.rows,
    highlights: highlightsResult.rows
  };
}

async function createStat(body, res) {
  const valueText = String(body.valueText || "").trim();
  const label = String(body.label || "").trim();
  const published = body.published !== false;

  if (!valueText || !label) return json(res, 400, { error: "valueText and label are required" });

  const minOrderingResult = await query("SELECT COALESCE(MIN(ordering), 0) AS min_ordering FROM achievement_stats");
  const ordering = Number(minOrderingResult.rows?.[0]?.min_ordering ?? 0) - 1;

  const result = await query(
    `
    INSERT INTO achievement_stats (value_text, label, ordering, published, updated_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id
    `,
    [valueText, label, ordering, published]
  );

  return json(res, 201, { ok: true, id: result.rows[0].id });
}

async function createHighlight(body, res) {
  const text = String(body.text || "").trim();
  const published = body.published !== false;

  if (!text) return json(res, 400, { error: "text is required" });

  const minOrderingResult = await query("SELECT COALESCE(MIN(ordering), 0) AS min_ordering FROM achievement_highlights");
  const ordering = Number(minOrderingResult.rows?.[0]?.min_ordering ?? 0) - 1;

  const result = await query(
    `
    INSERT INTO achievement_highlights (text, ordering, published, updated_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id
    `,
    [text, ordering, published]
  );

  return json(res, 201, { ok: true, id: result.rows[0].id });
}

module.exports = async function handler(req, res) {
  try {
    const session = requireAuth(req, res);
    if (!session) return;

    if (req.method === "GET") {
      return json(res, 200, await getPayload());
    }

    if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });

    const body = await getRequestBody(req);

    if (req.method === "POST") {
      const entity = String(body.entity || "").trim();
      if (entity === "stat") return createStat(body, res);
      if (entity === "highlight") return createHighlight(body, res);
      return json(res, 400, { error: "Unknown entity" });
    }

    if (req.method === "PUT") {
      const entity = String(body.entity || "").trim();

      if (entity === "title") {
        const value = String(body.value || "").trim();
        if (!value) return json(res, 400, { error: "value is required" });

        await query(
          `
          INSERT INTO site_texts (key, value, updated_at)
          VALUES ('achievements.title', $1, NOW())
          ON CONFLICT (key)
          DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
          `,
          [value]
        );
        return json(res, 200, { ok: true });
      }

      if (entity === "stats-order" && Array.isArray(body.orderIds)) {
        const uniqueIds = [...new Set(body.orderIds.map(Number).filter((v) => Number.isInteger(v) && v > 0))];
        if (!uniqueIds.length) return json(res, 400, { error: "orderIds is required" });
        for (let i = 0; i < uniqueIds.length; i += 1) {
          await query("UPDATE achievement_stats SET ordering = $1, updated_at = NOW() WHERE id = $2", [i, uniqueIds[i]]);
        }
        return json(res, 200, { ok: true });
      }

      if (entity === "highlights-order" && Array.isArray(body.orderIds)) {
        const uniqueIds = [...new Set(body.orderIds.map(Number).filter((v) => Number.isInteger(v) && v > 0))];
        if (!uniqueIds.length) return json(res, 400, { error: "orderIds is required" });
        for (let i = 0; i < uniqueIds.length; i += 1) {
          await query("UPDATE achievement_highlights SET ordering = $1, updated_at = NOW() WHERE id = $2", [i, uniqueIds[i]]);
        }
        return json(res, 200, { ok: true });
      }

      if (entity === "stat") {
        const id = Number(body.id);
        const valueText = String(body.valueText || "").trim();
        const label = String(body.label || "").trim();
        const ordering = Number.isFinite(Number(body.ordering)) ? Number(body.ordering) : 0;
        const published = Boolean(body.published);
        if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });
        if (!valueText || !label) return json(res, 400, { error: "valueText and label are required" });

        await query(
          `
          UPDATE achievement_stats
          SET value_text = $1, label = $2, ordering = $3, published = $4, updated_at = NOW()
          WHERE id = $5
          `,
          [valueText, label, ordering, published, id]
        );
        return json(res, 200, { ok: true });
      }

      if (entity === "highlight") {
        const id = Number(body.id);
        const text = String(body.text || "").trim();
        const ordering = Number.isFinite(Number(body.ordering)) ? Number(body.ordering) : 0;
        const published = Boolean(body.published);
        if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });
        if (!text) return json(res, 400, { error: "text is required" });

        await query(
          `
          UPDATE achievement_highlights
          SET text = $1, ordering = $2, published = $3, updated_at = NOW()
          WHERE id = $4
          `,
          [text, ordering, published, id]
        );
        return json(res, 200, { ok: true });
      }

      return json(res, 400, { error: "Unknown entity" });
    }

    if (req.method === "DELETE") {
      const entity = String(body.entity || "").trim();
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return json(res, 400, { error: "Invalid id" });

      if (entity === "stat") {
        await query("DELETE FROM achievement_stats WHERE id = $1", [id]);
        return json(res, 200, { ok: true });
      }

      if (entity === "highlight") {
        await query("DELETE FROM achievement_highlights WHERE id = $1", [id]);
        return json(res, 200, { ok: true });
      }

      return json(res, 400, { error: "Unknown entity" });
    }

    return methodNotAllowed(res, "GET, POST, PUT, DELETE");
  } catch (error) {
    return serverError(res, error);
  }
};
