"use client";

import { createContext, useContext } from "react";

export type RailValue = {
  activeIndex: number;
  atStart: boolean;
  atEnd: boolean;
  goTo: (index: number) => void;
};

export const RailContext = createContext<RailValue | null>(null);

export function useRail(): RailValue {
  const value = useContext(RailContext);
  if (!value) {
    throw new Error("useRail must be used inside RailContext");
  }
  return value;
}
