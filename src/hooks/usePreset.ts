"use client";

import { useSearchParams } from "next/navigation";

/**
 * Reads the shared `?preset=<id>` query-string convention and returns the
 * matching preset's initial params, or `fallback` when the id is missing or
 * unknown. Unknown ids fall back silently — no error, no console warning.
 *
 * Must be called from a component rendered under a <Suspense> boundary
 * (useSearchParams requires it for static pages in the app router).
 */
export function usePreset<T>(presets: Record<string, T>, fallback: T): T {
  const searchParams = useSearchParams();
  const id = searchParams.get("preset");
  if (id && Object.prototype.hasOwnProperty.call(presets, id)) {
    return presets[id];
  }
  return fallback;
}
