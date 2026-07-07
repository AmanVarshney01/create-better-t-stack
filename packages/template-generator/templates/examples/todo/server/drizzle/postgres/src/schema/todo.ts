import { pgTable, text, boolean, serial } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  completed: boolean("completed").default(false).notNull(),
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});
