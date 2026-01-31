'use server';

import { db } from '@/db';
import { todos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addTodo(text: string) {
  if (!text.trim()) {
    throw new Error('Todo text cannot be empty');
  }

  await db.insert(todos).values({ text: text.trim() });
  revalidatePath('/');
}

export async function toggleTodo(id: number) {
  const todo = await db.query.todos.findFirst({
    where: eq(todos.id, id),
  });

  if (!todo) {
    throw new Error('Todo not found');
  }

  await db
    .update(todos)
    .set({ completed: !todo.completed })
    .where(eq(todos.id, id));

  revalidatePath('/');
}

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id));
  revalidatePath('/');
}
