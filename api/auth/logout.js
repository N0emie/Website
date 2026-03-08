const { json, methodNotAllowed, serverError } = require("../_lib/http");
const { clearSessionCookie, validateCsrf } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");

  try {
    if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });
    clearSessionCookie(res);
    return json(res, 200, { ok: true });
  } catch (error) {
    return serverError(res, error);
  }
};
