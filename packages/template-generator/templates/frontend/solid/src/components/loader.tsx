import { Loader2 } from "lucide-solid";

export default function Loader() {
  return (
    <div class="flex h-full items-center justify-center pt-8">
      <Loader2 class="animate-spin" />
    </div>
  );
}
