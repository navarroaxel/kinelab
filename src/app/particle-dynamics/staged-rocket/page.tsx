"use client";

import { useStagedRocketSimulator } from "@/hooks/useStagedRocketSimulator";
import { StagedRocketCanvas } from "@/components/staged-rocket/StagedRocketCanvas";
import { StagedRocketMetrics } from "@/components/staged-rocket/StagedRocketMetrics";
import { StagedRocketControls } from "@/components/staged-rocket/StagedRocketControls";
import { StagedRocketLegend } from "@/components/staged-rocket/StagedRocketLegend";
import { StagedRocketEquations } from "@/components/staged-rocket/StagedRocketEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function StagedRocketPage() {
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
  } = useStagedRocketSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <StagedRocketCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <StagedRocketEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <StagedRocketMetrics state={metrics} />
        <StagedRocketControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <StagedRocketLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
