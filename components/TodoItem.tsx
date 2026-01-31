'use client';

import { toggleTodo, deleteTodo } from '@/actions/todos';
import { useOptimistic, useTransition } from 'react';
import type { Todo } from '@/db/schema';
import styles from './TodoItem.module.css';

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    todo.completed,
    (_, newState: boolean) => newState
  );

  function handleToggle() {
    startTransition(() => {
      setOptimisticCompleted(!optimisticCompleted);
      toggleTodo(todo.id);
    });
  }

  function handleDelete() {
    startTransition(() => {
      deleteTodo(todo.id);
    });
  }

  return (
    <div className={styles.item}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={optimisticCompleted}
          onChange={handleToggle}
          className={styles.checkbox}
          disabled={isPending}
        />
        <span className={optimisticCompleted ? styles.textCompleted : styles.text}>
          {todo.text}
        </span>
      </label>
      <button onClick={handleDelete} className={styles.deleteButton} disabled={isPending}>
        Delete
      </button>
    </div>
  );
}
