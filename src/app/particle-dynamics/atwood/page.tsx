"use client";

import { useAtwoodSimulator } from "@/hooks/useAtwoodSimulator";
import { AtwoodCanvas } from "@/components/atwood/AtwoodCanvas";
import { AtwoodMetrics } from "@/components/atwood/AtwoodMetrics";
import { AtwoodControls } from "@/components/atwood/AtwoodControls";
import { AtwoodLegend } from "@/components/atwood/AtwoodLegend";
import { AtwoodEquations } from "@/components/atwood/AtwoodEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function AtwoodPage() {
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
  } = useAtwoodSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <AtwoodCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <AtwoodEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <AtwoodMetrics state={metrics} />
        <AtwoodControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <AtwoodLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
