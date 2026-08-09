"use client";

import { useCallback, useRef, useState } from "react";
import type {
  VehicleSuspensionParams,
  VehicleSuspensionState,
} from "@/types/vehicle-suspension";
import { computeDerived } from "@/lib/vehicleSuspensionKinematics";

const INITIAL_PARAMS: VehicleSuspensionParams = {
  vehicleMass: 1000,
  springCount: 4,
  staticDeflection: 0.09,
  damperCount: 4,
  dampingPerDamper: 6860, // 68.6 N·s/cm
  excitationAmplitude: 0.03,
  frequencyRatio: 1,
};

export function useVehicleSuspensionSimulator() {
  const [params, setParams] = useState<VehicleSuspensionParams>(INITIAL_PARAMS);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Elapsed simulation time, held in a ref so the RAF loop never re-renders.
  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<VehicleSuspensionState>(() => {
    const derived = computeDerived(INITIAL_PARAMS);
    return { ...derived, t: 0, y: 0, x: 0 };
  });

  const setParam = useCallback(
    <K extends keyof VehicleSuspensionParams>(
      key: K,
      value: VehicleSuspensionParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    tRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setParam,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
    metrics,
    setMetrics,
  };
}
