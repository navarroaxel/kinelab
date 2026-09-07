"use client";

import { useCallback, useState } from "react";
import type { VibrationIsolationParams } from "@/types/simulator";

const INITIAL_PARAMS: VibrationIsolationParams = {
  mass: 230,
  stiffness: 519_400, // 5194 N/cm
  dampingRatio: 0.2,
  targetTransmissibility: 0.2,
};

export function useVibrationIsolationSimulator() {
  const [params, setParams] = useState<VibrationIsolationParams>(INITIAL_PARAMS);

  const setParam = useCallback(
    <K extends keyof VibrationIsolationParams>(
      key: K,
      value: VibrationIsolationParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setParams(INITIAL_PARAMS), []);

  return { params, setParam, reset };
}
