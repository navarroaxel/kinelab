"use client";

import { memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { COLORS } from "@/lib/drawing";
import { transmissibility } from "@/lib/vibrationTransmissibility";
import type {
  VibrationIsolationDerived,
  VibrationIsolationParams,
} from "@/types/simulator";

interface Props {
  params: VibrationIsolationParams;
  derived: VibrationIsolationDerived;
}

const CURVE_SAMPLES = 240;
const MIN_MAX_RATIO = 4;
/** T is unbounded near r = 1 at low ζ; clip it to stay readable. */
const CEILING = 4;

export const VibrationIsolationPlot = memo(function VibrationIsolationPlot({
  params,
  derived,
}: Props) {
  const { t } = useLanguage();

  // A low target with heavy damping can push the solution well past the
  // usual r = 4 window (e.g. a very small T needs a very large r) — widen
  // the sampled range (with headroom) so the domain, which FunctionPlot
  // fits from the series data alone, always reaches the solution, instead
  // of silently clipping its marker and shaded region off-plot.
  const maxRatio =
    derived.status === "solved"
      ? Math.max(MIN_MAX_RATIO, derived.frequencyRatio! * 1.15)
      : MIN_MAX_RATIO;

  const { dampedCurve, undampedCurve } = useMemo(() => {
    const damped: [number, number][] = [];
    const undamped: [number, number][] = [];
    for (let i = 0; i <= CURVE_SAMPLES; i++) {
      const r = (maxRatio * i) / CURVE_SAMPLES;
      damped.push([r, Math.min(transmissibility(r, params.dampingRatio), CEILING)]);
      undamped.push([r, Math.min(transmissibility(r, 0), CEILING)]);
    }
    return { dampedCurve: damped, undampedCurve: undamped };
  }, [params.dampingRatio, maxRatio]);

  const shadedAreas =
    derived.status === "solved"
      ? [{ seriesIndex: 0, x0: derived.frequencyRatio!, x1: maxRatio }]
      : [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <FunctionPlot
        ariaLabel={t("vib3.plot.title")}
        xUnit=""
        series={[
          {
            label: `ζ = ${params.dampingRatio.toFixed(2)}`,
            color: COLORS.coriolis,
            points: dampedCurve,
          },
          {
            label: "ζ = 0",
            color: COLORS.acceleration,
            points: undampedCurve,
            dashed: true,
          },
        ]}
        shadedAreas={shadedAreas}
        refLines={[
          {
            orientation: "h",
            value: params.targetTransmissibility,
            dashed: true,
            label: "T target",
          },
          ...(derived.status === "solved"
            ? [{ orientation: "v" as const, value: derived.frequencyRatio! }]
            : []),
        ]}
      />
    </div>
  );
});
