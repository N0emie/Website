# Dizband Admin + Backend

## Выбранная архитектура

Проект сейчас статический (без Next.js), поэтому выбран минимально инвазивный и совместимый с Vercel подход:

- Backend: Vercel Serverless Functions в `/api/*`.
- БД: PostgreSQL (`pg`) через `DATABASE_URL` (Neon/Supabase/Postgres).
- Auth: логин+пароль, хеш пароля `bcryptjs`, сессия JWT в `httpOnly` cookie.
- CSRF: double-submit token (`/api/auth/csrf` + заголовок `x-csrf-token`).
- Upload изображений: Vercel Blob через `@vercel/blob`.
- Admin UI: статические страницы `/admin/*` + JS-клиент к API.

Почему так:

- не ломает текущую публичную вёрстку;
- работает на Vercel без отдельного сервиса;
- легко сопровождать (простые API и SQL-миграции).

## Что сделано

- Миграция БД: `sql/migrations/001_init.sql`
- Таблицы:
  - `admin_users`
  - `site_assets`
  - `tournaments`
- API:
  - Auth: `/api/auth/csrf`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`
  - Admin: `/api/admin/setup`, `/api/admin/keys`, `/api/admin/assets`, `/api/admin/upload`, `/api/admin/tournaments`, `/api/admin/tournament?id=...`
  - Public: `/api/public/content`
- Админка:
  - `/admin/login`
  - `/admin`
  - `/admin/media`
  - `/admin/tournaments`
  - `/admin/tournaments/new`
  - `/admin/tournaments/:id` (rewrite -> `edit.html?id=:id`)
- Контент ключи: `api/_lib/content-keys.js`
- Публичный сайт:
  - кнопка входа в админку добавлена в правое меню;
  - турниры и управляемые картинки подтягиваются из `/api/public/content` через `js/cms-content.js`.

## ENV переменные

См. `.env.example`:

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_SEED_LOGIN`
- `ADMIN_SEED_PASSWORD`
- `BLOB_READ_WRITE_TOKEN`
- `MAX_UPLOAD_MB`

## Локальный запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` на основе `.env.example`.

3. Применить миграции:

```bash
npm run db:migrate
```

4. (Опционально) добавить content keys:

```bash
npm run db:seed:assets
```

5. Создать/обновить админа:

```bash
npm run admin:create
```

6. Запуск сайта:

```bash
python -m http.server 5173
```

Для API/routes в локальной разработке предпочтительнее `vercel dev`.

## Деплой на Vercel

1. Импортировать репозиторий в Vercel.
2. Добавить env-переменные из `.env.example`.
3. Подключить Postgres (Neon/Supabase) и Blob token.
4. Запустить миграцию (`npm run db:migrate`) в CI/ручным one-off.
5. После деплоя открыть `/admin/login` и войти.

## Минимальные сценарии проверки

1. Логин в админке (`/admin/login`).
2. Upload изображения в `/admin/media` и сохранение ключа.
3. Создание турнира в `/admin/tournaments/new`.
4. Проверка отображения турнира на публичной странице в секции "Наши турниры".
