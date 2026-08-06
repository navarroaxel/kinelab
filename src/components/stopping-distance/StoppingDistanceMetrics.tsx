"use client";

import { memo, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { StoppingDistanceState } from "@/types/simulator";

interface Props {
  state: StoppingDistanceState;
}

export const StoppingDistanceMetrics = memo(function StoppingDistanceMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const columns: {
    key: keyof StoppingDistanceState["cases"][number];
    label: ReactNode;
    fmt: (v: number) => string;
  }[] = [
    {
      key: "speedKmh",
      label: t("stopping-distance.metrics.table.speed_kmh"),
      fmt: (v) => v.toFixed(0),
    },
    {
      key: "v0",
      label: t("stopping-distance.metrics.table.speed_ms"),
      fmt: (v) => v.toFixed(2),
    },
    {
      key: "d1",
      label: t("stopping-distance.metrics.table.d1"),
      fmt: (v) => v.toFixed(2),
    },
    {
      key: "tf",
      label: withSubscripts(t("stopping-distance.metrics.table.tf")),
      fmt: (v) => v.toFixed(2),
    },
    {
      key: "d2",
      label: t("stopping-distance.metrics.table.d2"),
      fmt: (v) => v.toFixed(2),
    },
    {
      key: "D",
      label: t("stopping-distance.metrics.table.d"),
      fmt: (v) => v.toFixed(2),
    },
    {
      key: "tTotal",
      label: withSubscripts(t("stopping-distance.metrics.table.ttotal")),
      fmt: (v) => v.toFixed(2),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("stopping-distance.metrics.heading")}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th />
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-1 pb-1 text-right font-medium text-gray-500 dark:text-gray-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.cases.map((c, i) => (
              <tr
                key={`${c.speedKmh}-${i}`}
                className={
                  c.exceedsObstacle ? "bg-rose-50 dark:bg-rose-950" : undefined
                }
              >
                <td className="px-1 py-1 font-medium text-gray-500 dark:text-gray-400">
                  {c.exceedsObstacle ? "⚠" : ""}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-1 py-1 text-right font-mono text-gray-800 dark:text-gray-100"
                  >
                    {col.fmt(c[col.key] as number)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
