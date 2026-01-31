'use client';

import { toggleTodo, deleteTodo } from '@/actions/todos';
import { useOptimistic } from 'react';
import type { Todo } from '@/db/schema';
import styles from './TodoItem.module.css';

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    todo.completed,
    (state, newState: boolean) => newState
  );

  async function handleToggle() {
    setOptimisticCompleted(!optimisticCompleted);
    await toggleTodo(todo.id);
  }

  async function handleDelete() {
    await deleteTodo(todo.id);
  }

  return (
    <div className={styles.item}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={optimisticCompleted}
          onChange={handleToggle}
          className={styles.checkbox}
        />
        <span className={optimisticCompleted ? styles.textCompleted : styles.text}>
          {todo.text}
        </span>
      </label>
      <button onClick={handleDelete} className={styles.deleteButton}>
        Delete
      </button>
    </div>
  );
}
