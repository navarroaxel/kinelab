"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { RingKinematicState, RingParams } from "@/types/simulator";

interface Props {
  state: RingKinematicState;
  params: RingParams;
}

export const RingEnergyBar = memo(function RingEnergyBar({
  state,
  params,
}: Props) {
  const { t } = useLanguage();

  // Total energy from initial conditions (½·v₀² per unit mass), expected to be
  // conserved if RK4 is accurate. Drift surfaces as a width mismatch.
  const eTotal = 0.5 * params.initialSpeed ** 2;
  const actual = state.KE + state.PE;
  const empty = eTotal <= 0.5; // v₀ ≈ 0 → nothing meaningful to show

  const denom = Math.max(actual, eTotal, 1e-9);
  const keFrac = state.KE / denom;
  const peFrac = state.PE / denom;
  const drift = actual - eTotal;
  const driftPct = eTotal > 0 ? Math.abs(drift) / eTotal : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("ring.energy.heading")}
        </h3>
        <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
          {t("ring.energy.total")} = {eTotal.toFixed(0)} u²/s²
        </span>
      </div>

      {empty ? (
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          {t("ring.energy.empty")}
        </p>
      ) : (
        <>
          <div className="relative flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-amber-400 dark:bg-amber-500"
              style={{ width: `${(keFrac * 100).toFixed(2)}%` }}
              aria-label={t("ring.energy.ke_share_aria")}
            />
            <div
              className="h-full bg-purple-500 dark:bg-purple-400"
              style={{ width: `${(peFrac * 100).toFixed(2)}%` }}
              aria-label={t("ring.energy.pe_share_aria")}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-gray-600 dark:text-gray-400">
            <span>
              <span className="text-amber-600 dark:text-amber-400">
                {t("ring.energy.ke")}
              </span>{" "}
              {state.KE.toFixed(0)}
            </span>
            <span>
              <span className="text-purple-600 dark:text-purple-400">
                {t("ring.energy.pe")}
              </span>{" "}
              {state.PE.toFixed(0)}
            </span>
            <span>
              {t("ring.energy.total")} {actual.toFixed(0)}
            </span>
          </div>
          {driftPct > 0.01 && (
            <p className="mt-1 text-[10px] text-rose-600 dark:text-rose-400">
              {t("ring.energy.drift_warning")} ({(driftPct * 100).toFixed(1)}%)
            </p>
          )}
        </>
      )}
    </div>
  );
});
