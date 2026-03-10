CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ordering INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO clients (name, ordering, published)
SELECT seed.name, seed.ordering, TRUE
FROM (
  VALUES
    ('NAVI', 0),
    ('GAMBIT', 1),
    ('VIRTUS.PRO', 2),
    ('TEAM SPIRIT', 3),
    ('FORZE', 4),
    ('NEMIGA', 5),
    ('1WIN', 6),
    ('CYBER LEGACY', 7),
    ('WINSTRIKE', 8),
    ('ESPADA', 9),
    ('SLTV', 10),
    ('RU-CUP', 11),
    ('EPICENTER', 12),
    ('STARLADDER', 13),
    ('ESL', 14)
) AS seed(name, ordering)
WHERE NOT EXISTS (SELECT 1 FROM clients);
