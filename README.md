# The Laban Hospital Website

A React + TypeScript + Vite site for The Laban Hospital, deployed on Vercel.
No login for patients, no login for admin — content is managed through a
hidden URL known only to your client.

## Architecture

- **Vercel Blob** — stores media files only: photos, videos (and any future
  PDFs/documents). Nothing else.
- **Neon (Postgres)** — stores everything structured: banner, offers,
  services, doctors, gallery captions/URLs, appointments, and contact
  messages. Proper normalized tables with UUID primary keys and timestamps
  — see `db/schema.sql`.
- **Vercel Functions** (`/api/*.ts`) — the backend. No Supabase, no
  Firebase, no Clerk, no separate login system.

## How content editing works

- Public visitors see the normal site — no sign-in anywhere.
- Your client edits everything by visiting a secret link:
  `https://yoursite.com/manage/<ADMIN_SECRET>`
- That link *is* the password. There's no separate login form — anyone who
  has the link can edit the site, anyone who doesn't, can't.
- Every add/edit/delete saves immediately to the database and appears on
  the public site right away. There's no "one big Save button" for the
  whole site — each item (a doctor, an offer, a gallery photo...) saves on
  its own.

**Keep the `/manage/...` link private.** If it ever leaks, generate a new
`ADMIN_SECRET` in Vercel and share the new link.

## One-time setup (you, the developer)

1. **Push this project to GitHub** and import it into Vercel as normal.

2. **Create a Neon database**: Vercel dashboard → your project → **Storage**
   → **Create Database** → **Neon** (or **Postgres**). This automatically
   adds a `DATABASE_URL` environment variable to your project.

3. **Run the schema**: open the Neon database's **SQL Editor** (from the
   same Storage tab, or via Neon's own dashboard) and run everything in
   `db/schema.sql`. This creates all the tables and seeds the 8 default
   services so the site isn't empty on first load.

4. **Enable Vercel Blob**: same **Storage** tab → **Create Database** →
   **Blob**. This adds a `BLOB_READ_WRITE_TOKEN` automatically. Make sure
   **Public Access** is turned on for this store (Blob store → Settings) —
   photos and videos need to be directly viewable by visitors, unlike the
   database content.

5. **Set your admin secret**: Project → **Settings** → **Environment
   Variables** → add:
   ```
   ADMIN_SECRET = <a long random string>
   ```
   Generate one with `openssl rand -hex 16` or any password generator.

6. **Redeploy** so the new environment variables take effect.

7. Your client's private editing link is now:
   `https://yoursite.com/manage/<the ADMIN_SECRET you set>`

## Local development

```bash
npm install
npm run dev
```

The `/api` routes (and therefore the admin panel) only work when running
through Vercel's own dev server (`vercel dev`), not plain `vite dev`, since
they need a real Neon connection and Blob token. For local testing, create
a `.env` file (see `.env.example`) pointing at your Neon database.

## Project structure

```
db/
  schema.sql        Run once against Neon - creates all tables + seed data

server/             Shared backend helpers (NOT routes - just imported by api/*.ts)
  db.ts             Neon connection (the `sql` tagged-template function)
  auth.ts           Checks the x-admin-key header against ADMIN_SECRET
  cors.ts           Shared CORS + no-cache headers
  errorHandler.ts   Wraps every route so a bug returns JSON, not a crash

api/
  content.ts        GET (public) - aggregates banner+offers+services+doctors+gallery in one call
  banner.ts         PUT (admin) - update the single banner row
  offers.ts         POST/PUT/DELETE (admin) - offer CRUD
  services.ts       POST/PUT/DELETE (admin) - service CRUD
  doctors.ts        POST/PUT/DELETE (admin) - doctor CRUD
  gallery.ts        POST/PUT/DELETE (admin) - gallery item CRUD (metadata only; files live in Blob)
  appointments.ts   POST (public submit) / GET+PATCH (admin)
  messages.ts       POST (public submit) / GET+PATCH (admin)
  upload.ts         Authorizes direct browser -> Blob uploads (bypasses server body-size limits, needed for videos)

src/
  components/       Public site sections (Header, Hero, Services, Offers, Gallery, etc.)
  admin/            The hidden content-manager UI - one editor component per resource
  lib/api.ts        Frontend helpers that call the /api routes above
  lib/ContentContext.tsx   Loads public content once, shares it across components
```

## Notes on the "hidden URL" protection model

This is intentionally simple (no accounts, no passwords) at the owner's
request. It relies entirely on the URL staying secret — there's no
rate-limiting or lockout if someone guesses or leaks it. If your client's
needs grow (multiple staff editors, audit logs, etc.), a real login system
would be a more robust upgrade path later.
