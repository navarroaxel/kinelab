"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const RingEquations = memo(function RingEquations() {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ring-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("ring.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="ring-equations-content"
          className="flex flex-col gap-1.5 px-3 pb-3 font-mono text-xs text-gray-700 dark:text-gray-300"
        >
          <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("ring.equations.section.eom")}
          </p>
          <p>θ̈ = −(g/R) · sin θ</p>
          <p className="font-sans text-xs text-gray-400 dark:text-gray-400">
            {t("ring.equations.note.pendulum")}
          </p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("ring.equations.section.normal")}
          </p>
          <p>N = m · (g · cos θ + R · θ̇²)</p>
          <p className="font-sans text-xs text-gray-400 dark:text-gray-400">
            {t("ring.equations.note.contact")}
          </p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("ring.equations.section.vmin")}
          </p>
          <p>N_top ≥ 0 ⇒ v_top ≥ √(g·R)</p>
          <p>v²_bottom = v²_top + 4·g·R</p>
          <p>
            <strong>v_min = √(5·g·R)</strong>
          </p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("ring.equations.section.energy")}
          </p>
          <p>E = ½·m·v² + m·g·h = const</p>
          <p>KE = ½·m·R²·θ̇²</p>
          <p>PE = m·g·R·(1 − cos θ)</p>
          <p className="font-sans text-xs leading-relaxed text-gray-400 dark:text-gray-400">
            {t("ring.equations.note.energy")}
          </p>

          <p className="mt-2 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
