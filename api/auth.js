const bcrypt = require("bcryptjs");
const { query } = require("./_lib/db");
const { json, methodNotAllowed, serverError, getRequestBody } = require("./_lib/http");
const {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  setCsrfCookie,
  generateCsrfToken,
  validateCsrf,
  getSession,
  getRequestIp,
  canAttemptLogin,
  registerFailedLogin,
  resetFailedLogin
} = require("./_lib/auth");

function getAction(req) {
  const url = new URL(req.url, "http://localhost");
  return String(url.searchParams.get("action") || "").trim().toLowerCase();
}

async function handleCsrf(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");
  const token = generateCsrfToken();
  setCsrfCookie(res, token);
  return json(res, 200, { csrfToken: token });
}

async function handleSession(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");
  const session = getSession(req);
  if (!session) return json(res, 200, { authenticated: false });
  return json(res, 200, {
    authenticated: true,
    user: {
      id: session.sub,
      email: session.email
    }
  });
}

async function handleLogin(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");
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
}

async function handleLogout(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");
  if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });
  clearSessionCookie(res);
  return json(res, 200, { ok: true });
}

module.exports = async function handler(req, res) {
  try {
    const action = getAction(req);

    if (action === "csrf") return handleCsrf(req, res);
    if (action === "session") return handleSession(req, res);
    if (action === "login") return handleLogin(req, res);
    if (action === "logout") return handleLogout(req, res);

    return json(res, 404, { error: "Unknown auth action" });
  } catch (error) {
    return serverError(res, error);
  }
};
