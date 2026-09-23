# Sana Barekzai — Personal Website

This repository contains the React/Vite source for Sana Barekzai's personal website.

## Project structure

- `artifacts/web` — the website UI, routes, styling, and public assets
- `artifacts/web/public/images` — the website image assets
- `artifacts/api-server` — the contact form and admin API
- `lib/api-client-react`, `lib/api-spec`, and `lib/api-zod` — shared API contracts and generated client code

## Run locally

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/web run dev
```

The app uses the `PORT` and `BASE_PATH` environment variables supplied by the Replit workflow.