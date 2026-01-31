# Next.js Todo App with Vercel Postgres

A modern, production-ready todo application demonstrating Next.js 15 App Router patterns, Server Actions, Vercel Postgres integration, and CI/CD with GitHub Actions.

## 🎯 Learning Objectives

This project teaches you:
- **Next.js 15 App Router** - Modern React patterns with Server Components
- **Vercel Postgres** - Managed PostgreSQL database with zero config
- **Drizzle ORM** - Type-safe database queries and migrations
- **Server Actions** - Form handling without API routes
- **Optimistic UI** - Instant feedback before server confirmation
- **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** Vercel Postgres
- **ORM:** Drizzle ORM
- **Styling:** CSS Modules
- **TypeScript:** Full type safety
- **CI/CD:** GitHub Actions

### Key Patterns

**Server Components (default)**
- `TodoList` - Fetches data on server, zero client JS
- Automatic streaming with Suspense boundaries

**Client Components (interactive)**
- `AddTodoForm` - Form handling with optimistic updates
- `TodoItem` - Toggle/delete with instant UI feedback

**Server Actions**
- `addTodo()` - Insert new todo
- `toggleTodo()` - Update completion status
- `deleteTodo()` - Remove todo
- Automatic revalidation with `revalidatePath()`

## 📁 Project Structure

```
nextjs-vercel-todo/
├── app/                          # App Router directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (Server Component)
│   ├── page.module.css          # Page styles
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── AddTodoForm.tsx          # Client component for adding todos
│   ├── AddTodoForm.module.css   # Form styles
│   ├── TodoItem.tsx             # Client component for todo items
│   ├── TodoItem.module.css      # Item styles
│   ├── TodoList.tsx             # Server component for listing todos
│   └── TodoList.module.css      # List styles
├── actions/                      # Server Actions
│   └── todos.ts                 # CRUD operations
├── db/                          # Database layer
│   ├── schema.ts                # Drizzle schema definition
│   └── index.ts                 # Database connection
├── .github/workflows/           # CI/CD
│   └── deploy.yml               # GitHub Actions workflow
├── drizzle.config.ts            # Drizzle Kit configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Deployment Guide

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Node.js 20+ installed locally

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Next.js todo app with Vercel Postgres"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nextjs-vercel-todo.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Deploy from Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js - click "Deploy"
5. Wait for initial deployment (without database)

**Option B: Deploy from CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 3: Add Vercel Postgres

1. Go to your project dashboard on Vercel
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a database name (e.g., `todos-db`)
6. Select region (choose closest to your users)
7. Click "Create"

**Vercel automatically:**
- Creates the database
- Adds environment variables to your project
- Redeploys your app with database connection

### Step 4: Initialize Database Schema

Run migrations to create the `todos` table:

```bash
# Pull environment variables locally
vercel env pull .env.local

# Generate migration
npm run db:generate

# Push schema to database
npm run db:push
```

**Alternative: Use Vercel CLI to run migrations**

```bash
# Run in Vercel environment
vercel env pull
npm run db:push
```

Your app is now live! Visit the deployment URL.

### Step 5: Set Up CI/CD

1. **Get Vercel Tokens:**
   - Go to Vercel → Settings → Tokens
   - Create new token (name: "GitHub Actions")
   - Copy the token

2. **Get Project IDs:**
   ```bash
   # Install Vercel CLI if not done
   npm i -g vercel
   
   # Login
   vercel login
   
   # Link project
   vercel link
   
   # This creates .vercel/project.json
   cat .vercel/project.json
   ```
   
   Copy `orgId` and `projectId` from the output.

3. **Add GitHub Secrets:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add three secrets:
     - `VERCEL_TOKEN` - Your Vercel token
     - `VERCEL_ORG_ID` - Your organization ID
     - `VERCEL_PROJECT_ID` - Your project ID

4. **Test the Pipeline:**
   ```bash
   git add .
   git commit -m "Add CI/CD workflow"
   git push
   ```
   
   Go to GitHub → Actions tab to see the workflow run.

**What the CI/CD does:**
- ✅ Runs TypeScript type checking
- ✅ Runs ESLint for code quality
- ✅ Builds the application
- ✅ Deploys to Vercel (preview for PRs, production for main branch)

## 🔧 Local Development

### First Time Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nextjs-vercel-todo.git
cd nextjs-vercel-todo

# Install dependencies
npm install

# Pull environment variables from Vercel
vercel env pull .env.local

# Push database schema
npm run db:push
```

