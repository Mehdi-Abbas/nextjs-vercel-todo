import { Suspense } from 'react';
import AddTodoForm from '@/components/AddTodoForm';
import TodoList from '@/components/TodoList';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Todo App</h1>
        <p className={styles.subtitle}>
          Built with Next.js 15 App Router, Vercel Postgres, and Drizzle ORM
        </p>

        <AddTodoForm />

        <Suspense fallback={<div className={styles.loading}>Loading todos...</div>}>
          <TodoList />
        </Suspense>
      </div>
    </main>
  );
}
