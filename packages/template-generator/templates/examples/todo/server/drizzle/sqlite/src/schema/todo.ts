import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
});
