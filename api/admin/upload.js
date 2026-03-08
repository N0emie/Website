const path = require("path");
const fs = require("fs/promises");
const { put } = require("@vercel/blob");
const { json, methodNotAllowed, serverError, getRequestBody } = require("../_lib/http");
const { requireAuth, validateCsrf } = require("../_lib/auth");

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeFilename(name) {
  const ext = path.extname(name || "").toLowerCase();
  const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".webp";
  const base = path.basename(name || "upload", ext).replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 64);
  return `${base || "image"}-${Date.now()}${safeExt}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");

  try {
    const session = requireAuth(req, res);
    if (!session) return;
    if (!validateCsrf(req)) return json(res, 403, { error: "Invalid CSRF token" });

    const body = await getRequestBody(req);
    const filename = sanitizeFilename(String(body.filename || "image.webp"));
    const contentType = String(body.contentType || "");
    const base64 = String(body.dataBase64 || "");

    if (!ALLOWED_TYPES.has(contentType)) return json(res, 400, { error: "Unsupported file type" });
    if (!base64) return json(res, 400, { error: "Missing file data" });

    const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || 5);
    const bytes = Buffer.from(base64, "base64");
    if (bytes.length > maxUploadMb * 1024 * 1024) {
      return json(res, 400, { error: `File is too large (max ${maxUploadMb} MB)` });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Local fallback for development without Vercel Blob token.
      const uploadDir = path.join(process.cwd(), "assets", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const localPath = path.join(uploadDir, filename);
      await fs.writeFile(localPath, bytes);
      return json(res, 200, { ok: true, url: `/assets/uploads/${filename}` });
    }

    const blob = await put(`uploads/${filename}`, bytes, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return json(res, 200, { ok: true, url: blob.url });
  } catch (error) {
    return serverError(res, error);
  }
};
