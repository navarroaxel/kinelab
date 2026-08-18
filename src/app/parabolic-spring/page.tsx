"use client";

import { useParabolicSpringSimulator } from "@/hooks/useParabolicSpringSimulator";
import { ParabolicSpringCanvas } from "@/components/parabolic-spring/ParabolicSpringCanvas";
import { ParabolicSpringMetrics } from "@/components/parabolic-spring/ParabolicSpringMetrics";
import { ParabolicSpringControls } from "@/components/parabolic-spring/ParabolicSpringControls";
import { ParabolicSpringLegend } from "@/components/parabolic-spring/ParabolicSpringLegend";
import { ParabolicSpringEquations } from "@/components/parabolic-spring/ParabolicSpringEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function ParabolicSpringPage() {
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
    snapToStart,
    resetCount,
    motionRef,
  } = useParabolicSpringSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <ParabolicSpringCanvas
            params={params}
            visibility={visibility}
            motionRef={motionRef}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <ParabolicSpringEquations params={params} state={metrics} />
        </div>

        <aside className="flex flex-col gap-3">
          <ParabolicSpringMetrics state={metrics} />
          <ParabolicSpringControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            onSnapToStart={snapToStart}
            paused={paused}
            onTogglePause={togglePause}
          />
          <ParabolicSpringLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
