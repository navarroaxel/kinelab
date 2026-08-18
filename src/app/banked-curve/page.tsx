"use client";

import { useBankedCurveSimulator } from "@/hooks/useBankedCurveSimulator";
import { BankedCurveCanvas } from "@/components/banked-curve/BankedCurveCanvas";
import { BankedCurveMetrics } from "@/components/banked-curve/BankedCurveMetrics";
import { BankedCurveControls } from "@/components/banked-curve/BankedCurveControls";
import { BankedCurveLegend } from "@/components/banked-curve/BankedCurveLegend";
import { BankedCurveEquations } from "@/components/banked-curve/BankedCurveEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function BankedCurvePage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    limits,
    paused,
    togglePause,
    reset,
    setSpeed,
    resetCount,
    phaseRef,
    cameraRef,
    orbitCamera,
    resetCamera,
  } = useBankedCurveSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <BankedCurveCanvas
            params={params}
            visibility={visibility}
            phaseRef={phaseRef}
            cameraRef={cameraRef}
            onOrbit={orbitCamera}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <BankedCurveEquations
            params={params}
            state={metrics}
            limits={limits}
          />
        </div>

        <aside className="flex flex-col gap-3">
          <BankedCurveMetrics
            state={metrics}
            limits={limits}
            mu={params.mu}
          />
          <BankedCurveControls
            params={params}
            visibility={visibility}
            limits={limits}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            onSetSpeed={setSpeed}
            onResetCamera={resetCamera}
            paused={paused}
            onTogglePause={togglePause}
          />
          <BankedCurveLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
