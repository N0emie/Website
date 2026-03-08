const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
require("dotenv").config();
const { query } = require("../api/_lib/db");
const { SITE_ASSET_KEYS } = require("../api/_lib/content-keys");

async function main() {
  for (const item of SITE_ASSET_KEYS) {
    await query(
      `
      INSERT INTO site_assets (key, url, alt, updated_at)
      VALUES ($1, '', '', NOW())
      ON CONFLICT (key) DO NOTHING
      `,
      [item.key]
    );
  }
  console.log(`Seeded asset keys: ${SITE_ASSET_KEYS.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
