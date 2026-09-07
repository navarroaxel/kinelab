"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { computeDerived, displacementAt } from "@/lib/massReleaseKinematics";
import type {
  MassReleaseDerived,
  MassReleaseParams,
} from "@/types/simulator";

interface Props {
  params: MassReleaseParams;
  derived: MassReleaseDerived;
}

const TIME_SAMPLES = 300;

export const MassReleaseEquations = memo(function MassReleaseEquations({
  params,
  derived,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { mainCurve, slackCurve, criticalCurve, duration } = useMemo(() => {
    const criticalDamping = 2 * Math.sqrt(params.stiffness * params.remainingMass);
    const hasComparison = derived.regime !== "undamped";
    const criticalDerived = hasComparison
      ? computeDerived({ ...params, damping: criticalDamping })
      : null;

    const naturalPeriod = (2 * Math.PI) / derived.naturalFrequency;
    const dur = Number.isFinite(derived.settlingTime)
      ? Math.max(derived.settlingTime * 1.3, naturalPeriod)
      : 3 * naturalPeriod;

    const main: [number, number][] = [];
    const slack: [number, number][] = [];
    const critical: [number, number][] = [];

    for (let i = 0; i <= TIME_SAMPLES; i++) {
      const time = (dur * i) / TIME_SAMPLES;
      const x = displacementAt(time, derived);
      main.push([time, x * 100]);
      if (x <= -derived.slackThreshold) {
        slack.push([time, x * 100]);
      }
      if (criticalDerived) {
        critical.push([time, displacementAt(time, criticalDerived) * 100]);
      }
    }

    return { mainCurve: main, slackCurve: slack, criticalCurve: critical, duration: dur };
    // The page recomputes `derived` fresh on every render (including every
    // ~15fps metrics tick), so depending on the object reference — rather
    // than the scalar fields this closure actually reads — would rebuild
    // all three sampled curves on every tick even when nothing relevant
    // had changed. `params` narrows the same way, since spreading it into
    // computeDerived only ever pulls out these three fields.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.hangingMass,
    params.remainingMass,
    params.stiffness,
    derived.regime,
    derived.naturalFrequency,
    derived.settlingTime,
    derived.slackThreshold,
    derived.x0,
    derived.dampingRatio,
    derived.dampedOmega,
    derived.s1,
    derived.s2,
    derived.A1,
    derived.A2,
  ]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="vib6-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("vib6.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="vib6-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vib6.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("vib6.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vib6.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("vib6.equations.theory.new_equilibrium"))}
            </p>
            {derived.slack && (
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("vib6.equations.theory.slack"))}
              </p>
            )}
            {derived.regime !== "undamped" && (
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("vib6.equations.theory.critical_comparison"))}
              </p>
            )}
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vib6.equations.section.formulas")}
            </p>
            <p>{withSubscripts("x_0 = M_2·g/k,   ω_0 = √(k/M_1),   ζ = c/(2√(k·M_1))")}</p>
            <p>{withSubscripts("ζ = 0:  x = x_0·cos(ω_0t)")}</p>
            <p>
              {withSubscripts(
                "0 < ζ < 1:  x = e^(−ζω_0t)[x_0cos(ω_dt) + (ζω_0x_0/ω_d)sin(ω_dt)]",
              )}
            </p>
            <p>{withSubscripts("ζ ≥ 1:  x = A_1e^(s_1t) + A_2e^(s_2t)")}</p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vib6.equations.section.response")}
            </p>
            <FunctionPlot
              ariaLabel={t("vib6.plot.title")}
              xUnit="s"
              yUnit="cm"
              domain={{ min: 0, max: duration }}
              series={[
                { label: "x(t)", color: COLORS.point, points: mainCurve },
                ...(slackCurve.length > 0
                  ? [
                      {
                        label: t("vib6.plot.slack_label"),
                        color: COLORS.criticalSpeed,
                        points: slackCurve,
                        dashed: true,
                      },
                    ]
                  : []),
                ...(criticalCurve.length > 0
                  ? [
                      {
                        label: "ζ = 1",
                        color: COLORS.acceleration,
                        points: criticalCurve,
                        dashed: true,
                      },
                    ]
                  : []),
              ]}
              refLines={
                derived.slack
                  ? [
                      {
                        orientation: "h",
                        value: -derived.slackThreshold * 100,
                        dashed: true,
                        label: "slack",
                      },
                    ]
                  : []
              }
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("vib6.equations.response.note"))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
