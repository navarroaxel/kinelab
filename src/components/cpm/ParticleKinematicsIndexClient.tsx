"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { cpmExercises } from "@/lib/simulators";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

const TP_PDF_HREF = "/tp1-cinematica-del-punto-material.pdf";

export function ParticleKinematicsIndexClient() {
  const { t } = useLanguage();
  const exercises = cpmExercises();

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="flex flex-col gap-4">
        <SimulatorHeader />

        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("cpm.section.index_title")}
          </h1>
          <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-400">
            {t("cpm.section.subtitle")}
          </p>
          <a
            href={TP_PDF_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-sm text-blue-700 hover:underline dark:text-blue-300"
          >
            {t("cpm.section.pdf_link")} ↗
          </a>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((ex) => (
            <Link
              key={ex.id}
              href={ex.href}
              className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700 dark:hover:bg-gray-800"
            >
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                CPM {ex.cpm}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t(ex.titleKey)}
              </span>
              {ex.summaryKey && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {t(ex.summaryKey)}
                </span>
              )}
            </Link>
          ))}
        </div>

        <ProjectCredits />
      </div>
    </main>
  );
}
