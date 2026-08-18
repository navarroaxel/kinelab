"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import type { TranslationKey } from "@/lib/i18n";

const items: { color: string; key: TranslationKey }[] = [
  { color: COLORS.velocity, key: "fl.legend.v" },
  { color: COLORS.transverseVelocity, key: "fl.legend.v_transport" },
  { color: COLORS.radialVelocity, key: "fl.legend.v_rel" },
  { color: COLORS.acceleration, key: "fl.legend.a" },
  { color: COLORS.euler, key: "fl.legend.a_euler" },
  { color: COLORS.normalAccel, key: "fl.legend.a_centripetal" },
  { color: COLORS.coriolis, key: "fl.legend.a_coriolis" },
  { color: COLORS.axes, key: "fl.legend.trace" },
];

export const FiremanLadderLegend = memo(function FiremanLadderLegend() {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
        {t("fl.legend.heading")}
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
