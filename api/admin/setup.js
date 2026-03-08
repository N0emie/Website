const bcrypt = require("bcryptjs");
const { query } = require("../_lib/db");
const { json, methodNotAllowed, serverError, getRequestBody } = require("../_lib/http");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const countRes = await query("SELECT COUNT(*)::int AS count FROM admin_users");
      const hasUsers = countRes.rows[0].count > 0;
      return json(res, 200, { hasUsers });
    }

    if (req.method !== "POST") return methodNotAllowed(res, "GET, POST");

    const countRes = await query("SELECT COUNT(*)::int AS count FROM admin_users");
    const hasUsers = countRes.rows[0].count > 0;
    if (hasUsers) return json(res, 403, { error: "Setup is disabled" });

    const body = await getRequestBody(req);
    const login = String(body.login || body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!login || !password || password.length < 8) {
      return json(res, 400, { error: "Login and password (min 8 chars) are required" });
    }

    const hash = await bcrypt.hash(password, 12);
    await query("INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)", [login, hash]);
    return json(res, 201, { ok: true });
  } catch (error) {
    return serverError(res, error);
  }
};
