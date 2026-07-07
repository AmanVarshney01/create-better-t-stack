import { mysqlTable, varchar, int, boolean } from "drizzle-orm/mysql-core";

export const todo = mysqlTable("todo", {
  completed: boolean("completed").default(false).notNull(),
  id: int("id").primaryKey().autoincrement(),
  text: varchar("text", { length: 255 }).notNull(),
});
