"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COLORS } from "@/lib/drawing";

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="mt-0.5 inline-block h-3 w-3 flex-shrink-0 rounded-sm"
      style={{ background: color }}
    />
  );
}

export const QuickReturnLegend = memo(function QuickReturnLegend() {
  const { t } = useLanguage();

  const items = [
    { color: COLORS.rVector, label: t("quick-return.legend.crank") },
    { color: COLORS.normalForce, label: t("quick-return.legend.bar") },
    { color: COLORS.normalAccel, label: t("quick-return.legend.sliderB") },
    { color: COLORS.point, label: t("quick-return.legend.sliderP") },
    { color: COLORS.velocity, label: t("quick-return.legend.velocity") },
    {
      color: COLORS.acceleration,
      label: t("quick-return.legend.acceleration"),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("quick-return.legend.heading")}
      </h2>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300"
          >
            <Swatch color={item.color} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
