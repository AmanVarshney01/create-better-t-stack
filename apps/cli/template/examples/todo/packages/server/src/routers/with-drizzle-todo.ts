import { z } from "zod";
import { router, publicProcedure } from "../lib/trpc";
import { todo } from "../db/schema/todo";
import { eq } from "drizzle-orm";
import { db } from "../db";

export const todoRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(todo);
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await db
        .insert(todo)
        .values({
          text: input.text,
        })
        .returning();
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      return await db
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id))
        .returning();
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db
        .delete(todo)
        .where(eq(todo.id, input.id))
        .returning();
    }),
});
