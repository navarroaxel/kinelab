"use client";

import { useEscalatorSimulator } from "@/hooks/useEscalatorSimulator";
import { EscalatorCanvas } from "@/components/escalator/EscalatorCanvas";
import { EscalatorMetrics } from "@/components/escalator/EscalatorMetrics";
import { EscalatorControls } from "@/components/escalator/EscalatorControls";
import { EscalatorLegend } from "@/components/escalator/EscalatorLegend";
import { EscalatorEquations } from "@/components/escalator/EscalatorEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function EscalatorPage() {
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
  } = useEscalatorSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <EscalatorCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <EscalatorEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <EscalatorMetrics state={metrics} />
        <EscalatorControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <EscalatorLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
