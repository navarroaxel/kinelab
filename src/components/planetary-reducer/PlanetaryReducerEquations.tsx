"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { PlanetaryReducerState } from "@/types/simulator";

interface Props {
  state: PlanetaryReducerState;
}

export const PlanetaryReducerEquations = memo(
  function PlanetaryReducerEquations({}: Props) {
    const [open, setOpen] = useState(true);
    const { t } = useLanguage();

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="planetary-reducer-equations-content"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{t("pr.equations.heading")}</span>
          <span aria-hidden="true" className="text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div
            id="planetary-reducer-equations-content"
            className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("pr.equations.section.statement")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {t("pr.equations.statement.text")}
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("pr.equations.section.theory")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("pr.equations.theory.cir"))}
              </p>
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("pr.equations.theory.chain"))}
              </p>
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("pr.equations.theory.ring"))}
              </p>
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("pr.equations.theory.senses"))}
              </p>
            </div>

            <div className="font-mono">
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("pr.equations.section.formulas")}
              </p>
              <p>v_J = ω_A·r_A</p>
              <p>ω_p = v_J / (2r)</p>
              <p>v_O = ω_p·r = v_J / 2</p>
              <p>ω_c = v_O / (r_A + r)</p>
              <p>r_E = r_A + 2r</p>
              <p>ω_c / ω_A = r_A / (r_A + r_E)</p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("pr.equations.section.reference")}
              </p>
              <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
                {withSubscripts(t("pr.equations.note.reference"))}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
);
