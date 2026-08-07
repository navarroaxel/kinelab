"use client";

import { useVehiclePowerSimulator } from "@/hooks/useVehiclePowerSimulator";
import { VehiclePowerCanvas } from "@/components/vehicle-power/VehiclePowerCanvas";
import { VehiclePowerMetrics } from "@/components/vehicle-power/VehiclePowerMetrics";
import { VehiclePowerControls } from "@/components/vehicle-power/VehiclePowerControls";
import { VehiclePowerLegend } from "@/components/vehicle-power/VehiclePowerLegend";
import { VehiclePowerEquations } from "@/components/vehicle-power/VehiclePowerEquations";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";

export default function VehiclePowerPage() {
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
  } = useVehiclePowerSimulator();

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-start gap-4 p-4 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3">
        <SimulatorHeader />
        <VehiclePowerCanvas
          params={params}
          state={metrics}
          visibility={visibility}
          phaseRef={phaseRef}
          paused={paused}
          resetCount={resetCount}
        />
        <VehiclePowerEquations params={params} state={metrics} />
      </div>

      <aside className="flex flex-col gap-3">
        <VehiclePowerMetrics state={metrics} />
        <VehiclePowerControls
          params={params}
          visibility={visibility}
          onSetParam={setParam}
          onToggle={toggleVisibility}
          onReset={reset}
          paused={paused}
          onTogglePause={togglePause}
        />
        <VehiclePowerLegend />
      </aside>
      <ProjectCredits />
    </main>
  );
}
