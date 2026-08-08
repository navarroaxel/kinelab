"use client";

import { useParabolicBowlSimulator } from "@/hooks/useParabolicBowlSimulator";
import { ParabolicBowlCanvas } from "@/components/parabolic-bowl/ParabolicBowlCanvas";
import { ParabolicBowlMetrics } from "@/components/parabolic-bowl/ParabolicBowlMetrics";
import { ParabolicBowlControls } from "@/components/parabolic-bowl/ParabolicBowlControls";
import { ParabolicBowlLegend } from "@/components/parabolic-bowl/ParabolicBowlLegend";
import { ParabolicBowlEquations } from "@/components/parabolic-bowl/ParabolicBowlEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function ParabolicBowlPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    paused,
    togglePause,
    reset,
    resetCount,
    phaseRef,
  } = useParabolicBowlSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <ParabolicBowlCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <ParabolicBowlEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <ParabolicBowlMetrics state={metrics} />
        <ParabolicBowlControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <ParabolicBowlLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
