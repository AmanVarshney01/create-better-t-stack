---
name: better-result-adopt
description: Migrate codebase from try/catch or Promise-based error handling to better-result. Use when adopting Result types, converting thrown exceptions to typed errors, or refactoring existing error handling to railway-oriented programming.
---

# better-result Adoption

Migrate existing error handling (try/catch, Promise rejections, thrown exceptions) to typed Result-based error handling with better-result.

## When to Use

- Adopting better-result in existing codebase
- Converting try/catch blocks to Result types
- Replacing thrown exceptions with typed errors
- Migrating Promise-based code to Result.tryPromise
- Introducing railway-oriented programming patterns

## Migration Strategy

### 1. Start at Boundaries

Begin migration at I/O boundaries (API calls, DB queries, file ops) and work inward. Don't attempt full-codebase migration at once.

### 2. Identify Error Categories

Before migrating, categorize errors in target code:

| Category       | Example                | Migration Target                                |
| -------------- | ---------------------- | ----------------------------------------------- |
| Domain errors  | NotFound, Validation   | TaggedError + Result.err                        |
| Infrastructure | Network, DB connection | Result.tryPromise + TaggedError                 |
| Bugs/defects   | null deref, type error | Let throw (becomes Panic if in Result callback) |

### 3. Migration Order

1. Define TaggedError classes for domain errors
2. Wrap throwing functions with Result.try/tryPromise
3. Convert imperative error checks to Result chains
4. Refactor callbacks to generator composition

## Pattern Transformations

### Try/Catch to Result.try

```typescript
// BEFORE
function parseConfig(json: string): Config {
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new ParseError(e);
  }
}

// AFTER
function parseConfig(json: string): Result<Config, ParseError> {
  return Result.try({
    try: () => JSON.parse(json) as Config,
    catch: (e) => new ParseError({ cause: e, message: `Parse failed: ${e}` }),
  });
}
```

### Async/Await to Result.tryPromise

```typescript
// BEFORE
async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}

// AFTER
async function fetchUser(id: string): Promise<Result<User, ApiError | UnhandledException>> {
  return Result.tryPromise({
    try: async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new ApiError({ status: res.status, message: `API ${res.status}` });
      return res.json() as Promise<User>;
    },
    catch: (e) => (e instanceof ApiError ? e : new UnhandledException({ cause: e })),
  });
}
```

### Null Checks to Result

```typescript
// BEFORE
function findUser(id: string): User | null {
  return users.find((u) => u.id === id) ?? null;
}
// Caller must check: if (user === null) ...

// AFTER
function findUser(id: string): Result<User, NotFoundError> {
  const user = users.find((u) => u.id === id);
  return user
    ? Result.ok(user)
    : Result.err(new NotFoundError({ id, message: `User ${id} not found` }));
}
// Caller: yield* findUser(id) in Result.gen, or .match()
```

### Callback Hell to Generator

```typescript
// BEFORE
async function processOrder(orderId: string) {
  try {
    const order = await fetchOrder(orderId);
    if (!order) throw new NotFoundError(orderId);
    const validated = validateOrder(order);
    if (!validated.ok) throw new ValidationError(validated.errors);
    const result = await submitOrder(validated.data);
    return result;
  } catch (e) {
    if (e instanceof NotFoundError) return { error: "not_found" };
    if (e instanceof ValidationError) return { error: "invalid" };
    throw e;
  }
}

// AFTER
async function processOrder(orderId: string): Promise<Result<OrderResult, OrderError>> {
  return Result.gen(async function* () {
    const order = yield* Result.await(fetchOrder(orderId));
    const validated = yield* validateOrder(order);
    const result = yield* Result.await(submitOrder(validated));
    return Result.ok(result);
  });
}
// Error type is union of all yielded errors
```

## Defining TaggedErrors

See [references/tagged-errors.md](references/tagged-errors.md) for TaggedError patterns.

## Workflow

1. **Check for source reference**: Look for `opensrc/` directory - if present, read the better-result source code for implementation details and patterns
2. **Audit**: Find try/catch, Promise.catch, thrown errors in target module
3. **Define errors**: Create TaggedError classes for domain errors
4. **Wrap boundaries**: Use Result.try/tryPromise at I/O points
5. **Chain operations**: Convert if/else error checks to .andThen or Result.gen
6. **Update signatures**: Change return types to Result<T, E>
7. **Update callers**: Propagate Result handling up call stack
8. **Test**: Verify error paths with .match or type narrowing

## Common Pitfalls

- **Over-wrapping**: Don't wrap every function. Start at boundaries, propagate inward.
- **Losing error info**: Always include cause/context in TaggedError constructors.
- **Mixing paradigms**: Once a module returns Result, callers should too (or explicitly .unwrap).
- **Ignoring Panic**: Callbacks that throw become Panic. Fix the bug, don't catch Panic.

## References

- [TaggedError Patterns](references/tagged-errors.md) - Defining and matching typed errors
- `opensrc/` directory (if present) - Full better-result source code for deeper context
