# Веб-сайт «Сергей Королёв — основоположник практической космонавтики»

Проект состоит из двух частей:

- `backend` — API на FastAPI + PostgreSQL + SQLAlchemy + SQLAdmin
- `frontend` — SPA на React + Vite + Tailwind CSS

## Что нужно установить

Перед запуском/выгрузкой установите:

- `Git` — для загрузки кода и деплоя через репозиторий
- `Python 3.11+` — для backend
- `Node.js 18+` и `npm` — для frontend
- `PostgreSQL 14+` — база данных backend

Проверка версий:

```bash
git --version
python --version
node --version
npm --version
```

## Локальный запуск

### 1) Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Настройте строку подключения к БД в `backend/app/database.py` (`DATABASE_URL`), затем:

```bash
uvicorn app.main:app --reload --port 8000
```

Проверка:

- API: `http://localhost:8000/docs`
- Админка: `http://localhost:8000/admin`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

По умолчанию frontend работает с backend по адресу `http://localhost:8000`.

## Как выгрузить (деплой) сайт

Ниже самый простой и стабильный вариант:

- frontend на `Vercel`
- backend + PostgreSQL на `Render`

### Шаг 1. Подготовьте GitHub-репозиторий

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin <ВАШ_GITHUB_URL>
git push -u origin main
```

### Шаг 2. Деплой backend на Render

1. Зарегистрируйтесь на [Render](https://render.com/) и подключите GitHub.
2. Создайте `PostgreSQL` сервис в Render.
3. Создайте `Web Service` из папки `backend`.
4. Укажите:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. В переменных окружения добавьте `DATABASE_URL` (из созданной БД Render).
6. После деплоя получите URL вида `https://your-backend.onrender.com`.

### Шаг 3. Деплой frontend на Vercel

1. Зарегистрируйтесь на [Vercel](https://vercel.com/) и подключите GitHub.
2. Импортируйте проект, в качестве Root Directory выберите `frontend`.
3. Добавьте переменную окружения:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com`
4. Запустите деплой.
5. Получите публичный URL вида `https://your-site.vercel.app`.

### Шаг 4. Проверка после выгрузки

- Откройте главную страницу и проверьте переходы по разделам.
- Проверьте `/about` и `/myths`.
- На `Мифы` проверьте, что голосование отправляется на backend.
- Проверьте загрузку изображений в разделах.

## Важно про контент

Контент разделов берется из seed-данных backend (`backend/app/*_content.py` и `backend/app/seed.py`).

Если вы меняете тексты/подписи и не видите изменения:

1. Перезапустите backend.
2. Если данные уже были засеяны в БД, очистите таблицы или базу и заново запустите backend, чтобы сработал `seed_if_empty`.

## Последние крупные правки

За последние итерации в проекте были внесены большие изменения контента и отображения:

- выровнены заголовки и стили на страницах `О проекте`, `Работа в ОКБ`, `Проекты`, `Репрессии`, `Наследие`, `Первый полёт`;
- переработаны блоки текстов и подписи к изображениям (в т.ч. очистка префикса `Рис.`);
- обновлена структура разделов `Наследие` и `Работа в ОКБ` (новые подзаголовки, отступы, порядок блоков);
- улучшена навигация по разделам (скрытие пустых пунктов);
- внесены мобильные и визуальные правки карточек изображений и кнопок на странице `Мифы`.

Важно: большинство этих изменений находятся в seed-контенте backend.  
Чтобы увидеть актуальный результат после обновлений, обычно нужно:

1. Перезапустить backend.
2. Пересоздать/очистить БД и заново выполнить seed (если база уже была заполнена ранее).

## Структура проекта

- `backend/app/main.py` — основные API-эндпоинты
- `backend/app/models.py` — модели БД
- `backend/app/schemas.py` — схемы ответов/запросов
- `backend/app/database.py` — подключение к PostgreSQL
- `backend/app/admin.py` — SQLAdmin
- `frontend/src/pages/App.tsx` — главная
- `frontend/src/pages/SectionPage.tsx` — страницы разделов
- `frontend/src/pages/AboutPage.tsx` — «О проекте»
- `frontend/src/pages/MythsPage.tsx` — «Мифы»

