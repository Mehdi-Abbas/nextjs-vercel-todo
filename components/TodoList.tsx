import { db } from '@/db';
import { todos } from '@/db/schema';
import { desc } from 'drizzle-orm';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

export default async function TodoList() {
  const allTodos = await db.query.todos.findMany({
    orderBy: [desc(todos.createdAt)],
  });

  if (allTodos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No todos yet. Add one above to get started!</p>
      </div>
    );
  }

  const activeTodos = allTodos.filter((todo) => !todo.completed);
  const completedTodos = allTodos.filter((todo) => todo.completed);

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <span>{activeTodos.length} active</span>
        <span>·</span>
        <span>{completedTodos.length} completed</span>
      </div>

      <div className={styles.list}>
        {allTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
