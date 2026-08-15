import { Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { httpStatus } from "@solidjs/web";

export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition;

export default function NotFound() {
  return (
    <main class="container mx-auto max-w-3xl px-4 py-10">
      <Title>Not Found</Title>
      <h1 class="text-3xl font-bold">Page not found</h1>
    </main>
  );
}
