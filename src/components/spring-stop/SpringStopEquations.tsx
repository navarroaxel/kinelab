"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";

export const SpringStopEquations = memo(function SpringStopEquations() {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="spring-stop-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("spring-stop.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="spring-stop-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("spring-stop.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("spring-stop.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("spring-stop.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("spring-stop.equations.theory.energy"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("spring-stop.equations.theory.quadratic"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("spring-stop.equations.section.formulas")}
            </p>
            <p>{withSubscripts(t("spring-stop.symbol.precompression_force"))} = k · x₀</p>
            <p>
              ½mv² + mg·sinθ·(L+{withSubscripts(t("spring-stop.symbol.additional_deformation"))}) −
              μmg·cosθ·(L+{withSubscripts(t("spring-stop.symbol.additional_deformation"))}) = F₀·
              {withSubscripts(t("spring-stop.symbol.additional_deformation"))} + ½k·
              {withSubscripts(t("spring-stop.symbol.additional_deformation"))}²
            </p>
            <p>
              {withSubscripts(t("spring-stop.symbol.max_force"))} ={" "}
              {withSubscripts(t("spring-stop.symbol.precompression_force"))} + k ·{" "}
              {withSubscripts(t("spring-stop.symbol.additional_deformation"))}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("spring-stop.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("spring-stop.equations.note.reference"))}
            </p>
          </div>

          <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
