"use client";

import { useOscillatingBarSimulator } from "@/hooks/useOscillatingBarSimulator";
import { OscillatingBarCanvas } from "@/components/oscillating-bar/OscillatingBarCanvas";
import { OscillatingBarMetrics } from "@/components/oscillating-bar/OscillatingBarMetrics";
import { OscillatingBarControls } from "@/components/oscillating-bar/OscillatingBarControls";
import { OscillatingBarLegend } from "@/components/oscillating-bar/OscillatingBarLegend";
import { OscillatingBarEquations } from "@/components/oscillating-bar/OscillatingBarEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function OscillatingBarPage() {
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
    snapToStatement,
    resetCount,
    phaseRef,
  } = useOscillatingBarSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <OscillatingBarCanvas
            params={params}
            visibility={visibility}
            phaseRef={phaseRef}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <OscillatingBarEquations
            params={params}
            state={metrics}
            limits={limits}
          />
        </div>

        <aside className="flex flex-col gap-3">
          <OscillatingBarMetrics state={metrics} />
          <OscillatingBarControls
            params={params}
            visibility={visibility}
            limits={limits}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            onSnapToStatement={snapToStatement}
            paused={paused}
            onTogglePause={togglePause}
          />
          <OscillatingBarLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
