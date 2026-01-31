# Learning Roadmap: Understanding This Project

## Level 1: Basic Understanding (30 min)

### What You Built
A todo app where:
- Users add, complete, and delete todos
- Data persists in a real PostgreSQL database
- UI updates instantly (optimistic updates)
- Deploys automatically when you push to GitHub

### Key Technologies
1. **Next.js 15** - React framework for building web apps
2. **Vercel Postgres** - Managed database (no server setup needed)
3. **Drizzle ORM** - Type-safe way to talk to the database
4. **GitHub Actions** - Runs tests and deploys automatically

### Project Flow
```
User types todo → Form submits → Server Action runs → Database updates → Page refreshes with new data
```

---

## Level 2: File-by-File Breakdown (1 hour)

### Core Application Files

**`app/page.tsx`** - Main page (Server Component)
```tsx
// Runs on SERVER only
// Fetches data from database
// Sends HTML to browser (no JavaScript for this component)
<TodoList />  // Server Component - fetches data
<AddTodoForm />  // Client Component - handles user input
```

**`components/AddTodoForm.tsx`** - Form (Client Component)
```tsx
'use client';  // Runs on CLIENT
// Handles form submission
// Uses Server Action to save data
// Optimistic update for instant feedback
```

**`components/TodoItem.tsx`** - Todo item (Client Component)
```tsx
'use client';  // Runs on CLIENT
// Checkbox and delete button
// Optimistic updates before server confirms
```

**`components/TodoList.tsx`** - List of todos (Server Component)
```tsx
// Runs on SERVER only
// Queries database directly
// No useState, no useEffect
const todos = await db.query.todos.findMany();
```

**`actions/todos.ts`** - Server Actions
```tsx
'use server';  // These run ONLY on server
export async function addTodo(text: string) {
  await db.insert(todos).values({ text });
  revalidatePath('/');  // Refresh the page data
}
```

### Database Files

**`db/schema.ts`** - Database structure
```tsx
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),  // Auto-incrementing ID
  text: text('text').notNull(),    // Todo text
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**`db/index.ts`** - Database connection
```tsx
// Creates connection to Vercel Postgres
export const db = drizzle(sql, { schema });
```

### Configuration Files

**`drizzle.config.ts`** - Drizzle ORM settings
```tsx
// Tells Drizzle where schema is
// Tells it how to connect to database
```

**`next.config.ts`** - Next.js settings
```tsx
// Framework configuration
// Server Actions enabled by default in Next.js 15
```

**`.github/workflows/deploy.yml`** - CI/CD pipeline
```yaml
# Runs on every push to main
# Steps: checkout → install → type check → lint → build → deploy
```

---

## Level 3: Core Concepts Deep Dive (2 hours)

### 1. Server Components vs Client Components

**Server Components (default in App Router)**
- Run ONLY on server
- Can access database directly
- Zero JavaScript sent to browser
- Cannot use hooks (useState, useEffect)
- Cannot handle user interactions directly

**Example:**
```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetchFromDatabase();  // ✅ Allowed
  return <div>{data}</div>;
}
```

**Client Components (opt-in with 'use client')**
- Run on both server and client
- Can use hooks and event handlers
- JavaScript sent to browser
- Cannot access database directly

**Example:**
```tsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);  // ✅ Allowed
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Key Rule:** Use Server Components by default, only add `'use client'` when you need interactivity.

### 2. Server Actions Explained

**Traditional API approach:**
```tsx
// Old way - separate API route
// app/api/todos/route.ts
export async function POST(request) {
  const { text } = await request.json();
  await db.insert(todos).values({ text });
  return Response.json({ success: true });
}

// Client makes fetch request
const response = await fetch('/api/todos', {
  method: 'POST',
  body: JSON.stringify({ text }),
});
```

**Server Actions approach:**
```tsx
// New way - call server function directly
// actions/todos.ts
'use server';
export async function addTodo(text: string) {
  await db.insert(todos).values({ text });
}

// Client calls it like a normal function
import { addTodo } from '@/actions/todos';
await addTodo(text);
```

