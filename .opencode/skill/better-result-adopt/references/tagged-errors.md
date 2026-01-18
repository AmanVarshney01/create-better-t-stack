# TaggedError Patterns

## Defining Errors

### Simple Error (no computed message)

```typescript
import { TaggedError } from "better-result";

class NotFoundError extends TaggedError("NotFoundError")<{
  resource: string;
  id: string;
  message: string;
}>() {}

// Usage
new NotFoundError({ resource: "User", id: "123", message: "User 123 not found" });
```

### Error with Computed Message

Keep constructor for derived message:

```typescript
class NotFoundError extends TaggedError("NotFoundError")<{
  resource: string;
  id: string;
  message: string;
}>() {
  constructor(args: { resource: string; id: string }) {
    super({ ...args, message: `${args.resource} not found: ${args.id}` });
  }
}

// Usage: new NotFoundError({ resource: "User", id: "123" })
```

### Error with Cause

Wrap underlying exceptions:

```typescript
class DatabaseError extends TaggedError("DatabaseError")<{
  operation: string;
  message: string;
  cause: unknown;
}>() {
  constructor(args: { operation: string; cause: unknown }) {
    const msg = args.cause instanceof Error ? args.cause.message : String(args.cause);
    super({ ...args, message: `DB ${args.operation} failed: ${msg}` });
  }
}

// Usage in Result.tryPromise
Result.tryPromise({
  try: () => db.query(sql),
  catch: (e) => new DatabaseError({ operation: "query", cause: e }),
});
```

### Error with Validation/Runtime Props

```typescript
class RateLimitError extends TaggedError("RateLimitError")<{
  retryAfter: number;
  message: string;
}>() {
  constructor(args: { retryAfterMs: number }) {
    super({
      retryAfter: args.retryAfterMs,
      message: `Rate limited, retry after ${args.retryAfterMs}ms`,
    });
  }
}
```

## Error Unions

Group related errors for function signatures:

```typescript
// Domain errors
class NotFoundError extends TaggedError("NotFoundError")<{ id: string; message: string }>() {}
class ValidationError extends TaggedError("ValidationError")<{ field: string; message: string }>() {}
class AuthError extends TaggedError("AuthError")<{ reason: string; message: string }>() {}

// Union type
type AppError = NotFoundError | ValidationError | AuthError;

// Function signature
function processRequest(req: Request): Result<Response, AppError> { ... }
```

## Matching Errors

### Exhaustive Match

Compiler ensures all error types handled:

```typescript
import { matchError } from "better-result";

const message = matchError(error, {
  NotFoundError: (e) => `Missing: ${e.id}`,
  ValidationError: (e) => `Invalid: ${e.field}`,
  AuthError: (e) => `Unauthorized: ${e.reason}`,
});
```

### Partial Match with Fallback

Handle subset, catch-all for rest:

```typescript
import { matchErrorPartial } from "better-result";

const message = matchErrorPartial(
  error,
  { NotFoundError: (e) => `Missing: ${e.id}` },
  (e) => `Error: ${e.message}`, // fallback for ValidationError, AuthError
);
```

### Type Guards

```typescript
import { isTaggedError, TaggedError } from "better-result";

// Check any tagged error
if (isTaggedError(value)) {
  console.log(value._tag);
}

// Check specific error class
if (NotFoundError.is(value)) {
  console.log(value.id); // narrowed to NotFoundError
}

// Also available
TaggedError.is(value); // same as isTaggedError
```

### In Result.match

```typescript
result.match({
  ok: (value) => handleSuccess(value),
  err: (e) =>
    matchError(e, {
      NotFoundError: (e) => handleNotFound(e),
      ValidationError: (e) => handleValidation(e),
    }),
});
```

## Pipeable Style

matchError/matchErrorPartial support data-last for pipelines:

```typescript
const handler = matchError({
  NotFoundError: (e) => `Missing: ${e.id}`,
  ValidationError: (e) => `Invalid: ${e.field}`,
});
pipe(error, handler);
```

## Converting Existing Errors

```typescript
// FROM: class hierarchy
class NotFoundError extends AppError {
  constructor(public id: string) {
    super(`Not found: ${id}`);
  }
}
// TO: TaggedError
class NotFoundError extends TaggedError("NotFoundError")<{ id: string; message: string }>() {
  constructor(args: { id: string }) {
    super({ ...args, message: `Not found: ${args.id}` });
  }
}

// FROM: string/generic errors
throw "User not found";
// TO: typed Result
return Result.err(new NotFoundError({ id, message: "User not found" }));
```
