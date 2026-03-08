const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
require("dotenv").config();
const { query } = require("../api/_lib/db");

async function main() {
  const migrationsDir = path.join(__dirname, "..", "sql", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const sqlPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(sqlPath, "utf8");
    await query(sql);
    console.log(`Migration applied: ${file}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
