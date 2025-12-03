Supabase integration (server-side)
================================

This project includes an optional server-side Supabase integration that the development API server will use for the `visions` resource when the appropriate environment variables are present.

Files added
- `server/supabaseClient.ts` — TypeScript source for Supabase helpers (for reference / compile into JS if desired).
- `server/supabaseClient.js` — runtime JS wrapper used by `server/server.js` (no TS compile step required to run the dev server).
- `server/.env.example` — example env file with placeholders (DO NOT commit real keys).
- `supabase/migrations/001_create_visions.sql` — SQL to create the `visions` table and indexes.
- `supabase/policies/visions_rls.sql` — example RLS policies for `visions` (apply if using client-side access).

Environment variables
- `SUPABASE_URL` — your Supabase project URL (example: https://xyz.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY` — service_role key (admin). Keep this secret and never commit it.
- `PORT` — optional server port (defaults to 4000).

How to enable (locally)
1. Copy the example and add real values locally (do NOT paste keys into version control):

   ```bash
   cp server/.env.example server/.env
   # then edit server/.env and paste your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
   ```

2. Install server dependencies (from repository root):

   ```bash
   cd server
   npm install
   ```

3. Start the server:

   ```bash
   # from repo root
   npm run server
   # or: cd server && node server/server.js
   ```

4. Test the visions endpoints (example):

   ```bash
   # list
   curl -sS http://localhost:4000/api/visions

   # create
   curl -sS -X POST http://localhost:4000/api/visions \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"From curl","progress":0,"priority":"Low","date":"2025-12-03","year":2025}'
   ```

Notes & rollback
- The server will use Supabase for `visions` when both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present. If the Supabase client fails at runtime, the server falls back to the existing JSON-file persistence (`server-data.json`).
- Keep your JSON mock files — they are preserved for rollback and offline development.

Security reminder
- Never paste your `SUPABASE_SERVICE_ROLE_KEY` into chat or commit it to git. If you think the key has been exposed, rotate it immediately in the Supabase dashboard.

Optional: TypeScript usage
- The TS source `server/supabaseClient.ts` is provided as a development artifact. If you compile server TypeScript as part of your workflow, you can compile it and import the compiled output instead of the provided JS wrapper.
