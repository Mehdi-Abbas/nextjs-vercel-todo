# Quick Start Guide

## Deploy in 5 Minutes

### 1. Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nextjs-vercel-todo.git
git push -u origin main
```

### 2. Deploy to Vercel (1 min)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Click "Deploy"

### 3. Add Database (1 min)
1. In Vercel project dashboard → Storage → Create Database
2. Select "Postgres"
3. Click "Create" (auto-redeploys with database)

### 4. Initialize Schema (1 min)
```bash
vercel env pull .env.local
npm install
npm run db:push
```

**Done!** Your app is live at `https://your-project.vercel.app`

---

## Set Up CI/CD (Optional - 5 min)

### 1. Get Vercel Credentials
```bash
vercel login
vercel link
cat .vercel/project.json
```

Copy `orgId` and `projectId`.

Get token: Vercel → Settings → Tokens → Create Token

### 2. Add GitHub Secrets
Go to GitHub repo → Settings → Secrets → Actions

Add three secrets:
- `VERCEL_TOKEN` - Your Vercel token
- `VERCEL_ORG_ID` - From project.json
- `VERCEL_PROJECT_ID` - From project.json

### 3. Push and Watch
```bash
git add .
git commit -m "Add CI/CD"
git push
```

Check GitHub → Actions tab to see pipeline run.

---

## Local Development

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/nextjs-vercel-todo.git
cd nextjs-vercel-todo
npm install

# Get environment variables
vercel env pull .env.local

# Setup database
npm run db:push

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Commands Reference

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open database GUI |
| `vercel env pull` | Get environment variables |
| `vercel --prod` | Deploy to production |

---

## Troubleshooting

**Can't connect to database locally?**
```bash
vercel env pull .env.local --force
npm run db:push
```

**CI/CD not working?**
- Verify all 3 secrets are set in GitHub
- Check token hasn't expired
- Check workflow logs in Actions tab

**Schema changes not applying?**
```bash
npm run db:generate
npm run db:push
```

---

See [README.md](./README.md) for detailed documentation.
