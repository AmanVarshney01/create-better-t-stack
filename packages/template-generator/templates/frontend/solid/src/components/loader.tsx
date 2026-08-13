export default function Loader() {
  return (
    <div class="flex h-full items-center justify-center pt-8" role="status">
      <span class="h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      <span class="sr-only">Loading</span>
    </div>
  );
}
