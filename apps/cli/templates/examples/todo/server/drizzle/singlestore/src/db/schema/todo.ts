import { singlestoreTable, varchar, bigint, boolean } from "drizzle-orm/singlestore";

export const todo = singlestoreTable("todo", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  text: varchar("text", { length: 255 }).notNull(),
  completed: boolean("completed").default(false).notNull(),
});