"use client";

import { useForcedVibrationSimulator } from "@/hooks/useForcedVibrationSimulator";
import { ForcedVibrationCanvas } from "@/components/forced-vibration/ForcedVibrationCanvas";
import { ForcedVibrationMetrics } from "@/components/forced-vibration/ForcedVibrationMetrics";
import { ForcedVibrationControls } from "@/components/forced-vibration/ForcedVibrationControls";
import { ForcedVibrationLegend } from "@/components/forced-vibration/ForcedVibrationLegend";
import { ForcedVibrationEquations } from "@/components/forced-vibration/ForcedVibrationEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function ForcedVibrationPage() {
  const {
    params,
    setParam,
    setDamping,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    properties,
    paused,
    togglePause,
    reset,
    showFreeResponse,
    showForcedResponse,
    resetCount,
    motionRef,
    timeRef,
  } = useForcedVibrationSimulator();

  return (
    <LanguageProvider>
      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <SimulatorHeader />
          <ForcedVibrationCanvas
            params={params}
            visibility={visibility}
            motionRef={motionRef}
            timeRef={timeRef}
            onMetrics={setMetrics}
            paused={paused}
            resetCount={resetCount}
          />
          <ForcedVibrationEquations params={params} properties={properties} />
        </div>

        <aside className="flex flex-col gap-3">
          <ForcedVibrationMetrics
            state={metrics}
            properties={properties}
            forceEnabled={params.forceEnabled}
          />
          <ForcedVibrationControls
            params={params}
            visibility={visibility}
            onSetParam={setParam}
            onSetDamping={setDamping}
            onToggle={toggleVisibility}
            onReset={reset}
            onShowFree={showFreeResponse}
            onShowForced={showForcedResponse}
            paused={paused}
            onTogglePause={togglePause}
          />
          <ForcedVibrationLegend />
        </aside>
        <ProjectCredits />
      </main>
    </LanguageProvider>
  );
}
