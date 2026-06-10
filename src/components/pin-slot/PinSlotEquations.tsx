"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const PinSlotEquations = memo(function PinSlotEquations() {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="pin-slot-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("pin-slot.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="pin-slot-equations-content"
          className="flex flex-col gap-1.5 px-3 pb-3 font-mono text-xs text-gray-700 dark:text-gray-300"
        >
          <p className="mt-1 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-500">
            {t("pin-slot.equations.section.setup")}
          </p>
          <p>B = (d + r·cosΦ, r·sinΦ)</p>
          <p>ρ = |OB| = √(d² + r² + 2·d·r·cosΦ)</p>
          <p>θ = atan2(r·sinΦ, d + r·cosΦ)</p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-500">
            {t("pin-slot.equations.section.pin")}
          </p>
          <p>Ω = Φ̇ = V₀ / r (constant)</p>
          <p>Φ̈ = 0</p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-500">
            {t("pin-slot.equations.section.bar")}
          </p>
          <p>Vᵣ = ρ̇ = −(d·V₀·sinΦ) / ρ</p>
          <p>ω = θ̇ = V₀·(r + d·cosΦ) / ρ²</p>
          <p>γ = θ̈ = Vᵣ·(Ω − 2ω) / ρ</p>
          <p>V⊥ = ρ·ω</p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-500">
            {t("pin-slot.equations.section.swing")}
          </p>
          <p>|θ|_max = arcsin(r / d)</p>
          <p className="font-sans text-xs leading-relaxed text-gray-400 dark:text-gray-500">
            {t("pin-slot.equations.note.swing")}
          </p>

          <p className="mt-2 mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-500">
            {t("pin-slot.equations.section.invariant")}
          </p>
          <p>Vᵣ² + V⊥² = V₀²</p>
          <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
            {t("pin-slot.equations.note.invariant")}
          </p>

          <p className="mt-2 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-500">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
