"use client";

import { useRailCarCouplingSimulator } from "@/hooks/useRailCarCouplingSimulator";
import { RailCarCouplingCanvas } from "@/components/rail-car-coupling/RailCarCouplingCanvas";
import { RailCarCouplingMetrics } from "@/components/rail-car-coupling/RailCarCouplingMetrics";
import { RailCarCouplingControls } from "@/components/rail-car-coupling/RailCarCouplingControls";
import { RailCarCouplingLegend } from "@/components/rail-car-coupling/RailCarCouplingLegend";
import { RailCarCouplingEquations } from "@/components/rail-car-coupling/RailCarCouplingEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function RailCarCouplingPage() {
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
  } = useRailCarCouplingSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <RailCarCouplingCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <RailCarCouplingEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <RailCarCouplingMetrics state={metrics} />
        <RailCarCouplingControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <RailCarCouplingLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
