"use client";

import { useVehicleSuspensionSimulator } from "@/hooks/useVehicleSuspensionSimulator";
import { VehicleSuspensionCanvas } from "@/components/vehicle-suspension/VehicleSuspensionCanvas";
import { VehicleSuspensionMetrics } from "@/components/vehicle-suspension/VehicleSuspensionMetrics";
import { VehicleSuspensionControls } from "@/components/vehicle-suspension/VehicleSuspensionControls";
import { VehicleSuspensionLegend } from "@/components/vehicle-suspension/VehicleSuspensionLegend";
import { VehicleSuspensionEquations } from "@/components/vehicle-suspension/VehicleSuspensionEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { useLanguage } from "@/contexts/LanguageContext";

export default function VehicleSuspensionPage() {
  const { t } = useLanguage();
  const {
    params,
    setParam,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
    metrics,
    setMetrics,
  } = useVehicleSuspensionSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("vs.title")}
          </h1>
        </header>
        <VehicleSuspensionCanvas
          params={params}
          tRef={tRef}
          onMetrics={setMetrics}
          paused={paused}
          resetCount={resetCount}
        />
        <VehicleSuspensionEquations />
      </div>

      <aside className="flex flex-col gap-3">
        <VehicleSuspensionMetrics state={metrics} />
        <VehicleSuspensionControls
          params={params}
          onSetParam={setParam}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <VehicleSuspensionLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
