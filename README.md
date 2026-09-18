# DX Living Frontend

Next.js App Router site for DX Living, rebuilt from the WordPress-backed reference (`reference1`) using the Payload CMS patterns from `reference2`.

## Getting started

```bash
npm install
cp .env.example .env
# Edit DATABASE_URI + PAYLOAD_SECRET
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) for Payload.

### Payload CMS (local Postgres)

```bash
docker run -d --name dxliving-postgres \
  -e POSTGRES_USER=payload \
  -e POSTGRES_PASSWORD=payload \
  -e POSTGRES_DB=dxliving_cms \
  -p 5432:5432 \
  postgres:16-alpine

# later:
# docker start dxliving-postgres
```

## What this step includes

- DX Living homepage UI (hero, modules, project gallery, comparisons, FAQ preview, shell)
- Payload `Home` global (editable sections + SEO)
- Code fallbacks when CMS/DB is unavailable (same resilience pattern as reference2)
- Media / Users collections for admin uploads and auth

## Structure

- `src/app/(frontend)/pages/home` — marketing homepage (`/` rewrite)
- `src/app/(payload)` — Payload admin (`/admin`) and API
- `src/globals/Home.ts` — homepage CMS schema
- `src/lib/home/getHomePageContent.ts` — Payload → frontend mapper
- `reference1/` / `reference2/` — local references (gitignored from the app build)

## Next phases

Other reference1 pages (about, modules, projects, articles, etc.) will follow the same Payload global/collection pattern.
