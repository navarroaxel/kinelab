"use client";

import { memo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { cpmExercises } from "@/lib/simulators";

const INDEX_HREF = "/particle-kinematics";

function hrefOf(pathname: string, preset: string | null): string {
  return preset ? `${pathname}?preset=${preset}` : pathname;
}

export const ExerciseNav = memo(function ExerciseNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const selectRef = useRef<HTMLSelectElement>(null);

  const exercises = cpmExercises();
  const preset = searchParams.get("preset");
  const currentHref = hrefOf(pathname, preset);

  let index = exercises.findIndex((e) => e.href === currentHref);
  if (index === -1) {
    // Fall back to matching by pathname alone (e.g. index page itself).
    index = exercises.findIndex((e) => e.href.split("?")[0] === pathname);
  }

  const hasCurrent = index !== -1;
  const prev = hasCurrent
    ? exercises[(index - 1 + exercises.length) % exercises.length]
    : undefined;
  const next = hasCurrent
    ? exercises[(index + 1) % exercises.length]
    : undefined;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-shortcut]")) return;
      if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
        return;
      if (e.key === "ArrowRight" && next) {
        router.push(next.href);
      } else if (e.key === "ArrowLeft" && prev) {
        router.push(prev.href);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [prev, next, router]);

  return (
    <div
      data-no-shortcut
      className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs dark:border-gray-700 dark:bg-gray-900"
    >
      <Link
        href={INDEX_HREF}
        className="font-medium text-blue-700 hover:underline dark:text-blue-300"
      >
        {t("cpm.nav.back_to_index")}
      </Link>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <Link
        href={prev?.href ?? INDEX_HREF}
        aria-label={t("cpm.nav.prev")}
        className="rounded px-1.5 py-0.5 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        ← {t("cpm.nav.prev")}
      </Link>
      {hasCurrent && (
        <span className="text-gray-500 tabular-nums dark:text-gray-400">
          {index + 1} / {exercises.length}
        </span>
      )}
      <Link
        href={next?.href ?? INDEX_HREF}
        aria-label={t("cpm.nav.next")}
        className="rounded px-1.5 py-0.5 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {t("cpm.nav.next")} →
      </Link>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <select
        ref={selectRef}
        aria-label={t("cpm.nav.jump_to")}
        value={hasCurrent ? currentHref : ""}
        onChange={(e) => {
          const href = e.target.value;
          if (href) router.push(href);
        }}
        className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        {!hasCurrent && <option value="">{t("cpm.nav.jump_to")}</option>}
        {exercises.map((e) => (
          <option key={e.href} value={e.href}>
            CPM {e.cpm} — {t(e.titleKey)}
          </option>
        ))}
      </select>
    </div>
  );
});
