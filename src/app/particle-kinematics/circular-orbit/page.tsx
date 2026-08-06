"use client";

import { useCircularOrbitSimulator } from "@/hooks/useCircularOrbitSimulator";
import { CircularOrbitCanvas } from "@/components/circular-orbit/CircularOrbitCanvas";
import { CircularOrbitMetrics } from "@/components/circular-orbit/CircularOrbitMetrics";
import { CircularOrbitControls } from "@/components/circular-orbit/CircularOrbitControls";
import { CircularOrbitLegend } from "@/components/circular-orbit/CircularOrbitLegend";
import { CircularOrbitEquations } from "@/components/circular-orbit/CircularOrbitEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function CircularOrbitPage() {
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
    thetaRef,
  } = useCircularOrbitSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <CircularOrbitCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          thetaRef={thetaRef}
          paused={paused}
          resetCount={resetCount}
        />
        <CircularOrbitEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <CircularOrbitMetrics state={metrics} />
        <CircularOrbitControls
          params={params}
          state={metrics}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <CircularOrbitLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
