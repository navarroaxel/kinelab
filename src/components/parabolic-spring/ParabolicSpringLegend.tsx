"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import type { TranslationKey } from "@/lib/i18n";

const items: { color: string; key: TranslationKey }[] = [
  { color: COLORS.rVector, key: "ps.legend.path" },
  { color: COLORS.weight, key: "ps.legend.weight" },
  { color: COLORS.radialVelocity, key: "ps.legend.spring" },
  { color: COLORS.normalForce, key: "ps.legend.normal" },
  { color: COLORS.acceleration, key: "ps.legend.tangential" },
  { color: COLORS.trajectory, key: "ps.legend.curvature" },
];

export const ParabolicSpringLegend = memo(function ParabolicSpringLegend() {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
        {t("ps.legend.heading")}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span
              style={{ background: item.color }}
              className="h-3 w-3 shrink-0 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {withSubscripts(t(item.key))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
