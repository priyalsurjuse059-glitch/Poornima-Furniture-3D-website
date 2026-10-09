# Build and deployment status

- Source: Next.js App Router website source is prepared in this folder.
- Local verification: dependency installation timed out in the authoring environment, so typecheck, lint, tests, and a production build have not been verified here.
- GitHub: the owner-created repository exists, but is empty as of the deployment attempt. The GitHub connector denied write calls, so source has not yet been pushed.
- Vercel: the account connection is visible, but Vercel rejected project creation/linking because a GitHub Login Connection is not configured for that Vercel account. No live deployment URL exists yet.
- Source archive: exclude `.env.local`, `.git`, and `node_modules`; use `DEPLOY_TO_VERCEL.md` for GitHub push and deployment setup.
- Backend/environment: configure the Supabase URL and public anon/publishable key in Vercel settings. Confirm the owner admin account and Auth redirect URLs before production use.
- Product media, shop phone/WhatsApp and opening hours still need owner-approved values.
