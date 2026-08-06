"use client";

import { useStoppingDistanceSimulator } from "@/hooks/useStoppingDistanceSimulator";
import { StoppingDistanceCanvas } from "@/components/stopping-distance/StoppingDistanceCanvas";
import { StoppingDistanceMetrics } from "@/components/stopping-distance/StoppingDistanceMetrics";
import { StoppingDistanceControls } from "@/components/stopping-distance/StoppingDistanceControls";
import { StoppingDistanceLegend } from "@/components/stopping-distance/StoppingDistanceLegend";
import { StoppingDistanceEquations } from "@/components/stopping-distance/StoppingDistanceEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function StoppingDistancePage() {
  const {
    params,
    setSpeed,
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
  } = useStoppingDistanceSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <StoppingDistanceCanvas
          params={params}
          visibility={visibility}
          tRef={tRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <StoppingDistanceEquations
          cases={metrics.cases}
          reactionTime={params.reactionTime}
        />
      </div>

      <aside className="flex flex-col gap-3">
        <StoppingDistanceMetrics state={metrics} />
        <StoppingDistanceControls
          params={params}
          visibility={visibility}
          onSetSpeed={setSpeed}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <StoppingDistanceLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