### Development Server

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
```

### Database Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Push schema directly to database (dev)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Other Commands

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build

# Run production build
npm start
```

## 🎓 Key Concepts Explained

### Server Actions vs API Routes

**Old way (API Routes):**
```tsx
// app/api/todos/route.ts
export async function POST(req: Request) {
  const { text } = await req.json();
  // database logic
  return Response.json({ success: true });
}

// Client component
const response = await fetch('/api/todos', {
  method: 'POST',
  body: JSON.stringify({ text }),
});
```

**New way (Server Actions):**
```tsx
// actions/todos.ts
'use server';
export async function addTodo(text: string) {
  // database logic
}

// Client component
import { addTodo } from '@/actions/todos';
await addTodo(text);
```

**Benefits:**
- ✅ No API route boilerplate
- ✅ Automatic TypeScript types
- ✅ Built-in form handling
- ✅ Progressive enhancement

### Optimistic UI

Updates the UI immediately, then confirms with server:

```tsx
const [optimisticValue, setOptimisticValue] = useOptimistic(actualValue);

async function handleAction() {
  setOptimisticValue(newValue);  // Instant UI update
  await serverAction();           // Confirm with server
  // Auto-revalidates and fixes if server fails
}
```

**Why it matters:** Feels instant, no loading spinners for every action.

### Server Components vs Client Components

**Server Components (default):**
- Run only on server
- Can access database directly
- Zero JavaScript to client
- Better performance

**Client Components (`'use client'`):**
- Run on client and server
- Can use hooks (useState, useEffect)
- Handle interactivity
- Required for event handlers

**Rule:** Use Server Components by default, only add `'use client'` when needed.

### Database Connection Pooling

Vercel Postgres provides two connection strings:
- `POSTGRES_URL` - Pooled connection (use this)
- `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)

Drizzle automatically handles connection pooling via `@vercel/postgres`.

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `Cannot connect to database`
```bash
# Verify environment variables
cat .env.local | grep POSTGRES

# Re-pull from Vercel
vercel env pull .env.local --force
```

### Schema Changes Not Applying

```bash
# Regenerate schema
npm run db:generate

# Push to database
npm run db:push

# Restart dev server
npm run dev
```

### CI/CD Failing

1. Verify secrets are set in GitHub
2. Check workflow logs in Actions tab
3. Ensure Vercel tokens haven't expired

### Local Development Not Working

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

## 📊 Environment Variables

Vercel automatically sets these when you add Postgres:

| Variable | Purpose |
|----------|---------|
| `POSTGRES_URL` | Pooled connection string (use this) |
| `POSTGRES_PRISMA_URL` | For Prisma ORM (not used here) |
| `POSTGRES_URL_NO_SSL` | Non-SSL connection |
| `POSTGRES_URL_NON_POOLING` | Direct connection for migrations |

## 🚢 Production Checklist

Before going live:
- [ ] Environment variables set in Vercel
- [ ] Database schema pushed (`npm run db:push`)
- [ ] CI/CD pipeline passing
- [ ] Custom domain configured (optional)
- [ ] Error tracking set up (Sentry, LogRocket, etc.)
- [ ] Analytics added (Vercel Analytics, Google Analytics, etc.)

## 📚 Learn More

### Next.js Docs
- [App Router](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Optimistic Updates](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#optimistic-updates)

### Vercel Docs
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Deployments](https://vercel.com/docs/deployments/overview)

### Drizzle ORM
- [Getting Started](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

**Built to learn Next.js 15, Vercel Postgres, and modern React patterns.**
