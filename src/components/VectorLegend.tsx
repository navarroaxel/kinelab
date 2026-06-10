"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const items: { color: string; key: TranslationKey }[] = [
  { color: "#3B8BD4", key: "legend.r" },
  { color: "#1D9E75", key: "legend.r_dot" },
  { color: "#E8593C", key: "legend.r_theta_dot" },
  { color: "#9B59B6", key: "legend.polar_accel" },
  { color: "#D97706", key: "legend.normal_accel" },
];

export const VectorLegend = memo(function VectorLegend() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
        {t("legend.heading")}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span
              style={{ background: item.color }}
              className="h-3 w-3 shrink-0 rounded-full"
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {t(item.key)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
