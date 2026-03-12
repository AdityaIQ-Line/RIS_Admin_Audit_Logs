# Radiology V2 (Admin) — Audit Logs

Admin audit logs module for Radiology RIS: Image Access & Viewing Logs and related audit trails.

## Setup

```bash
npm install
npm run dev
```

Runs at [http://localhost:5178](http://localhost:5178).

## Build

```bash
npm run build
```

Output: `dist/`

## Preview / QC for PM

This repo is set up for **Vercel** so the PM can review a live preview.

### One-time: Connect to Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. **Add New Project** → Import the GitHub repo.
4. Leave defaults (Vite is auto-detected; build command `npm run build`, output `dist`).
5. Deploy. Vercel will give you:
   - **Production URL** — e.g. `https://your-project.vercel.app`
   - **Preview URLs** — every push to a branch and every PR get a unique preview link.

### Sharing a preview with PM

- **Main branch:** Share the production URL (e.g. `https://your-project.vercel.app`).
- **Feature/QC branch:** Push the branch, open the deployment in Vercel Dashboard → **Deployments** → open the deployment → copy the **Preview** URL and share it.
- **Pull request:** Each PR gets a comment with the preview URL; share that link for QC.

### Direct links for QC

- Production: `https://<your-vercel-project>.vercel.app`
- Audit logs hub: `https://<your-vercel-project>.vercel.app/admin/audit-logs`
- Image Access & Viewing Logs: `https://<your-vercel-project>.vercel.app/admin/image-access-viewing-logs`

(Replace `<your-vercel-project>` with your Vercel project name.)
