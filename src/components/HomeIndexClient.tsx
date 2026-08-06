"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import { coreSimulators } from "@/lib/simulators";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { HomePolarPreview } from "@/components/HomePolarPreview";
import { LanguageProvider } from "@/contexts/LanguageContext";

const CPM_SECTION_CARD = {
  href: "/particle-kinematics",
  titleKey: "home.card.tp1.title",
  summaryKey: "cpm.section.subtitle",
} as const;

const DPM_SECTION_CARD = {
  href: "/particle-dynamics",
  titleKey: "home.card.tp2.title",
  summaryKey: "dpm.section.subtitle",
} as const;

function HomeIndexContent() {
  const { t } = useLanguage();
  const simulators = coreSimulators();

  return (
    <main className="mx-auto max-w-7xl p-4">
      <div className="flex flex-col gap-4">
        <SimulatorHeader />

        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("home.title")}
          </h1>
          <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-400">
            {t("home.subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href={CPM_SECTION_CARD.href}
            className="flex flex-col gap-1.5 rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700 dark:hover:bg-gray-800"
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              TP N°1
            </span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t(CPM_SECTION_CARD.titleKey)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {withSubscripts(t(CPM_SECTION_CARD.summaryKey))}
            </span>
          </Link>

          <Link
            href={DPM_SECTION_CARD.href}
            className="flex flex-col gap-1.5 rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700 dark:hover:bg-gray-800"
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              TP N°2
            </span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t(DPM_SECTION_CARD.titleKey)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {withSubscripts(t(DPM_SECTION_CARD.summaryKey))}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {simulators.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className={`flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700 dark:hover:bg-gray-800 ${
                s.id === "polar" ? "lg:row-span-2" : ""
              }`}
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t(s.titleKey)}
              </span>
              {s.summaryKey && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {withSubscripts(t(s.summaryKey))}
                </span>
              )}
              {s.id === "polar" && (
                <div className="min-h-[140px] flex-1">
                  <HomePolarPreview />
                </div>
              )}
            </Link>
          ))}
        </div>

        <ProjectCredits />
      </div>
    </main>
  );
}

export function HomeIndexClient() {
  return (
    <LanguageProvider>
      <HomeIndexContent />
    </LanguageProvider>
  );
}
