# Stage 0 Audit Report (dizband.ru)

Date: 2026-03-08
Branch: `chore/project-audit-performance`

## 1) Tech Stack & Runtime

- Frontend: static `index.html` + plain CSS/JS (no Vite/Webpack/Parcel frontend bundler).
- Backend: Vercel serverless functions in `api/*` (Node.js + PostgreSQL).
- Admin panel: static HTML pages in `admin/*` that call API endpoints.
- Storage: Vercel Blob (with local fallback `assets/uploads/*` when token absent).
- Deploy config: `vercel.json` (rewrites are present; security headers are not configured yet).
- NPM scripts:
  - `build` (stub echo, no compile/minify pipeline)
  - `lint` (custom tabs-only lint for `api`, `scripts`, `admin`)
  - `db:migrate`, `db:seed:assets`, `admin:create`

## 2) Project Map (Current)

- Main page: `index.html`
- Public scripts:
  - `js/script.js` (main behavior, modals, nav, loading, effects)
  - `js/cms-content.js` (CMS/API data binding and tournament rendering)
  - legacy/alt files: `js/script.min.js`, `js/script_old.js`
- Public styles:
  - `css/style.css` (main, very large)
  - `css/loading.css`
  - `css/examp-effects.css`
  - `css/rectangular-services.css`
  - `css/service-modal.css`
  - legacy/alt: `css/style.min.css`
- Admin:
  - `admin/login.html`, `admin/index.html`, `admin/media.html`, `admin/tournaments/*`
  - `admin/admin.css`, `admin/admin.js`
- API:
  - `api/auth/*`, `api/admin/*`, `api/public/content.js`, helpers in `api/_lib/*`
- DB:
  - `sql/migrations/*`

## 3) Heavy Assets / Performance Hotspots

Top heavy files found:

- `assets/services/technical.gif` ~ 7.7 MB
- `assets/services/stream.gif` ~ 7.7 MB
- `assets/webp/octopuszaggg.mp4` ~ 5.3 MB
- `assets/services/prize.gif` ~ 5.1 MB
- `hero-video.mp4` ~ 3.2 MB
- Multiple `assets/video/video*.mp4` ~ 1.3-3.6 MB each
- `css/style.css` ~ 166 KB (large for unminified main stylesheet)
- `js/script.js` ~ 61 KB + extensive inline JS still in `index.html`
- Duplicate/legacy asset/code variants (`script_old.js`, `style.min.css`, old logs)

Font duplication present:

- many formats for same family (`ttf`, `otf`, `woff`, `woff2`, `eot`) + large standalone `assets/fonts/pinnacle.ttf`.

## 4) Code Smells / Maintainability Issues

### HTML/Structure
- `index.html` is very large and mixes:
  - full page markup,
  - large inline scripts,
  - modal templates,
  - behavior logic.
- Duplicate resource hints in `<head>` (preconnect/dns-prefetch/preload repeated).
- Mixed encoding artifacts in text/meta (mojibake visible in source).

### CSS
- Monolithic `css/style.css` with many concerns mixed.
- Parallel style files + legacy `style.min.css`; unclear source-of-truth.
- Potential duplicate rules between `style.css`, `rectangular-services.css`, `service-modal.css`.

### JS
- Very verbose debug logging across `js/script.js` (+ legacy script files).
- Same domain behavior split between:
  - inline script blocks in `index.html`,
  - `js/script.js`,
  - `js/cms-content.js`.
- Tournament/service modal logic appears in several places (risk of regressions and conflicts).

### Repository hygiene
- Runtime artifacts/logs in repo root (`server.log`, `serve.*.log`).
- Legacy files likely not used in production still tracked.

## 5) Security & Reliability Findings (Stage 0)

What exists already:
- JWT session cookie, CSRF token flow, basic login rate-limit.
- Upload type/size checks and filename sanitization.

Gaps:
- No security headers in `vercel.json` (CSP, XCTO, Referrer-Policy, Permissions-Policy, HSTS).
- Custom `getRequestBody` has no explicit body-size cap (DoS risk surface).
- `index.html` currently contains inline scripts; strict CSP requires nonce/hash strategy or migration to external files first.

## 6) Risks / What We Should Not Break

Critical UX that must remain visually identical:
- Hero section and current typography/layout.
- Services cards + opening modal behavior.
- Tournaments carousel behavior (including drag vs click handling and modal opening).
- Top-right icon menu behavior and admin-login icon entry.
- Existing admin panel workflows.

## 7) Priority Plan (Next Stages)

### P0 (do first)
1. Baseline safety net:
   - freeze behavior with smoke checklist (hero, menu, modals, tournaments, admin login/create/edit).
2. Move inline JS from `index.html` into modular files (no behavior change).
3. Remove duplicate/unused legacy files from runtime path (keep backups in git history, not active imports).

### P1 (high impact perf)
1. Optimize largest media on critical path:
   - replace heavy GIFs with MP4/WebM where possible,
   - keep visual result same.
2. Add lazy loading and dimensions (`width`/`height`) for below-fold media/images.
3. De-duplicate head preloads/preconnects and keep only actually used critical ones.

### P2 (maintainability)
1. Split CSS by sections (header/hero/services/tournaments/about/footer/modals).
2. Split JS by modules (nav, loading, modals, tournaments, forms, cms binding).
3. Introduce a small build/minify step (lightweight, no heavy framework migration).

### P3 (security + quality)
1. Add `vercel.json` security headers (incremental CSP rollout).
2. Add request-size guard in API body parser.
3. Improve lint/format (`eslint` + `prettier`) and add CI workflow.
4. Update README + add `.editorconfig`.

## 8) Acceptance Criteria for Stage 1+2+3

- No visible UI redesign.
- Existing interactions preserved.
- Build/lint pass after each stage.
- Page weight/time-to-interactive improved qualitatively and by top-file reductions.
