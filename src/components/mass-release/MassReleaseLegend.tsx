"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ROWS = [
  { key: "vib6.legend.spring", colorClass: "bg-[#1D9E75] dark:bg-[#5DCAA5]" },
  { key: "vib6.legend.mass", colorClass: "bg-[#E8593C] dark:bg-[#F0997B]" },
  { key: "vib6.legend.slack", colorClass: "bg-[#F5A623] dark:bg-[#FCD34D]" },
] as const;

export const MassReleaseLegend = memo(function MassReleaseLegend() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib6.legend.heading")}
      </h2>
      <div className="flex flex-col gap-1.5">
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
            <span className={`h-2.5 w-2.5 rounded-full ${row.colorClass}`} />
            {t(row.key)}
          </div>
        ))}
      </div>
    </div>
  );
});
