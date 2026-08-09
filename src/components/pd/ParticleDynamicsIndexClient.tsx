"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { pdExercises } from "@/lib/simulators";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export function ParticleDynamicsIndexClient() {
  const { t } = useLanguage();
  const exercises = pdExercises();

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="flex flex-col gap-4">
        <SimulatorHeader />

        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("pd.section.index_title")}
          </h1>
          <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-400">
            {t("pd.section.subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((ex) => {
            const cardContent = (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {t("pd.label")} {ex.pd}
                  </span>
                  {ex.disabled && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
                      {t("pd.card.coming_soon")}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {t(ex.titleKey)}
                </span>
                {ex.summaryKey && (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t(ex.summaryKey)}
                  </span>
                )}
              </>
            );

            if (ex.disabled) {
              return (
                <div
                  key={ex.id}
                  className="flex cursor-default flex-col gap-1 rounded-xl border border-dashed border-gray-200 bg-white p-4 opacity-60 dark:border-gray-700 dark:bg-gray-900"
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                key={ex.id}
                href={ex.href}
                className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700 dark:hover:bg-gray-800"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        <ProjectCredits />
      </div>
    </main>
  );
}
