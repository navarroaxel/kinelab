"use client";

import { memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { COLORS } from "@/lib/drawing";
import { errorAt } from "@/lib/pressureGaugeKinematics";
import type {
  PressureGaugeDerived,
  PressureGaugeParams,
} from "@/types/simulator";

interface Props {
  params: PressureGaugeParams;
  derived: PressureGaugeDerived;
}

const CURVE_SAMPLES = 200;
const MAX_RATIO = 0.5;

export const PressureGaugePlot = memo(function PressureGaugePlot({
  params,
  derived,
}: Props) {
  const { t } = useLanguage();

  const curve = useMemo(() => {
    const points: [number, number][] = [];
    for (let i = 0; i <= CURVE_SAMPLES; i++) {
      const r = (MAX_RATIO * i) / CURVE_SAMPLES;
      points.push([r, errorAt(r)]);
    }
    return points;
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <FunctionPlot
        ariaLabel={t("vib5.plot.title")}
        xUnit=""
        series={[{ label: "ε(r)", color: COLORS.coriolis, points: curve }]}
        refLines={[
          {
            orientation: "h",
            value: params.errorLimit,
            dashed: true,
            label: "ε limit",
          },
          { orientation: "v", value: derived.rMax },
        ]}
      />
    </div>
  );
});
