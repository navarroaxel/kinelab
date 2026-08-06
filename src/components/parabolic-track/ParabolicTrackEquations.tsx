"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { ParabolicTrackState } from "@/types/simulator";

interface Props {
  state: ParabolicTrackState;
}

export const ParabolicTrackEquations = memo(function ParabolicTrackEquations({
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="parabolic-track-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("parabolic-track.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="parabolic-track-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-track.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("parabolic-track.equations.statement.text")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-track.equations.section.formulas")}
            </p>
            <p>y = x²/k, y′ = x/(k/2), y″ = 2/k</p>
            <p>{withSubscripts("R_c")} = (1 + y′²)^(3/2) / |y″|</p>
            <p>{withSubscripts("a_n")} = v² / R_c</p>
            <p>
              |a| = √({withSubscripts("a_t")}² + {withSubscripts("a_n")}²)
            </p>
            <p>
              β = arctan({withSubscripts("a_n")} / {withSubscripts("a_t")})
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-track.equations.section.reference")}
            </p>
            <p className="font-mono">
              {withSubscripts("R_c")} = {state.Rc.toFixed(2)} m, aₙ ={" "}
              {state.an.toFixed(3)} m/s², |a| = {state.a.toFixed(3)} m/s², β ={" "}
              {state.betaDeg.toFixed(1)}°
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("parabolic-track.equations.note.reference"))}
            </p>
          </div>

          <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
            {withSubscripts(t("parabolic-track.equations.note.sign"))}
          </p>

          <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
