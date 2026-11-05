# Stackly Learning Platform

React + TypeScript frontend based on the provided 58-page design PDF. The design inventory and implementation notes are in [docs/architecture.md](docs/architecture.md).

## Run

```bash
npm install
npm run dev
```

The default authenticated workspace is `/` for organization users. The separate learning-platform landing page is `/learn`. The Platform Super Admin portal is `/platform`, with organization management at `/platform/organizations`. Authentication screens are available at `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, and `/activate`.

## Mock API

The default `.env` enables MSW-backed REST mocks while keeping Axios as the HTTP client:

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=/api
```

Set `VITE_USE_MOCK_API=false` and configure `VITE_API_BASE_URL` to use a backend with the same REST contracts. Browser mock requests require Service Worker support.

In mock mode, `/auth/me` returns a Platform Super Admin role so the platform portal can be explored. The client route guard is not a security boundary; production APIs must independently enforce platform authorization.

## Checks

```bash
npm run lint
npm run build
```