const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { loadEnv } = require("./env");

const SESSION_COOKIE = "dizband_admin_session";
const CSRF_COOKIE = "dizband_csrf";

const failedLogins = new Map();

function getAuthSecret() {
  loadEnv();
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return secret;
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return raw.split(";").reduce((acc, part) => {
    const [k, ...rest] = part.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(rest.join("=") || "");
    return acc;
  }, {});
}

function buildCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || "/"}`);
  if (options.httpOnly) parts.push("HttpOnly");
  const secure = typeof options.secure === "boolean" ? options.secure : process.env.NODE_ENV === "production";
  if (secure) parts.push("Secure");
  parts.push(`SameSite=${options.sameSite || "Lax"}`);
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${options.maxAge}`);
  return parts.join("; ");
}

function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    buildCookie(SESSION_COOKIE, token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    buildCookie(SESSION_COOKIE, "", { httpOnly: true, maxAge: 0 })
  );
}

function setCsrfCookie(res, token) {
  res.setHeader("Set-Cookie", buildCookie(CSRF_COOKIE, token, { httpOnly: false, maxAge: 60 * 60 * 8 }));
}

function createSessionToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email
    },
    getAuthSecret(),
    { expiresIn: "7d" }
  );
}

function verifySessionToken(token) {
  try {
    return jwt.verify(token, getAuthSecret());
  } catch {
    return null;
  }
}

function getSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  return verifySessionToken(token);
}

function requireAuth(req, res) {
  const session = getSession(req);
  if (!session) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return null;
  }
  return session;
}

function generateCsrfToken() {
  return crypto.randomBytes(24).toString("hex");
}

function validateCsrf(req) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method || "")) return true;
  const cookies = parseCookies(req);
  const csrfCookie = cookies[CSRF_COOKIE];
  const csrfHeader = req.headers["x-csrf-token"] || req.headers["csrf-token"];
  return Boolean(csrfCookie && csrfHeader && csrfCookie === csrfHeader);
}

function loginAttemptKey(email, ip) {
  return `${(email || "").toLowerCase()}::${ip || "unknown"}`;
}

function getRequestIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded && typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function canAttemptLogin(email, ip) {
  const key = loginAttemptKey(email, ip);
  const state = failedLogins.get(key);
  if (!state) return { allowed: true, retryAfterSeconds: 0 };
  if (!state.blockedUntil || state.blockedUntil < Date.now()) return { allowed: true, retryAfterSeconds: 0 };
  return {
    allowed: false,
    retryAfterSeconds: Math.ceil((state.blockedUntil - Date.now()) / 1000)
  };
}

function registerFailedLogin(email, ip) {
  const key = loginAttemptKey(email, ip);
  const current = failedLogins.get(key) || { count: 0, blockedUntil: 0 };
  const count = current.count + 1;
  let blockedUntil = 0;
  if (count >= 5) {
    blockedUntil = Date.now() + 60 * 1000;
  } else if (count >= 3) {
    blockedUntil = Date.now() + 15 * 1000;
  }
  failedLogins.set(key, { count, blockedUntil });
}

function resetFailedLogin(email, ip) {
  const key = loginAttemptKey(email, ip);
  failedLogins.delete(key);
}

module.exports = {
  SESSION_COOKIE,
  CSRF_COOKIE,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  setCsrfCookie,
  createSessionToken,
  getSession,
  requireAuth,
  generateCsrfToken,
  validateCsrf,
  getRequestIp,
  canAttemptLogin,
  registerFailedLogin,
  resetFailedLogin
};
