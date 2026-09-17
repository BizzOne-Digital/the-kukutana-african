# Kukutana African American History & Culture Museum

Production Next.js (App Router) + TypeScript + Tailwind CSS + MongoDB website
for the Kukutana museum, with a full admin panel for managing content,
collections, pricing, bookings, testimonials, media, and site settings.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- MongoDB Atlas + Mongoose
- Admin session auth via signed HttpOnly cookies (`jose`)
- Image uploads stored in MongoDB (`StoredUpload`) — no local disk writes,
  safe for Vercel/serverless
- Deployable on Vercel or any Node.js serverless host

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `ADMIN_SESSION_SECRET` — a long random string
   - `NEXT_PUBLIC_SITE_URL` — e.g. `http://localhost:3000`
   - `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — used only by the seed script

2. Install dependencies:
   ```
   npm install
   ```

3. Seed initial content (collections, pricing, demo testimonials, and the
   first admin user). Safe to re-run — it only creates documents that don't
   already exist:
   ```
   npm run seed
   ```

4. Run the dev server:
   ```
   npm run dev
   ```

5. Sign in to `/admin/login` with the seeded admin credentials, then use the
   admin panel to replace placeholder images and copy with real museum
   content.

## Notes

- `SiteSettings`, `HomeContent`, and `AboutContent` are singleton documents
  that are created automatically (with sensible defaults) the first time
  they're requested — the seed script intentionally does not touch them.
- All images are uploaded through `/api/upload` and stored in MongoDB, then
  served back through `/api/uploads/:folder/:filename` with long-lived
  immutable caching. Legacy `/uploads/...` paths (from local-disk storage)
  are automatically replaced with a placeholder since they cannot survive a
  serverless redeploy.
- Every admin-mutating API route re-verifies the session server-side via
  `requireAdmin()` — middleware alone only protects page navigation.
