"use client";

import { useFiremanLadderSimulator } from "@/hooks/useFiremanLadderSimulator";
import { FiremanLadderCanvas } from "@/components/fireman-ladder/FiremanLadderCanvas";
import { FiremanLadderMetrics } from "@/components/fireman-ladder/FiremanLadderMetrics";
import { FiremanLadderControls } from "@/components/fireman-ladder/FiremanLadderControls";
import { FiremanLadderLegend } from "@/components/fireman-ladder/FiremanLadderLegend";
import { FiremanLadderEquations } from "@/components/fireman-ladder/FiremanLadderEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function FiremanLadderPage() {
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
    snapToStatement,
    resetCount,
    phaseRef,
    cameraRef,
    orbitCamera,
    resetCamera,
  } = useFiremanLadderSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <FiremanLadderCanvas
            params={params}
            visibility={visibility}
            phaseRef={phaseRef}
            cameraRef={cameraRef}
            onOrbit={orbitCamera}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <FiremanLadderEquations params={params} state={metrics} />
        </div>

        <aside className="flex flex-col gap-3">
          <FiremanLadderMetrics state={metrics} />
          <FiremanLadderControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            onSnapToStatement={snapToStatement}
            onResetCamera={resetCamera}
            paused={paused}
            onTogglePause={togglePause}
          />
          <FiremanLadderLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
