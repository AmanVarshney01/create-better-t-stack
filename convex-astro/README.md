# 🧑‍🚀 Convex w/ Astro & React

An [Astro](https://docs.astro.build) + [Convex](https://convex.dev) starter project
with React and Tailwind CSS v4.

## Using Astro with Convex

To enable Convex in your Astro project:

1. Install `convex` and run `npx convex dev` to start syncing changes to your
   Convex backend. This will create a `convex` folder in your project if you
   don't have one already.
2. Wrap components that access Convex in a `ConvexProvider` component. In this
   template, this is done with `withConvexProvider` in `src/lib/convex.tsx`.
   See [CommentForm](src/components/CommentForm.tsx) for a usage example.
3. Add these components to your `.astro` pages as usual. See
   [index.astro](src/pages/index.astro) for an example.
4. Use `useQuery` and other Convex hooks in the components as usual.

## withConvexProvider

The `withConvexProvider` function is a convenience wrapper that wraps a React
component in a `ConvexProvider` component. This is necessary because Astro
context providers don't work when used in `.astro` files.

Usage:

```tsx
// CommentForm.tsx
export default withConvexProvider(function CommentForm() {
    ... normal component code ...
});
```

Implementation:

```tsx
// Initialized once so all components share the same client.
const client = new ConvexReactClient(CONVEX_URL);

export function withConvexProvider<Props extends JSX.IntrinsicAttributes>(
  Component: FunctionComponent<Props>,
) {
  return function WithConvexProvider(props: Props) {
    return (
      <ConvexProvider client={client}>
        <Component {...props} />
      </ConvexProvider>
    );
  };
}
```

## Installation

```sh
npm create convex@latest my-app -- --template astro
```

See [create-convex](https://github.com/get-convex/templates/tree/main/create-convex#create-convex) for more details.

## 📚 Learn More

- [Convex Docs](https://docs.convex.dev)
- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta#css-configuration-in-depth)
