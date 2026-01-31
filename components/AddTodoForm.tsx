'use client';

import { addTodo } from '@/actions/todos';
import { useOptimistic, useRef } from 'react';
import styles from './AddTodoForm.module.css';

export default function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useOptimistic(false);

  async function handleSubmit(formData: FormData) {
    const text = formData.get('text') as string;
    
    if (!text.trim()) return;

    startTransition(async () => {
      formRef.current?.reset();
      await addTodo(text);
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="text"
        placeholder="What needs to be done?"
        className={styles.input}
        disabled={isPending}
        autoComplete="off"
      />
      <button type="submit" className={styles.button} disabled={isPending}>
        {isPending ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
}
