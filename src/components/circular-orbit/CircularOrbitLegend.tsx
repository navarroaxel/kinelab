"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COLORS } from "@/lib/drawing";
import type { TranslationKey } from "@/lib/i18n";

const items: { color: string; key: TranslationKey }[] = [
  { color: COLORS.velocity, key: "circular-orbit.legend.velocity" },
  { color: COLORS.normalAccel, key: "circular-orbit.legend.normal_accel" },
  { color: COLORS.trajectory, key: "circular-orbit.legend.orbit" },
  { color: COLORS.center, key: "circular-orbit.legend.planet" },
];

export const CircularOrbitLegend = memo(function CircularOrbitLegend() {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
        {t("circular-orbit.legend.heading")}
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
