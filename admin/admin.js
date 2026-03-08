(function () {
  let csrfToken = "";

  function toast(message) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  async function ensureCsrf() {
    if (csrfToken) return csrfToken;
    const res = await fetch("/api/auth/csrf", { credentials: "include" });
    const raw = await res.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error("API недоступно. Запустите проект через `vercel dev` или откройте деплой на Vercel.");
    }
    if (!res.ok) {
      throw new Error(data.error || "Не удалось получить CSRF токен");
    }
    csrfToken = data.csrfToken || "";
    if (!csrfToken) {
      throw new Error("CSRF токен не получен");
    }
    return csrfToken;
  }

  async function api(path, options) {
    const opts = Object.assign({ credentials: "include" }, options || {});
    const method = (opts.method || "GET").toUpperCase();

    if (!opts.headers) opts.headers = {};

    if (opts.body && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(opts.body);
    }

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const token = await ensureCsrf();
      opts.headers["x-csrf-token"] = token;
    }

    const res = await fetch(path, opts);
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  async function requireAuth() {
    const data = await api("/api/auth/session");
    if (!data.authenticated) {
      window.location.href = "/admin/login";
      return null;
    }
    return data.user;
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function uploadImage(file) {
    const reader = new FileReader();
    const dataBase64 = await new Promise((resolve, reject) => {
      reader.onload = () => {
        const raw = String(reader.result || "");
        const parts = raw.split(",");
        resolve(parts[1] || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const payload = {
      filename: file.name,
      contentType: file.type,
      dataBase64
    };
    const result = await api("/api/admin/upload", { method: "POST", body: payload });
    return result.url;
  }

  window.AdminApp = {
    api,
    toast,
    requireAuth,
    logout,
    uploadImage
  };
})();
