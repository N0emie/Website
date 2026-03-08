function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function methodNotAllowed(res, allow) {
  res.setHeader("Allow", allow);
  return json(res, 405, { error: "Method not allowed" });
}

function serverError(res, error) {
  console.error(error);
  if (error && /too large/i.test(String(error.message || ""))) {
    return json(res, 413, { error: "Request body is too large" });
  }
  if (error && /invalid json/i.test(String(error.message || ""))) {
    return json(res, 400, { error: "Invalid JSON body" });
  }
  return json(res, 500, { error: "Internal server error" });
}

function getRequestBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  return new Promise((resolve, reject) => {
    const maxBodyBytes = Number(process.env.MAX_BODY_BYTES || 1024 * 1024);
    let data = "";
    req.on("data", (chunk) => {
      if (data.length + chunk.length > maxBodyBytes) {
        reject(new Error("Request body is too large"));
        return;
      }
      data += chunk;
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

module.exports = {
  json,
  methodNotAllowed,
  serverError,
  getRequestBody
};
