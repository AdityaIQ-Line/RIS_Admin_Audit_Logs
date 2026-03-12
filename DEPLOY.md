# Deploy to GitHub + Preview link for PM QC

## 1. Create the GitHub repo

1. Open **https://github.com/new**
2. **Repository name:** e.g. `radiology-v2-admin-audit-logs` (or your choice)
3. **Visibility:** Private or Public
4. **Do not** add a README, .gitignore, or license (we already have them)
5. Click **Create repository**

## 2. Push this code to GitHub

In the project folder, run (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

```bash
cd "d:\Projects\RIS\Radiology V2 (Admin) - Audit Logs"

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

If GitHub shows you a URL like `https://github.com/YourOrg/radiology-audit-logs.git`, use that instead:

```bash
git remote add origin https://github.com/YourOrg/radiology-audit-logs.git
git branch -M main
git push -u origin main
```

## 3. Get a preview link for PM QC (Vercel)

1. Go to **https://vercel.com** and sign in with **GitHub**.
2. Click **Add New…** → **Project**.
3. **Import** the repo you just pushed (`radiology-v2-admin-audit-logs` or your repo name).
4. Leave settings as-is (Vite is auto-detected; build: `npm run build`, output: `dist`).
5. Click **Deploy**.

When the deploy finishes you get:

- **Production URL**  
  e.g. `https://radiology-v2-admin-audit-logs.vercel.app`  
  → This is the **preview link for PM QC**. Share it with the PM.

- **Preview URLs**  
  Every branch and every pull request gets its own URL, e.g.  
  `https://radiology-v2-admin-audit-logs-xxx.vercel.app`  
  → Use these for QC of specific branches or PRs.

### Direct links to share with PM

After the first deploy, share:

| Page | URL |
|------|-----|
| App root | `https://YOUR-PROJECT.vercel.app` |
| Audit logs hub | `https://YOUR-PROJECT.vercel.app/admin/audit-logs` |
| Image Access & Viewing Logs | `https://YOUR-PROJECT.vercel.app/admin/image-access-viewing-logs` |

Replace `YOUR-PROJECT` with your Vercel project name (e.g. `radiology-v2-admin-audit-logs`).

## 4. Later: push changes and new previews

- **Same branch:**  
  `git add . && git commit -m "Your message" && git push`  
  Vercel will redeploy and the same production/preview URL will show the new version.

- **New branch / PR:**  
  Push a new branch or open a PR; Vercel will create a new preview URL for it. Share that URL for QC of that version.

## Troubleshooting

- **404 on refresh or direct link**  
  The app is a client-side SPA. `vercel.json` is already set so all routes serve `index.html`. If you still see 404s, in Vercel → Project → Settings → General, confirm the build output directory is `dist`.

- **Build fails on Vercel**  
  Ensure in Vercel the Node version is 18+ (Settings → General → Node.js Version).

- **Need to re-run these steps**  
  Repo already has a remote:  
  `git remote -v`  
  To change it:  
  `git remote set-url origin https://github.com/NEW_USER/NEW_REPO.git`
