"use client";

import { usePulleyFrictionSimulator } from "@/hooks/usePulleyFrictionSimulator";
import { PulleyFrictionCanvas } from "@/components/pulley-friction/PulleyFrictionCanvas";
import { PulleyFrictionMetrics } from "@/components/pulley-friction/PulleyFrictionMetrics";
import { PulleyFrictionControls } from "@/components/pulley-friction/PulleyFrictionControls";
import { PulleyFrictionLegend } from "@/components/pulley-friction/PulleyFrictionLegend";
import { PulleyFrictionEquations } from "@/components/pulley-friction/PulleyFrictionEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function PulleyFrictionPage() {
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
  } = usePulleyFrictionSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <PulleyFrictionCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <PulleyFrictionEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <PulleyFrictionMetrics state={metrics} />
        <PulleyFrictionControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <PulleyFrictionLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
