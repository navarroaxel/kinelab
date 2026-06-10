"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const QuickReturnEquations = memo(function QuickReturnEquations() {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="qr-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("quick-return.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="qr-equations-content"
          className="flex flex-col gap-1.5 px-3 pb-3 font-mono text-xs text-gray-700 dark:text-gray-300"
        >
          <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("quick-return.equations.section.geometry")}
          </p>
          <p>O = (0, 0), A = (0, L₂)</p>
          <p>φ(t) = ω·t (from downward vert.)</p>
          <p>x_B = r·sin φ</p>
          <p>y_B = L₂ − r·cos φ</p>
          <p>x_P = L₁·x_B / y_B</p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("quick-return.equations.section.kinematics")}
          </p>
          <p>x(t) = L₁·r·sin φ / (L₂ − r·cos φ)</p>
          <p>v(t) = ω·L₁·r·(L₂·cos φ − r) / (L₂ − r·cos φ)²</p>
          <p className="leading-tight">
            a(t) = −ω²·L₁·r·sin φ·(L₂² + r·L₂·cos φ − 2r²) / (L₂ − r·cos φ)³
          </p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("quick-return.equations.section.extremes")}
          </p>
          <p>α = arccos(r / L₂)</p>
          <p>x_max = ± L₁·r / √(L₂² − r²)</p>
          <p>ratio = (2π − 2α) / (2α)</p>
          <p className="font-sans text-xs leading-relaxed text-gray-400 dark:text-gray-400">
            {t("quick-return.equations.note.ratio")}
          </p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
            {t("quick-return.equations.section.center")}
          </p>
          <p>
            v(φ=0) = +ω·L₁·r / (L₂ − r){" "}
            <span className="text-gray-400">(fast)</span>
          </p>
          <p>
            v(φ=π) = −ω·L₁·r / (L₂ + r){" "}
            <span className="text-gray-400">(slow)</span>
          </p>
          <p className="font-sans text-xs text-gray-400 dark:text-gray-400">
            {t("quick-return.equations.note.center")}
          </p>

          <p className="mt-2 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
