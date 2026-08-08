"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COLORS } from "@/lib/drawing";
import type { TranslationKey } from "@/lib/i18n";

const items: { color: string; key: TranslationKey }[] = [
  { color: COLORS.point, key: "atwood.legend.mass1" },
  { color: COLORS.velocity, key: "atwood.legend.mass2" },
  { color: COLORS.acceleration, key: "atwood.legend.tension1" },
  { color: COLORS.normalAccel, key: "atwood.legend.tension2" },
  { color: COLORS.trajectory, key: "atwood.legend.cable" },
];

export const AtwoodLegend = memo(function AtwoodLegend() {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
        {t("atwood.legend.heading")}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span
              style={{ background: item.color }}
              className="h-3 w-3 shrink-0 rounded-full"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {t(item.key)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
