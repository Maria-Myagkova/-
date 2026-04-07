# Веб-сайт «Сергей Королёв — основоположник практической космонавтики»

Полноценный проект состоит из двух частей:

- **backend** — API на FastAPI + PostgreSQL + SQLAlchemy + SQLAdmin
- **frontend** — одностраничное приложение на React + Vite + Tailwind CSS

## Backend

Структура:

- `app/main.py` — точка входа FastAPI, все публичные эндпоинты (`/timeline`, `/sections`, `/about`, `/myths`, `/myths/{id}/vote`, `/admin`)
- `app/models.py` — модели БД: `TimelineEvent`, `Section`, `Subsection`, `MediaFile`, `Myth`, `AboutContent`
- `app/schemas.py` — Pydantic-схемы для ответов/запросов
- `app/database.py` — конфигурация SQLAlchemy и подключение к PostgreSQL
- `app/admin.py` — настройка SQLAdmin и регистрация моделей в админке

### Запуск backend

1. Создайте и активируйте виртуальное окружение (локально, вне Cursor-среды):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Настройте строку подключения в `app/database.py` (`DATABASE_URL`) под вашу инсталляцию PostgreSQL.

3. Запустите сервер:

```bash
uvicorn app.main:app --reload --port 8000
```

Админка будет доступна по адресу `/admin`.

## Frontend

Структура:

- `src/pages/App.tsx` — главная `/` с таймлайном-орбитой и ракетой-навигацией
- `src/pages/SectionPage.tsx` — страница раздела `/sections/:slug` с якорной навигацией и медиа
- `src/pages/AboutPage.tsx` — страница «О проекте» `/about`
- `src/pages/MythsPage.tsx` — страница «Мифы о Королёве» `/myths` с двумя режимами
- `src/components/Timeline.tsx` — круговой таймлайн с анимацией (Framer Motion)
- `src/components/RocketNav.tsx` — стилизованная ракета с кнопками разделов

### Запуск frontend

1. Установите зависимости (локально):

```bash
cd frontend
npm install
```

2. Запустите dev-сервер:

```bash
npm run dev
```

По умолчанию фронтенд ожидает backend на `http://localhost:8000`.

## Дальнейшая доработка

- Подключить Alembic для миграций.
- Настроить загрузку реальных медиафайлов в SQLAdmin.
- Вынести цитату Королёва в отдельную модель/эндпоинт.
- Добавить адаптивные правки и мелкие анимации под мобильные устройства.

