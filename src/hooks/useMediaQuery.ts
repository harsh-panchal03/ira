"use client";
import { useSyncExternalStore } from "react";

/** SSR-safe media query. Returns `serverValue` during SSR/hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Desktop with a fine pointer and enough room for the WebGL scenes. */
export const useRichMotion = () =>
  useMediaQuery("(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
