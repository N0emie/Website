const readline = require("readline");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
require("dotenv").config();
const { query } = require("../api/_lib/db");

function ask(promptText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const loginFromEnv = process.env.ADMIN_SEED_LOGIN || process.env.ADMIN_SEED_EMAIL || "";
  const passFromEnv = process.env.ADMIN_SEED_PASSWORD || "";

  const login = (loginFromEnv || (await ask("Admin login: "))).trim().toLowerCase();
  const password = passFromEnv || (await ask("Admin password (min 8 chars): "));

  if (!login || password.length < 8) {
    throw new Error("Login and password (min 8 chars) are required");
  }

  const hash = await bcrypt.hash(password, 12);
  await query(
    `
    INSERT INTO admin_users (email, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `,
    [login, hash]
  );

  console.log(`Admin upserted: ${login}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
