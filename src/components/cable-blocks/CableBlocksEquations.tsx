"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { sA, sB, vA, vB, meetingTime } from "@/lib/cableBlocksKinematics";
import type { CableBlocksParams } from "@/types/simulator";

interface Props {
  params: CableBlocksParams;
}

const SAMPLES = 100;

export const CableBlocksEquations = memo(function CableBlocksEquations({
  params,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { stPoints, vtPoints, tMeet } = useMemo(() => {
    const tMeetLocal = meetingTime(params);
    const stA: [number, number][] = [];
    const stB: [number, number][] = [];
    const vtA: [number, number][] = [];
    const vtB: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const time = (tMeetLocal * i) / SAMPLES;
      stA.push([time, sA(time, params)]);
      stB.push([time, sB(time, params)]);
      vtA.push([time, vA(time, params)]);
      vtB.push([time, vB(time, params)]);
    }
    return {
      stPoints: [
        { label: "s_A", color: COLORS.rVector, points: stA },
        { label: "s_B", color: COLORS.velocity, points: stB },
      ],
      vtPoints: [
        { label: "v_A", color: COLORS.rVector, points: vtA },
        { label: "v_B", color: COLORS.velocity, points: vtB },
      ],
      tMeet: tMeetLocal,
    };
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="cable-blocks-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("cable-blocks.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="cable-blocks-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("cable-blocks.equations.statement.text")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.section.formulas")}
            </p>
            <p>
              {withSubscripts("s_B")} = ½·{withSubscripts("a_D")}·t²,{" "}
              {withSubscripts("v_B")} = {withSubscripts("a_D")}·t
            </p>
            <p>
              {withSubscripts("a_A")} = {withSubscripts("a_C")}/runsA =
              (c/runsA)·t²
            </p>
            <p>
              {withSubscripts("v_A")} = (c/runsA/3)·t³, {withSubscripts("s_A")}{" "}
              = (c/runsA/12)·t⁴
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.section.solve")}
            </p>
            <p className="font-mono">
              {withSubscripts("s_A")}(t) + {withSubscripts("s_B")}(t) = d₀
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.note.solve")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.note.reference")}
            </p>
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.note.sign")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cable-blocks.equations.section.plots")}
            </p>
            <FunctionPlot
              ariaLabel={t("cable-blocks.plot.st.title")}
              xUnit="s"
              yUnit="m"
              series={stPoints}
              markers={[
                {
                  x: tMeet,
                  y: sA(tMeet, params),
                  label: `t=${tMeet.toFixed(3)}`,
                },
              ]}
            />
            <FunctionPlot
              ariaLabel={t("cable-blocks.plot.vt.title")}
              xUnit="s"
              yUnit="m/s"
              series={vtPoints}
            />
          </div>

          <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
