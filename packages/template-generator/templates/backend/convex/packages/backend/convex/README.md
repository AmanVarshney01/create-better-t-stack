# Welcome to your Convex functions directory!

Write your Convex functions here.
See https://docs.convex.dev/functions for more.

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get("messages", id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result),
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.

## {{#if (eq payments "polar")}}

## Polar Payments Setup

You've configured Polar for payment processing. Here's how to set it up:

### 1. Create a Product in Polar

1. Go to [polar.sh](https://polar.sh) and create an organization
2. Navigate to **Products** → **New Product**
3. Fill in:
   - **Name**: e.g., "Pro Subscription"
   - **Type**: One-time or Recurring
   - **Price**: Your pricing
4. Click **Create Product**
5. Copy the product key (from the URL or product page)

### 2. Create an Access Token

1. Go to **Settings** → **API** → **New Access Token**
2. Name: `app-production` (or `app-sandbox` for testing)
3. Expiration: 30 days
4. **Scopes**: Select all available scopes
5. Copy the token immediately (won't be shown again!)

### 3. Configure Environment Variables

```bash
# Set your access token
npx convex env set POLAR_ACCESS_TOKEN "pk_live_..."

# Set server (sandbox for testing, production for live)
npx convex env set POLAR_SERVER "sandbox"

# Set success URL (Polar will replace {CHECKOUT_ID})
npx convex env set POLAR_SUCCESS_URL "http://localhost:3001/success?checkout_id={CHECKOUT_ID}"
```

### 4. Update Product Configuration

Open `auth.ts` and update the products:

```typescript
export const polar = new Polar(components.polar, {
  products: {
    proMonthly: "your-polar-product-key",
  },
  // ...
});
```

### 5. Testing

Use sandbox mode with test card: `4242 4242 4242 4242`

### Resources

- [Polar Documentation](https://docs.polar.sh/)
- [@polar-sh/better-auth](https://docs.polar.sh/integrations/better-auth)
  {{/if}}
