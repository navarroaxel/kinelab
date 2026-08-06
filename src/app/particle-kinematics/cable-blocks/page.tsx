"use client";

import { useCableBlocksSimulator } from "@/hooks/useCableBlocksSimulator";
import { CableBlocksCanvas } from "@/components/cable-blocks/CableBlocksCanvas";
import { CableBlocksMetrics } from "@/components/cable-blocks/CableBlocksMetrics";
import { CableBlocksControls } from "@/components/cable-blocks/CableBlocksControls";
import { CableBlocksLegend } from "@/components/cable-blocks/CableBlocksLegend";
import { CableBlocksEquations } from "@/components/cable-blocks/CableBlocksEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function CableBlocksPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
  } = useCableBlocksSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <CableBlocksCanvas
          params={params}
          visibility={visibility}
          tRef={tRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <CableBlocksEquations params={params} />
      </div>

      <aside className="flex flex-col gap-3">
        <CableBlocksMetrics state={metrics} />
        <CableBlocksControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <CableBlocksLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
