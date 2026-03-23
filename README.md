# prerender-poc

Separate frontend/backend PoC to test prerender behavior with:
- one fully static page
- one page calling a public API
- one page calling a protected API

## Structure

- `FE`: Vite + React SPA (3 routes)
- `BE`: Node.js + Express mock API service
- `docker-compose.yml` (root): optional local orchestration of both FE and BE

## Routes

- `GET /` -> static page (no API call)
- `GET /public-api` -> calls `${VITE_API_BASE_URL}/api/public/news`
- `GET /protected-api` -> calls `${VITE_API_BASE_URL}/api/protected/profile` with token

## Backend APIs

- Public: `GET /api/public/news`
- Protected: `GET /api/protected/profile`
  - expected header: `Authorization: Bearer prerender-poc-token`

## Local run without Docker

Terminal 1:

```bash
cd BE
npm install
npm run dev
```

Terminal 2:

```bash
cd FE
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

Create FE env file:

```bash
cd FE
cp .env.example .env
```

Set API domain in `FE/.env`:

```bash
VITE_API_BASE_URL=https://api-def.com
```

For local testing, you can set:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

## Docker run

From project root:

```bash
docker compose up --build
```

- Frontend (Nginx): `http://localhost:8080`
- Backend: `http://localhost:4000`

In this version, FE and BE are domain-independent. FE calls the API host defined by `VITE_API_BASE_URL`, and FE Nginx only serves static SPA files (no `/api` proxy).
