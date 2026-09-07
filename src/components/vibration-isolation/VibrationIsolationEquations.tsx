"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";

export const VibrationIsolationEquations = memo(
  function VibrationIsolationEquations() {
    const [open, setOpen] = useState(true);
    const { t } = useLanguage();

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="vib3-equations-content"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{t("vib3.equations.heading")}</span>
          <span aria-hidden="true" className="text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div
            id="vib3-equations-content"
            className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib3.equations.section.statement")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {t("vib3.equations.statement.text")}
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib3.equations.section.theory")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("vib3.equations.theory.backwards"))}
              </p>
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("vib3.equations.theory.damping_cost"))}
              </p>
            </div>

            <div className="font-mono">
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib3.equations.section.formulas")}
              </p>
              <p>{withSubscripts("T = √[1+(2ζr)²] / D,   u = r²")}</p>
              <p>{withSubscripts("a·u² + b·u + c = 0")}</p>
              <p>
                {withSubscripts(
                  "a = T²,   b = T²·(4ζ² − 2) − 4ζ²,   c = T² − 1",
                )}
              </p>
              <p>{withSubscripts("u = (−b + √(b² − 4ac)) / (2a),   r = √u")}</p>
            </div>
          </div>
        )}
      </div>
    );
  },
);
