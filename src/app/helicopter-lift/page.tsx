"use client";

import { useHelicopterLiftSimulator } from "@/hooks/useHelicopterLiftSimulator";
import { HelicopterLiftCanvas } from "@/components/helicopter-lift/HelicopterLiftCanvas";
import { HelicopterLiftMetrics } from "@/components/helicopter-lift/HelicopterLiftMetrics";
import { HelicopterLiftControls } from "@/components/helicopter-lift/HelicopterLiftControls";
import { HelicopterLiftLegend } from "@/components/helicopter-lift/HelicopterLiftLegend";
import { HelicopterLiftEquations } from "@/components/helicopter-lift/HelicopterLiftEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function HelicopterLiftPage() {
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
  } = useHelicopterLiftSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <HelicopterLiftCanvas
            params={params}
            state={metrics}
            visibility={visibility}
            phaseRef={phaseRef}
            paused={paused}
            resetCount={resetCount}
          />
          <HelicopterLiftEquations params={params} state={metrics} />
        </div>

        <aside className="flex flex-col gap-3">
          <HelicopterLiftMetrics state={metrics} />
          <HelicopterLiftControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            paused={paused}
            onTogglePause={togglePause}
          />
          <HelicopterLiftLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