**Benefits:**
- No API route boilerplate
- TypeScript types automatically shared
- Works with forms (progressive enhancement)
- Automatic error handling

### 3. Optimistic Updates

**Without optimistic updates:**
```
User clicks → Send to server → Wait → Server responds → Update UI
                                ↑
                          User sees spinner
```

**With optimistic updates:**
```
User clicks → Update UI immediately → Send to server → Confirm or revert
              ↑
        User sees instant change
```

**Code example:**
```tsx
const [optimisticValue, setOptimisticValue] = useOptimistic(actualValue);

async function handleToggle() {
  setOptimisticValue(!optimisticValue);  // Update UI instantly
  await toggleTodo(id);                   // Send to server
  // If server fails, Next.js automatically reverts
}
```

### 4. Database with Drizzle ORM

**Schema definition:**
```tsx
// db/schema.ts
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false),
});
```

**Querying:**
```tsx
// Type-safe queries
const allTodos = await db.query.todos.findMany();

// With conditions
const completed = await db.query.todos.findMany({
  where: eq(todos.completed, true),
});

// Inserting
await db.insert(todos).values({ text: 'New todo' });

// Updating
await db.update(todos)
  .set({ completed: true })
  .where(eq(todos.id, 1));

// Deleting
await db.delete(todos).where(eq(todos.id, 1));
```

**Benefits:**
- TypeScript autocomplete for queries
- Compile-time error checking
- No SQL injection vulnerabilities
- Migrations handled automatically

### 5. Data Flow in This App

**Adding a todo:**
```
1. User types in form (AddTodoForm.tsx)
2. Form submits to addTodo() server action
3. Server action inserts into database
4. revalidatePath('/') tells Next.js to refresh
5. TodoList re-fetches from database
6. New todo appears
```

**Toggling a todo:**
```
1. User clicks checkbox (TodoItem.tsx)
2. useOptimistic updates UI instantly
3. toggleTodo() server action runs
4. Server updates database
5. revalidatePath('/') refreshes data
6. If server failed, UI reverts automatically
```

---

## Level 4: Advanced Patterns (3 hours)

### 1. Understanding App Router File Conventions

```
app/
├── layout.tsx        → Shared layout (wraps all pages)
├── page.tsx          → Route at /
├── globals.css       → Global styles
└── api/
    └── route.ts      → API endpoint (not used in this project)
```

**Key concepts:**
- `layout.tsx` wraps all pages in that directory
- `page.tsx` is the actual page component
- Folders create routes (`app/about/page.tsx` → `/about`)

### 2. Form Handling with Server Actions

**Progressive Enhancement:**
```tsx
<form action={handleSubmit}>
  <input name="text" />
  <button type="submit">Add</button>
</form>
```

This works even if JavaScript is disabled! The form submits to the server action directly.

**With JavaScript enhancement:**
```tsx
async function handleSubmit(formData: FormData) {
  const text = formData.get('text') as string;
  formRef.current?.reset();  // Clear form immediately
  await addTodo(text);        // Server action
}
```

### 3. Revalidation Strategies

**`revalidatePath('/')`** - Refresh specific page
```tsx
export async function addTodo(text: string) {
  await db.insert(todos).values({ text });
  revalidatePath('/');  // Only refresh home page
}
```

**`revalidateTag('todos')`** - Refresh by tag
```tsx
// In fetch/query
fetch('/api/todos', { next: { tags: ['todos'] } });

// In action
revalidateTag('todos');  // Refresh all queries with 'todos' tag
```

### 4. Error Handling

**In Server Actions:**
```tsx
'use server';
export async function addTodo(text: string) {
  if (!text.trim()) {
    throw new Error('Text cannot be empty');
  }
  
  try {
    await db.insert(todos).values({ text });
    revalidatePath('/');
  } catch (error) {
    throw new Error('Failed to add todo');
  }
}
```

