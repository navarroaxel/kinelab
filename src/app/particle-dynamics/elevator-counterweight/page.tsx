"use client";

import { useElevatorCounterweightSimulator } from "@/hooks/useElevatorCounterweightSimulator";
import { ElevatorCounterweightCanvas } from "@/components/elevator-counterweight/ElevatorCounterweightCanvas";
import { ElevatorCounterweightMetrics } from "@/components/elevator-counterweight/ElevatorCounterweightMetrics";
import { ElevatorCounterweightControls } from "@/components/elevator-counterweight/ElevatorCounterweightControls";
import { ElevatorCounterweightLegend } from "@/components/elevator-counterweight/ElevatorCounterweightLegend";
import { ElevatorCounterweightEquations } from "@/components/elevator-counterweight/ElevatorCounterweightEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function ElevatorCounterweightPage() {
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
  } = useElevatorCounterweightSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <ElevatorCounterweightCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <ElevatorCounterweightEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <ElevatorCounterweightMetrics state={metrics} />
        <ElevatorCounterweightControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <ElevatorCounterweightLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
