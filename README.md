# Веб‑сайт «Сергей Королёв — основоположник практической космонавтики»

Проект состоит из двух частей:

- `backend` — API на FastAPI + SQLAlchemy + SQLAdmin  
  По умолчанию используется **SQLite** (файл `test.db` в корне проекта).
- `frontend` — SPA на React + Vite + Tailwind CSS

## Что нужно установить

- `Git`
- `Python 3.11+`
- `Node.js 18+` и `npm`

Проверка версий:

```bash
git --version
python --version
node --version
npm --version
```

## Локальный запуск

### Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Проверка:

- API: `http://localhost:8000/docs`
- Админка: `http://localhost:8000/admin`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

По умолчанию frontend ходит в backend по адресу `http://localhost:8000`.

## Где менять адрес backend для фронтенда

Во фронтенде используется переменная окружения:

- `VITE_API_BASE_URL`

Пример для локальной разработки (не обязателен, потому что есть дефолт `http://localhost:8000`):

```bash
cd frontend
$env:VITE_API_BASE_URL="http://localhost:8000"
npm run dev
```

## Важно про контент и базы данных

### Откуда берётся контент

Большая часть контента создаётся при первом запуске backend через сидинг (`seed_if_empty`) из файлов:

- `backend/app/seed.py`
- `backend/app/*_content.py`

### Почему вы можете “не видеть изменения”

Если база уже была заполнена, то сидинг **не перезапишет** данные автоматически.

Есть 2 рабочих сценария:

#### Вариант А (проще): очистить/пересоздать БД SQLite

1. Остановите backend.
2. Удалите файл `test.db` в корне репозитория.
3. Запустите backend снова — база создастся заново и применится сидинг.

#### Вариант Б: править данные в админке

1. Запустите backend.
2. Откройте `http://localhost:8000/admin`
3. Найдите таблицу/модель `AboutContent` (или нужную вам сущность) и отредактируйте поля.

### Как “вынести” сайт (деплой) и что делать с БД

Ниже два подхода. Для учебного/портфолио проекта обычно хватает **Варианта 1**.

#### Вариант 1 (самый простой): frontend отдельно + backend отдельно, БД PostgreSQL

- **Frontend**: Vercel
- **Backend**: Render / Railway / любой VPS
- **База данных**: Managed PostgreSQL (Render/Railway/Supabase/Neon)

Что нужно сделать по шагам:

1) **Залить проект на GitHub**

```bash
git add .
git commit -m "Deploy-ready"
git push
```

2) **Поднять PostgreSQL**

Создайте PostgreSQL в выбранном сервисе и получите строку подключения вида:

`postgresql+psycopg2://USER:PASSWORD@HOST:PORT/DBNAME`

3) **Переключить backend с SQLite на PostgreSQL**

В файле `backend/app/database.py` замените `DATABASE_URL` на строку PostgreSQL и уберите `connect_args` (они нужны только для SQLite).

Также установите драйвер:

```bash
cd backend
pip install psycopg2-binary
```

4) **Деплой backend**

Для Render (пример):

- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
- Environment variables:
  - `DATABASE_URL` (ваша строка PostgreSQL)

5) **Деплой frontend**

На Vercel:

- Root Directory: `frontend`
- Environment variables:
  - `VITE_API_BASE_URL=https://<your-backend-domain>`

6) **Проверка**

- Откройте сайт на Vercel
- Проверьте страницы: главная, «О проекте», «Мифы», разделы

#### Вариант 2 (максимально просто, но “не идеально”): оставить SQLite

SQLite подходит для локалки, но для “настоящего” сервера это рискованно:

- файл БД может потеряться при пересборке/перезапуске контейнера
- сложно делать бэкапы/миграции
- параллельные записи ограничены

Если всё же хотите SQLite на VPS, то нужно:

- хранить файл БД на постоянном диске (volume)
- регулярно делать бэкап `test.db`
- понимать, что это не вариант для нагрузки

### Бэкапы (если PostgreSQL)

- Делайте регулярный дамп:
  - `pg_dump` → файл `.sql`
- Храните бэкапы отдельно от сервера (Google Drive/Яндекс.Диск/S3)

## Структура проекта

- `backend/app/main.py` — API-эндпоинты
- `backend/app/models.py` — модели БД
- `backend/app/schemas.py` — схемы ответов/запросов
- `backend/app/database.py` — подключение к БД
- `backend/app/admin.py` — SQLAdmin
- `backend/app/seed.py` — сидинг данных
- `frontend/src/pages/App.tsx` — главная
- `frontend/src/pages/SectionPage.tsx` — страницы разделов
- `frontend/src/pages/AboutPage.tsx` — «О проекте»
- `frontend/src/pages/MythsPage.tsx` — «Мифы»

