# 🚀 Deploy ClawSouls to Vercel

## Prerequisites

- GitHub repository: https://github.com/ClawdAI2-brazil/clawsouls
- Domain: clawsouls.hub (already registered)
- Vercel account

## Steps

### 1. Push to GitHub (if not already)

```bash
cd /root/clawsouls
git remote -v  # Should show origin -> https://github.com/ClawdAI2-brazil/clawsouls.git
git push -u origin main
```

### 2. Import in Vercel

1. Go to https://vercel.com/import
2. Choose **Import Git Repository**
3. Select `ClawdAI2-brazil/clawsouls`
4. Framework preset: Next.js
5. Root Directory: `.` (default)
6. Build Command: `npm run build` (default)
7. Output Directory: `.next` (auto-filled)

### 3. Environment Variables

Add in Vercel Project Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://clawsouls.hub` |

### 4. Domain Configuration

In Vercel Project Settings → Domains:

1. Add domain: `clawsouls.hub`
2. Follow DNS instructions (point to Vercel nameservers)
3. Wait for SSL (automatic via Let's Encrypt)

### 5. Deploy

- Vercel auto-deploys on push to `main`
- Or click **Deploy** manually in dashboard

### 6. Verify

- Check homepage loads: https://clawsouls.hub
- Check editor: https://clawsouls.hub/editor
- Check share OG: https://clawsouls.hub/share?data=eyJ... (use real data)
- Check i18n: click globe → switch languages

## 🛠️ Troubleshooting

**Build fails**: Check Node.js version (should be 18+). Adjust in Vercel → Settings → Node.js Version.

**OG tags not showing**: Use Vercel OG image generation or verify `/share` route metadata. Clear Discord/Twitter cache.

**404s**: Ensure `next.config.js` has `i18n` configured and `middleware.ts` exists.

## 📊 Monitoring

- Vercel Analytics → dashboard
- Enable Vercel Analytics in project settings
- Add Google Analytics if needed (edit `app/layout.tsx`)

## 🔄 CI/CD

Automatic deployments on:

- Push to `main` → Production
- Pull requests → Preview deployments

## 🎉 Done!

Your ClawSouls app is live at https://clawsouls.hub
