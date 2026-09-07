"use client";

import { useCallback, useState } from "react";
import type { PressureGaugeParams } from "@/types/simulator";

const INITIAL_PARAMS: PressureGaugeParams = {
  stiffness: 17_500, // 175 N/cm
  cyclesPerMinute: 600,
  errorLimit: 0.02,
};

export function usePressureGaugeSimulator() {
  const [params, setParams] = useState<PressureGaugeParams>(INITIAL_PARAMS);

  const setParam = useCallback(
    <K extends keyof PressureGaugeParams>(
      key: K,
      value: PressureGaugeParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => setParams(INITIAL_PARAMS), []);

  return { params, setParam, reset };
}
