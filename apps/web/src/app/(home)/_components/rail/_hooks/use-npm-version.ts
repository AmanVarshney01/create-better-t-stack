"use client";

import { useEffect, useState } from "react";

export function useNpmVersion(): string {
  const [version, setVersion] = useState("0.0.0");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("https://registry.npmjs.org/create-better-t-stack/latest");
        if (!res.ok) throw new Error("Failed to fetch version");
        const data = await res.json();
        if (cancelled) return;
        setVersion(
          typeof data?.version === "string" && data.version.trim().length > 0
            ? data.version
            : "latest",
        );
      } catch {
        if (!cancelled) setVersion("latest");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return version;
}
