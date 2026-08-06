"use client";

import { useElevatorCableSimulator } from "@/hooks/useElevatorCableSimulator";
import { ElevatorCableCanvas } from "@/components/elevator-cable/ElevatorCableCanvas";
import { ElevatorCableMetrics } from "@/components/elevator-cable/ElevatorCableMetrics";
import { ElevatorCableControls } from "@/components/elevator-cable/ElevatorCableControls";
import { ElevatorCableLegend } from "@/components/elevator-cable/ElevatorCableLegend";
import { ElevatorCableEquations } from "@/components/elevator-cable/ElevatorCableEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function ElevatorCablePage() {
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
    tauRef,
    loopDuration,
  } = useElevatorCableSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <ElevatorCableCanvas
          params={params}
          visibility={visibility}
          tauRef={tauRef}
          loopDuration={loopDuration}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <ElevatorCableEquations params={params} loopDuration={loopDuration} />
      </div>

      <aside className="flex flex-col gap-3">
        <ElevatorCableMetrics state={metrics} />
        <ElevatorCableControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <ElevatorCableLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
