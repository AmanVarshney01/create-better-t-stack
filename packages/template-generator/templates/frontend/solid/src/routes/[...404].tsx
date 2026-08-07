import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main class="container mx-auto max-w-3xl px-4 py-10">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="text-3xl font-bold">Page not found</h1>
    </main>
  );
}
