"use client";

import { useJetClimbSimulator } from "@/hooks/useJetClimbSimulator";
import { JetClimbCanvas } from "@/components/jet-climb/JetClimbCanvas";
import { JetClimbMetrics } from "@/components/jet-climb/JetClimbMetrics";
import { JetClimbControls } from "@/components/jet-climb/JetClimbControls";
import { JetClimbLegend } from "@/components/jet-climb/JetClimbLegend";
import { JetClimbEquations } from "@/components/jet-climb/JetClimbEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function JetClimbPage() {
  const {
    params,
    setParam,
    visibility,
    toggleVisibility,
    state,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    resetCount,
    timeRef,
  } = useJetClimbSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <JetClimbCanvas
            params={params}
            state={state}
            visibility={visibility}
            timeRef={timeRef}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <JetClimbEquations state={state} metrics={metrics} />
        </div>

        <aside className="flex flex-col gap-3">
          <JetClimbMetrics state={state} metrics={metrics} />
          <JetClimbControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onToggle={toggleVisibility}
            onReset={reset}
            paused={paused}
            onTogglePause={togglePause}
          />
          <JetClimbLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
