# Dizband - Сайт-визитка организации киберспортивных турниров

## Описание
Профессиональный сайт-визитка для организации киберспортивных турниров Dizband. Сайт включает в себя современный дизайн с анимациями, адаптивную верстку и интерактивные элементы.

## Особенности
- ✨ Современный дизайн с неоновыми эффектами
- 🎮 Анимированный загрузочный экран с буквами DIZBAND
- 📱 Полностью адаптивная верстка для всех устройств
- 🎯 Интерактивные элементы и анимации
- 🎨 Кастомные эффекты и переходы
- 📧 Контактная форма для заказа турниров

## Структура проекта
```
website/
├── index.html              # Главная страница
├── css/
│   ├── style.css          # Основные стили
│   └── examp-effects.css  # Эффекты и анимации
├── js/
│   └── script.js          # JavaScript функциональность
├── assets/                # Изображения и медиа файлы
│   ├── 69.png            # Логотип Dizband
│   ├── telegram.png      # Иконка Telegram
│   ├── youtube.png       # Иконка YouTube
│   ├── twitch.png        # Иконка Twitch
│   └── ...               # Другие изображения
└── README.md             # Этот файл
```

## Запуск сайта
1. Распакуйте архив в любую папку
2. Откройте файл `index.html` в браузере
3. Или запустите локальный сервер:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve .
   ```

## Контакты
- **Telegram**: [@Dark0mie](https://t.me/Darkomie)
- **Email**: [hello@dizband.media](mailto:hello@dizband.media)
- **YouTube**: [@dizband](https://youtube.com/@dizband)
- **Twitch**: [dizband](https://twitch.tv/dizband)

## Технологии
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Адаптивный дизайн

## Изменения в последней версии
- ✅ Полный ребрендинг с Aurora9 на Dizband
- ✅ Обновлен загрузочный экран с новыми буквами DIZBAND
- ✅ Изменена цветовая схема на сине-фиолетовую
- ✅ Обновлены все контактные данные и социальные сети
- ✅ Увеличен логотип YouTube на 30%
- ✅ Убрано свечение у логотипа в левом верхнем углу
- ✅ Обновлены мета-теги и заголовки страницы

---
© 2025 Dizband. Все права защищены.

## Admin Backend

Backend/admin setup and Vercel deployment guide:

- `ADMIN_BACKEND.md`

Main commands:

- `npm run db:migrate`
- `npm run db:seed:assets`
- `npm run admin:create`

## Developer Quickstart (updated)

Local run:

1. `npm install`
2. Create `.env.local` based on `.env.example`
3. `npm run db:migrate`
4. `npm run admin:create`
5. Start local server (static + API workflow):
   - `vercel dev`
   - or your current static server command for frontend-only checks

Quality checks:

- `npm run lint`
- `npm run build`

Current structure (high-level):

- `index.html` - public page entry
- `css/style.css` - stylesheet entry with section imports
- `css/style.*.css` - sectioned CSS modules (foundation, hero, sections, modal/nav, etc.)
- `js/script.js` - main public interactions
- `js/modules/*` - extracted runtime modules (Lenis init, modal bridge logic)
- `js/cms-content.js` - CMS/public content binding
- `admin/*` - admin pages
- `api/*` - Vercel serverless backend
- `sql/migrations/*` - database schema migrations
