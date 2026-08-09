"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";

export const VehicleSuspensionEquations = memo(function VehicleSuspensionEquations() {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="vs-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("vs.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="vs-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vs.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("vs.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vs.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("vs.equations.theory.equivalent_system"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("vs.equations.theory.transmissibility"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vs.equations.section.formulas")}
            </p>
            {/* Each subscripted token is passed to withSubscripts() on its own —
                its regex is greedy and grabs everything up to the next space,
                so e.g. "δ_st)" or "k_eq·m" without a separating space would
                swallow the trailing punctuation/text into the subscript. */}
            <p>
              {withSubscripts("k_eq")} = {withSubscripts("n_s")} · (m·g) / (
              {withSubscripts("n_s")} · {withSubscripts("δ_st")}) = m·g /{" "}
              {withSubscripts("δ_st")}
            </p>
            <p>
              {withSubscripts("c_eq")} = {withSubscripts("n_d")} · c
            </p>
            <p>
              {withSubscripts("ω_n")} = √({withSubscripts("k_eq")} / m), ζ ={" "}
              {withSubscripts("c_eq")} / (2√({withSubscripts("k_eq")} · m)), r = ω
              / {withSubscripts("ω_n")}
            </p>
            <p>
              TR = {withSubscripts("X_0")} / {withSubscripts("Y_0")} = √[(1 +
              (2ζr)²) / ((1 − r²)² + (2ζr)²)]
            </p>
            <p>
              {withSubscripts("X_0")} = TR · {withSubscripts("Y_0")}
            </p>
            <p className="mt-1.5 font-sans text-gray-500 dark:text-gray-400">
              {withSubscripts(t("vs.equations.formulas.legend"))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
