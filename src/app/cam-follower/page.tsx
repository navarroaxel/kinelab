"use client";

import { useCamFollowerSimulator } from "@/hooks/useCamFollowerSimulator";
import { CamFollowerCanvas } from "@/components/cam-follower/CamFollowerCanvas";
import { CamFollowerMetrics } from "@/components/cam-follower/CamFollowerMetrics";
import { CamFollowerControls } from "@/components/cam-follower/CamFollowerControls";
import { CamFollowerLegend } from "@/components/cam-follower/CamFollowerLegend";
import { CamFollowerEquations } from "@/components/cam-follower/CamFollowerEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function CamFollowerPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    extremes,
    paused,
    togglePause,
    reset,
    goToAngle,
    resetCount,
    phaseRef,
    cameraRef,
    orbitCamera,
    resetCamera,
  } = useCamFollowerSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <CamFollowerCanvas
            params={params}
            visibility={visibility}
            phaseRef={phaseRef}
            cameraRef={cameraRef}
            onOrbit={orbitCamera}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <CamFollowerEquations
            params={params}
            state={metrics}
            extremes={extremes}
          />
        </div>

        <aside className="flex flex-col gap-3">
          <CamFollowerMetrics state={metrics} extremes={extremes} />
          <CamFollowerControls
            params={params}
            visibility={visibility}
            extremes={extremes}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            onGoToAngle={goToAngle}
            onResetCamera={resetCamera}
            paused={paused}
            onTogglePause={togglePause}
          />
          <CamFollowerLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
