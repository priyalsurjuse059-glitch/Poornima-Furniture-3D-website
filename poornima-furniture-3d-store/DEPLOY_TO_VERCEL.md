# Deploy Poornima Furniture to Vercel

## 1. Push the source to the empty GitHub repository

This source archive intentionally excludes `.env.local`, `.git`, and installed dependencies.

From this project folder, open a terminal and run:

```bash
git init -b main
git remote add origin https://github.com/priyalsurjuse059-glitch/Poornima-Furniture-3D-website.git
git add .
git commit -m "Add Poornima Furniture website"
git push -u origin main
```

If Git says the repository is already initialized, check `git remote -v` before adding `origin` again. Do not upload `.env.local` or any service-role/payment secret.

## 2. Connect GitHub to the Vercel login

In Vercel, open your profile menu → **Settings** → **Authentication** (or **Sign-in methods**) → **Connect GitHub**, and authorize the same GitHub account that owns this repository. This is separate from connecting the Vercel integration to ChatGPT.

Official account documentation: https://vercel.com/docs/accounts

## 3. Import and deploy

In the Vercel dashboard, choose **Add New → Project**, import `priyalsurjuse059-glitch/Poornima-Furniture-3D-website`, and keep the detected framework as **Next.js**. Use the repository root as the root directory. Build command: `npm run build` (or let Vercel auto-detect it).

Add these environment variables in Vercel for **Production**, **Preview**, and **Development**:

- `NEXT_PUBLIC_SUPABASE_URL` — the Project URL from Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the public anon/publishable key from Supabase
- `NEXT_PUBLIC_BUSINESS_NAME` — `Poornima Furniture`
- `NEXT_PUBLIC_BUSINESS_ADDRESS` — `Sutgirni, Hingna Road, Nagpur, Maharashtra, India`
- `NEXT_PUBLIC_SITE_URL` — the final deployed `https://….vercel.app` URL once Vercel assigns it

Optional, after confirming details with the shop owner:

- `NEXT_PUBLIC_BUSINESS_PHONE`
- `NEXT_PUBLIC_BUSINESS_WHATSAPP` (country code + digits)
- `NEXT_PUBLIC_BUSINESS_HOURS`

Never set a service-role key under a `NEXT_PUBLIC_` variable or commit secrets. If a server-only secret is later needed, add it only in Vercel Project Settings → Environment Variables.

## 4. Verify before public launch

After deployment, open the provided Vercel URL and check `/`, `/catalogue`, `/showroom`, `/cart`, and `/admin/login`. Run `npm run build` and `npm test` locally or check the Vercel build log; this project has not yet had a successful verified production build in the authoring environment because dependency installation timed out there. Configure Supabase Auth redirect URLs and verify the owner admin account/role before using `/admin`. The site is not a live-payment checkout; cart actions are a shortlist/quotation workflow.
