"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  ElevatorCounterweightParams,
  ElevatorCounterweightState,
} from "@/types/simulator";

interface Props {
  params: ElevatorCounterweightParams;
  state: ElevatorCounterweightState;
}

export const ElevatorCounterweightEquations = memo(
  function ElevatorCounterweightEquations({ params, state }: Props) {
    const [open, setOpen] = useState(true);
    const { t } = useLanguage();

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="elevator-counterweight-equations-content"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{t("elevator-counterweight.equations.heading")}</span>
          <span aria-hidden="true" className="text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div
            id="elevator-counterweight-equations-content"
            className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("elevator-counterweight.equations.section.statement")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {t("elevator-counterweight.equations.statement.text")}
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("elevator-counterweight.equations.section.theory")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("elevator-counterweight.equations.theory.text"))}
              </p>
            </div>

            <div className="font-mono">
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("elevator-counterweight.equations.section.formulas")}
              </p>
              <p>
                P = ({withSubscripts("m_E")}+{withSubscripts("m_W")})·v·a + (
                {withSubscripts("m_E")}−{withSubscripts("m_W")})·g·v
              </p>
              <p className="font-sans text-[11px] text-gray-500 dark:text-gray-400">
                {t("elevator-counterweight.equations.formula.note")}
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("elevator-counterweight.equations.section.reference")}
              </p>
              <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
                {t("elevator-counterweight.equations.note.reference")}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-2 font-mono text-xs dark:bg-gray-800">
              <p>
                v = {params.elevatorVelocity} m/s, a = {params.elevatorAcceleration} m/s²
              </p>
              <p>
                P ={" "}
                {state.isBraking
                  ? `−${(Math.abs(state.motorPower) / 1000).toFixed(2)}`
                  : (state.motorPower / 1000).toFixed(2)}{" "}
                kW
              </p>
            </div>

            <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
              {t("units.note")}
            </p>
          </div>
        )}
      </div>
    );
  },
);
