"use client";

import { Switch } from "@base-ui/react/switch";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isChecked = mounted ? resolvedTheme === "dark" : false;

  const handleCheckedChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex h-4 w-9 shrink-0 cursor-not-allowed items-center rounded-full border-2 border-transparent bg-input opacity-50",
          className,
        )}
        disabled
        aria-label="Toggle theme (loading)"
      >
        <span className="block h-3 w-3 rounded-full shadow-lg ring-0" />
      </button>
    );
  }

  return (
    <Switch.Root
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      className={cn(
        "peer inline-flex h-4 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[unchecked]:bg-input",
        className,
      )}
      aria-label="Toggle theme between light and dark"
    >
      <Switch.Thumb
        className={cn(
          "pointer-events-none flex h-3 w-3 items-center justify-center rounded-full shadow-lg ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
        )}
      >
        {isChecked ? (
          <Moon className="size-2 text-foreground" />
        ) : (
          <Sun className="size-2 text-foreground" />
        )}
      </Switch.Thumb>
    </Switch.Root>
  );
}
