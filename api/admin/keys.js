const { SITE_ASSET_KEYS } = require("../_lib/content-keys");
const { json, methodNotAllowed, serverError } = require("../_lib/http");
const { requireAuth } = require("../_lib/auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");

  try {
    const session = requireAuth(req, res);
    if (!session) return;
    return json(res, 200, { keys: SITE_ASSET_KEYS });
  } catch (error) {
    return serverError(res, error);
  }
};
