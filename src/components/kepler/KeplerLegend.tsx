"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

function LegendItem({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-10 flex-shrink-0 items-center justify-center">
        {dashed ? (
          <svg width="32" height="8" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="32"
              y2="4"
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="5,3"
            />
          </svg>
        ) : (
          <div
            className="h-2 w-5 rounded-sm"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      <span className="text-[11px] text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
}

function DotItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-10 flex-shrink-0 items-center justify-center">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
}

export const KeplerLegend = memo(function KeplerLegend() {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col gap-1.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <h2 className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
        {t("kepler.legend.heading")}
      </h2>
      <DotItem color="#FFD700" label={t("kepler.legend.spacecraft")} />
      <LegendItem color="#1D9E75" label={t("kepler.legend.velocity")} />
      <LegendItem
        color="rgba(0,0,0,0.25)"
        label={t("kepler.legend.orbit0")}
        dashed
      />
      <LegendItem color="#3B8BD4" label={t("kepler.legend.orbit1")} dashed />
      <LegendItem color="#7840B8" label={t("kepler.legend.orbit2")} dashed />
      <LegendItem color="#D79020" label={t("kepler.legend.escape")} dashed />
      <div className="flex items-center gap-2">
        <div className="flex w-10 flex-shrink-0 items-center justify-center">
          <div
            className="h-4 w-6 rounded-sm opacity-60"
            style={{ backgroundColor: "rgba(0,175,140,0.5)" }}
          />
        </div>
        <span className="text-[11px] text-gray-700 dark:text-gray-300">
          {t("kepler.legend.area_sweep")}
        </span>
      </div>
    </section>
  );
});
