"use client";

import { useState, memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { VisibilityState } from "@/types/simulator";

interface Props {
  visibility: VisibilityState;
}

export const EquationsPanel = memo(function EquationsPanel({
  visibility,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="equations-panel-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="equations-panel-content"
          className="flex flex-col gap-1.5 px-3 pb-3 font-mono text-xs text-gray-700 dark:text-gray-300"
        >
          <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-300">
            {t("equations.section.position")}
          </p>
          <p>r = √[(x−x₀)² + (y−y₀)²]</p>
          <p>θ = atan2(y−y₀, x−x₀)</p>

          {visibility.showVelocity && (
            <>
              <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-300">
                {t("equations.section.polar_velocity")}
              </p>
              <p>ṙ = R · ω · sin(θ − φ)</p>
              <p>rθ̇ = R · ω · cos(φ − θ)</p>
              <p className="text-gray-400 dark:text-gray-300">
                {t("equations.note.omega_dot")}
              </p>
            </>
          )}

          {visibility.showAcceleration && (
            <>
              <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-300">
                {t("equations.section.polar_accel")}
              </p>
              <p>aᵣ = r̈ − r · θ̇²</p>
              <p>aθ = r · θ̈ + 2 · ṙ · θ̇</p>
              <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-300">
                {t("equations.section.tangential")}
              </p>
              <p>aₜ = R · α (∥ v)</p>
            </>
          )}

          {visibility.showNormalAccel && (
            <>
              <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-300">
                {t("equations.section.normal")}
              </p>
              <p>aₙ = R · ω² (→ O)</p>
            </>
          )}

          <p className="mt-2 mb-0.5 border-t border-gray-100 pt-2 font-sans text-xs text-gray-500 dark:border-gray-800 dark:text-gray-300">
            {t("equations.section.decomp_heading")}
          </p>
          <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-300">
            {t("equations.decomp.intrinsic_heading")}
          </p>
          <p className="font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-300">
            {t("equations.decomp.at")}
          </p>
          <p className="font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-300">
            {t("equations.decomp.an")}
          </p>
          <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-300">
            {t("equations.decomp.polar_heading")}
          </p>
          <p className="font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-300">
            {t("equations.decomp.ar")}
          </p>
          <p className="font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-300">
            {t("equations.decomp.atheta")}
          </p>
          <p className="font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-300">
            {t("equations.decomp.relation")}
          </p>

          <p className="mt-2 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-300">
            {t("equations.footer")}
          </p>
          <p className="font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-300">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
