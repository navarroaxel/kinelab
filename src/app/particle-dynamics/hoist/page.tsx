"use client";

import { useHoistSimulator } from "@/hooks/useHoistSimulator";
import { HoistCanvas } from "@/components/hoist/HoistCanvas";
import { HoistMetrics } from "@/components/hoist/HoistMetrics";
import { HoistControls } from "@/components/hoist/HoistControls";
import { HoistLegend } from "@/components/hoist/HoistLegend";
import { HoistEquations } from "@/components/hoist/HoistEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function HoistPage() {
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
  } = useHoistSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <HoistCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <HoistEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <HoistMetrics state={metrics} />
        <HoistControls
          params={params}
          state={metrics}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <HoistLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
