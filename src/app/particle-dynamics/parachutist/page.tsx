"use client";

import { useParachutistSimulator } from "@/hooks/useParachutistSimulator";
import { ParachutistCanvas } from "@/components/parachutist/ParachutistCanvas";
import { ParachutistMetrics } from "@/components/parachutist/ParachutistMetrics";
import { ParachutistControls } from "@/components/parachutist/ParachutistControls";
import { ParachutistLegend } from "@/components/parachutist/ParachutistLegend";
import { ParachutistEquations } from "@/components/parachutist/ParachutistEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function ParachutistPage() {
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
  } = useParachutistSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <ParachutistCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <ParachutistEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <ParachutistMetrics state={metrics} />
        <ParachutistControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <ParachutistLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
