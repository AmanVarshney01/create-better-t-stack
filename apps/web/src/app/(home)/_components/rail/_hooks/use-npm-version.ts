"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

const npmVersionResponseSchema = z.object({ version: z.string().trim().min(1) });

export function useNpmVersion(): string {
  const [version, setVersion] = useState("0.0.0");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("https://registry.npmjs.org/create-better-t-stack/latest");
        if (!res.ok) throw new Error("Failed to fetch version");
        const data = npmVersionResponseSchema.safeParse(await res.json());
        if (cancelled) return;
        setVersion(data.success ? data.data.version : "latest");
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
