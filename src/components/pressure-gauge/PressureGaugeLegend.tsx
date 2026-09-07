"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ROWS = [
  { key: "vib5.legend.curve", colorClass: "bg-[#0EA5A0] dark:bg-[#5CE0DB]" },
  { key: "vib5.legend.limit", colorClass: "bg-gray-400 dark:bg-gray-500" },
  { key: "vib5.legend.rmax", colorClass: "bg-gray-400 dark:bg-gray-500" },
] as const;

export const PressureGaugeLegend = memo(function PressureGaugeLegend() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib5.legend.heading")}
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
