const { json, methodNotAllowed, serverError } = require("../_lib/http");
const { generateCsrfToken, setCsrfCookie } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");

  try {
    const token = generateCsrfToken();
    setCsrfCookie(res, token);
    return json(res, 200, { csrfToken: token });
  } catch (error) {
    return serverError(res, error);
  }
};
