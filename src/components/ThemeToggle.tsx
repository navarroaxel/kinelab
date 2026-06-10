"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// useLayoutEffect warns during SSR; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ThemeMode = "auto" | "light" | "dark";

const STORAGE_KEY = "kinelab-theme";
const ORDER: ThemeMode[] = ["auto", "light", "dark"];
const ICONS: Record<ThemeMode, string> = { auto: "◑", light: "☀️", dark: "🌙" };

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "auto";
}

export function applyThemeMode(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = mode === "dark" || (mode === "auto" && systemDark);
  document.documentElement.classList.toggle("dark", useDark);
  if (mode === "auto") {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useIsomorphicLayoutEffect(() => {
    const stored = readStoredMode();
    setMode(stored);
    applyThemeMode(stored);
    setMounted(true);
  }, []);

  // Keep auto mode in sync when the OS preference changes
  useEffect(() => {
    if (mode !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeMode("auto");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const cycle = () => {
    setMode((prev) => {
      const next = ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length] as ThemeMode;
      applyThemeMode(next);
      return next;
    });
  };

  const currentMode = mounted ? mode : "auto";
  const label = `${t("theme.aria")}: ${t(`theme.${currentMode}` as "theme.auto")}`;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      suppressHydrationWarning
      className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <span aria-hidden suppressHydrationWarning>
        {ICONS[currentMode]}
      </span>
      <span suppressHydrationWarning>
        {t(`theme.${currentMode}` as "theme.auto")}
      </span>
    </button>
  );
}
