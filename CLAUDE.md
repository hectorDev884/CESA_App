# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CESA App is a web application for the CESA student committee at ITCG/TecNM. It manages student data, scholarships (becas), official letters (oficios), events, members, and financial records.

## Architecture

**Full-stack app with two separate roots:**

- `backend/` — Django 5 + Django REST Framework API
- `cesa_app/` — React 19 + Vite frontend

**Data layer uses two backends simultaneously:**
- **Supabase (PostgreSQL)** — primary database for all production data. The `Estudiante` model is `managed=False`, meaning Django never runs migrations for it; that table lives in Supabase.
- **SQLite** — local dev fallback when `DATABASE_URL` env var is not set.

**Authentication** is fully custom — it does NOT use Django's auth system or Supabase Auth. The frontend queries a `usuarios` table in Supabase directly via the JS client, hashes passwords with MD5, and stores a base64-encoded JSON "fake JWT" in `localStorage`. Roles: `1` = admin, `2` = regular user.

The frontend talks to two backends:
1. **Supabase JS client** (`src/supabaseClient.js`) — for auth (`usuarios`, `roles_usuario` tables) and Supabase-managed data.
2. **Django REST API** (`VITE_API_URL`, default `http://localhost:8000/api`) — for students, scholarships, PDF generation, Excel export/import, oficios, and backups.

## Commands

### Frontend (`cesa_app/`)
```bash
cd cesa_app
npm install        # install dependencies
npm run dev        # start dev server (Vite, port 5173)
npm run build      # production build
npm run lint       # ESLint
npm run preview    # preview production build
```

### Backend (`backend/`)
```bash
cd backend
python manage.py runserver          # start dev server (port 8000)
python manage.py migrate            # apply migrations
python manage.py makemigrations     # create new migrations
python manage.py test               # run tests
python manage.py test api           # run tests for a specific app
```

## Environment Variables

**Backend** (`backend/.env`):
```
SECRET_KEY=
DEBUG=True
DATABASE_URL=          # PostgreSQL URL; if unset, uses SQLite
ALLOWED_HOSTS=localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend** (`cesa_app/.env`):
```
VITE_SUPABASE_KEY=     # Supabase anon key
VITE_API_URL=http://localhost:8000/api
```

## Backend Django Apps

| App | Purpose |
|---|---|
| `api` | `Estudiante`, `Beca`, `AsistenciaBeca` — CRUD + PDF/Excel generation |
| `oficios` | Generates numbered official letters (PDF), sequential counters via `ContadorOficios` |
| `backups` | Runs `pg_dump` on the production DB and streams the `.sql` file |

All API routes are prefixed with `/api/`. Key endpoints:
- `GET/POST /api/estudiantes/` — paginated (10/page), supports search and ordering
- `POST /api/estudiantes/importar/` — bulk import from Excel
- `GET/POST /api/becas/` — scholarships
- `GET /api/pdf/asistencia/` — generates per-student attendance PDF
- `GET /api/pdf/asistencia_general/` — PDF for all approved scholarships
- `GET /api/reportes/becas/` — JSON stats dashboard
- `GET /api/reportes/becas/exportar/` — Excel export
- `POST /api/oficios/generar/` — create and number an official letter
- `GET /api/oficios/lista/` — list all letters

## Frontend Structure

- `src/context/AuthContext.jsx` — auth state, `signIn`/`register`/`logout`; reads/writes `localStorage` token
- `src/routes/ProtectedRoute.jsx` — redirects unauthenticated users to `/login`
- `src/routes/RoleRoute.jsx` — restricts routes by `user.rol` (admin-only: `/backup`, `/financiero`)
- `src/routes/GuestRoute.jsx` — redirects authenticated users away from `/login` and `/register`
- `src/services/api_becas_estudiante.js` — all Django API calls; uses `VITE_API_URL`
- `src/supabaseClient.js` — single Supabase client instance (used everywhere; `src/lib/supabase.js` is a duplicate that should not be used)
- `src/pages/` — one file per route
- `src/components/` — modals and forms used within pages

## Key Conventions

- The `Estudiante` model (`managed=False`) must never be included in Django migrations.
- Official letter numbering is transactional: `ContadorOficios` uses `select_for_update()` to avoid race conditions.
- PDF generation for scholarships (attendance sheets) uses ReportLab with automatic page breaks.
- Excel import/export uses `openpyxl`. Import expects columns: NC, nombre, apellido, email, carrera, semestre, telefono (row 1 = header).
- The backup endpoint requires `pg_dump` to be installed and `DATABASE_URL` to be set in the Django environment.
