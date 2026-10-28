"use client";

import { usePlanetaryReducerSimulator } from "@/hooks/usePlanetaryReducerSimulator";
import { PlanetaryReducerCanvas } from "@/components/planetary-reducer/PlanetaryReducerCanvas";
import { PlanetaryReducerMetrics } from "@/components/planetary-reducer/PlanetaryReducerMetrics";
import { PlanetaryReducerControls } from "@/components/planetary-reducer/PlanetaryReducerControls";
import { PlanetaryReducerLegend } from "@/components/planetary-reducer/PlanetaryReducerLegend";
import { PlanetaryReducerEquations } from "@/components/planetary-reducer/PlanetaryReducerEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function PlanetaryReducerPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    timeScale,
    setTimeScale,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    snapToStatement,
    resetCount,
    phaseRef,
  } = usePlanetaryReducerSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <PlanetaryReducerCanvas
          params={params}
          visibility={visibility}
          phaseRef={phaseRef}
          timeScale={timeScale}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <PlanetaryReducerEquations state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <PlanetaryReducerMetrics state={metrics} />
        <PlanetaryReducerControls
          params={params}
          visibility={visibility}
          timeScale={timeScale}
          onSetParam={setParam}
          onSetTimeScale={setTimeScale}
          onToggle={toggleVisibility}
          onReset={reset}
          onSnapToStatement={snapToStatement}
          paused={paused}
          onTogglePause={togglePause}
        />
        <PlanetaryReducerLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
