# 🔐 GITHUB ACCESS INFO

## Repository
```
https://github.com/lyubovofis/luba-website
```

## Login Credentials
**Username:** lyubovofis  
**Branch:** main

## Personal Access Token
Stored in: `C:\Luba Website\.env.local`
- Token has `repo` permissions
- Used for automated deployments

## Git Configuration
```bash
# Remote URL
git remote -v
origin  https://github.com/lyubovofis/luba-website.git

# Current branch
git branch
* main

# Check status
git status
```

## Deploy Commands
```bash
# Auto deploy (uses token from .env.local)
node auto-deploy.js

# Manual deploy
git add .
git commit -m "Your message"
git push origin main

# Force push (if needed)
git push origin main --force
```

## Vercel Auto-Deploy
- Connected to GitHub repo
- Auto-deploys on every push to `main`
- Build time: 1-2 minutes
- Live URL: https://lyubovpsy.com
- Vercel URL: https://luba-website.vercel.app

## Project Structure
```
Repository Root: /
Deployed Root: /Luba Website/
```

**Important:** Vercel Root Directory is set to `Luba Website`

## Common Issues

### 1. Push rejected (fetch first)
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### 2. Token expired (403 error)
- Create new token: https://github.com/settings/tokens
- Update in `.env.local`

### 3. Unrelated histories
```bash
git push origin main --force
```

---

**Last updated:** 2025-01-18
**Repository owner:** lyubovofis
