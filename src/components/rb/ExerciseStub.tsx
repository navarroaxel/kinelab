"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { findByHref } from "@/lib/simulators";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

// Phase 0 placeholder — the route, registry entry and i18n strings exist,
// but the physics module, canvas and controls land in a later phase.
export function ExerciseStub() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const entry = findByHref(pathname);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-4">
      <SimulatorHeader />
      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
        {entry && (
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            {t("rb.label")} {entry.rb}
          </span>
        )}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {entry ? t(entry.titleKey) : t("rb.section.index_title")}
        </h1>
        {entry?.summaryKey && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t(entry.summaryKey)}
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {t("rb.card.coming_soon")}
        </p>
      </div>
      <ProjectCredits />
    </main>
  );
}
