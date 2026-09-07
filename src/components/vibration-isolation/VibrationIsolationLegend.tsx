"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ROWS = [
  { key: "vib3.legend.damped", colorClass: "bg-[#0EA5A0] dark:bg-[#5CE0DB]" },
  { key: "vib3.legend.undamped", colorClass: "bg-[#9B59B6] dark:bg-[#AFA9EC]" },
  { key: "vib3.legend.target", colorClass: "bg-gray-400 dark:bg-gray-500" },
  { key: "vib3.legend.admissible", colorClass: "bg-[#0EA5A0]/30" },
] as const;

export const VibrationIsolationLegend = memo(function VibrationIsolationLegend() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib3.legend.heading")}
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
