const bcrypt = require("bcryptjs");
const { query } = require("../_lib/db");
const { json, methodNotAllowed, serverError, getRequestBody } = require("../_lib/http");
const {
  createSessionToken,
  setSessionCookie,
  validateCsrf,
  getRequestIp,
  canAttemptLogin,
  registerFailedLogin,
  resetFailedLogin
} = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");

  try {
    if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });

    const body = await getRequestBody(req);
    const login = String(body.login || body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const ip = getRequestIp(req);

    if (!login || !password) return json(res, 400, { error: "Login and password are required" });

    const gate = canAttemptLogin(login, ip);
    if (!gate.allowed) {
      return json(res, 429, { error: "Too many attempts", retryAfterSeconds: gate.retryAfterSeconds });
    }

    const userResult = await query("SELECT id, email, password_hash FROM admin_users WHERE email = $1 LIMIT 1", [login]);
    const user = userResult.rows[0];
    if (!user) {
      registerFailedLogin(login, ip);
      return json(res, 401, { error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      registerFailedLogin(login, ip);
      return json(res, 401, { error: "Invalid credentials" });
    }

    resetFailedLogin(login, ip);
    const token = createSessionToken(user);
    setSessionCookie(res, token);
    return json(res, 200, { ok: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    return serverError(res, error);
  }
};
