const { json, methodNotAllowed, serverError } = require("../_lib/http");
const { getSession } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");

  try {
    const session = getSession(req);
    if (!session) return json(res, 200, { authenticated: false });
    return json(res, 200, {
      authenticated: true,
      user: {
        id: session.sub,
        email: session.email
      }
    });
  } catch (error) {
    return serverError(res, error);
  }
};
