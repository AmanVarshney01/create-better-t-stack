# Convex Database

This package contains your Convex database setup. Convex is a reactive database with realtime sync.

## Getting Started

1. Initialize Convex:

   ```bash
   cd packages/db
   npx convex dev --configure --until-success
   ```

2. Start the Convex dev server:
   ```bash
   npx convex dev
   ```

## Using Convex from your API

In your API routes (Hono, Express, etc.), you can call Convex functions using the HTTP client:

```typescript
import { convex } from "@your-project/db";
import { api } from "@your-project/db/convex/_generated/api";

// In your API route
const todos = await convex.query(api.todos.list);
await convex.mutation(api.todos.create, { text: "New todo" });
```

## Writing Convex Functions

See https://docs.convex.dev/functions for documentation on writing Convex functions.

### Example Query

```typescript
// convex/todos.ts
import { query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});
```

### Example Mutation

```typescript
// convex/todos.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
    });
  },
});
```

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex Functions](https://docs.convex.dev/functions)
- [Convex Database](https://docs.convex.dev/database)