**In Client Components:**
```tsx
'use client';
async function handleSubmit(formData: FormData) {
  try {
    await addTodo(text);
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
```

### 5. Type Safety Throughout

**Database types:**
```tsx
export type Todo = typeof todos.$inferSelect;
// { id: number; text: string; completed: boolean; createdAt: Date }

export type NewTodo = typeof todos.$inferInsert;
// { text: string; completed?: boolean }
```

**Component props:**
```tsx
type Props = {
  todo: Todo;  // Fully typed from database schema
};

export default function TodoItem({ todo }: Props) {
  // TypeScript knows all properties of todo
}
```

---

## Level 5: Deployment & DevOps (1 hour)

### 1. Vercel Deployment Process

**What happens when you deploy:**
1. Vercel detects Next.js project
2. Runs `npm run build`
3. Creates optimized production bundle
4. Deploys to global edge network
5. Assigns URL: `project-name.vercel.app`

**Environment variables:**
- Vercel Postgres automatically adds database URLs
- Access via `process.env.POSTGRES_URL`
- Different values for development/production

### 2. CI/CD Pipeline Explained

**GitHub Actions workflow:**
```yaml
on:
  push:
    branches: [main]  # Trigger on push to main

jobs:
  deploy:
    steps:
      - Checkout code        # Get your code
      - Install dependencies # npm ci
      - Type check          # npx tsc --noEmit
      - Lint                # npm run lint
      - Build               # npm run build
      - Deploy to Vercel    # Using Vercel CLI
```

**Why this matters:**
- Catches errors before production
- Ensures code quality
- Automated deployment (no manual steps)
- Preview deployments for pull requests

### 3. Database Migrations

**Development workflow:**
```bash
# 1. Update schema
# Edit db/schema.ts

# 2. Generate migration
npm run db:generate

# 3. Apply to database
npm run db:push
```

**Production:**
- Vercel automatically runs migrations on deploy
- Or run manually: `vercel env pull && npm run db:push`

### 4. Monitoring & Debugging

**Vercel Dashboard shows:**
- Deployment logs
- Runtime logs
- Database metrics
- Performance analytics

**Local debugging:**
```bash
# Check database connection
npm run db:studio  # Opens GUI at http://localhost:4983

# View build output
npm run build

# Check environment variables
cat .env.local
```

---

## Practice Exercises

### Beginner
1. Add a due date field to todos
2. Add a priority field (high/medium/low)
3. Add filter buttons (all/active/completed)

### Intermediate
4. Add todo categories/tags
5. Add user authentication (Clerk or Auth.js)
6. Add search functionality

### Advanced
7. Add drag-and-drop reordering
8. Add real-time updates (multiple users)
9. Add file attachments to todos

---

## Common Questions

**Q: Why use Server Components?**
A: Less JavaScript to browser = faster load times. Database access on server = more secure.

**Q: When do I need 'use client'?**
A: When you need: useState, useEffect, event handlers (onClick, onChange), browser APIs.

**Q: How is this different from traditional React?**
A: Traditional React: everything runs in browser. Next.js App Router: most runs on server, only interactive parts run in browser.

**Q: Is Vercel Postgres expensive?**
A: Free tier: 256 MB storage, 60 hours compute/month. Enough for learning/small projects.

**Q: Can I use a different database?**
A: Yes! Drizzle supports PostgreSQL, MySQL, SQLite. Change `drizzle.config.ts` and connection string.

**Q: What if I don't want to use Drizzle?**
A: You can use Prisma, raw SQL, or any other ORM. Drizzle is just one option.

---

## Next Steps

1. **Deploy your app** - Follow QUICKSTART.md
2. **Add a feature** - Try the practice exercises
3. **Read the docs** - Links in README.md
4. **Build something new** - Use this as a template

**You now understand:**
✅ Next.js 15 App Router
✅ Server Components vs Client Components  
✅ Server Actions
✅ Database integration with Drizzle
✅ Vercel deployment
✅ CI/CD with GitHub Actions

This is production-grade architecture. You can build real products with this foundation.
