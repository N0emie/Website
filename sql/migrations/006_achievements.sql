CREATE TABLE IF NOT EXISTS site_texts (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievement_stats (
  id SERIAL PRIMARY KEY,
  value_text TEXT NOT NULL,
  label TEXT NOT NULL,
  ordering INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievement_highlights (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  ordering INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_texts (key, value, updated_at)
VALUES ('achievements.title', 'НАШИ ДОСТИЖЕНИЯ', NOW())
ON CONFLICT (key) DO NOTHING;

INSERT INTO achievement_stats (value_text, label, ordering, published)
SELECT seed.value_text, seed.label, seed.ordering, TRUE
FROM (
  VALUES
    ('50+', 'ПРОВЕДЕННЫХ ТУРНИРОВ', 0),
    ('10,000+', 'УЧАСТНИКОВ', 1),
    ('5M₽', 'ОБЩИЙ ПРИЗОВОЙ ФОНД', 2),
    ('100+', 'ПАРТНЕРОВ', 3)
) AS seed(value_text, label, ordering)
WHERE NOT EXISTS (SELECT 1 FROM achievement_stats);

INSERT INTO achievement_highlights (text, ordering, published)
SELECT seed.text, seed.ordering, TRUE
FROM (
  VALUES
    ('Первый турнир по CS2 в регионе с призовым фондом 500,000₽', 0),
    ('Организация крупнейшего Dota 2 турнира в СНГ', 1),
    ('Партнерство с ведущими киберспортивными организациями', 2)
) AS seed(text, ordering)
WHERE NOT EXISTS (SELECT 1 FROM achievement_highlights);
