"use client";

import { useCallback, useRef, useState } from "react";
import type {
  MachineElementBaseParams,
  MachineElementBaseState,
} from "@/types/simulator";
import { computeDerived } from "@/lib/machineElementBaseKinematics";

const INITIAL_PARAMS: MachineElementBaseParams = {
  mass: 400,
  springCount: 2,
  springStiffness: 39_200, // 392 N/cm
  damping: 3_920, // 39.2 N·s/cm
  supportAmplitude: 0.003,
  supportOmega: 7.5,
};

export function useMachineElementBaseSimulator() {
  const [params, setParams] = useState<MachineElementBaseParams>(INITIAL_PARAMS);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Elapsed simulation time, held in a ref so the RAF loop never re-renders.
  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<MachineElementBaseState>(() => {
    const derived = computeDerived(INITIAL_PARAMS);
    return {
      ...derived,
      t: 0,
      supportDisplacement: 0,
      elementDisplacement: 0,
    };
  });

  const setParam = useCallback(
    <K extends keyof MachineElementBaseParams>(
      key: K,
      value: MachineElementBaseParams[K],
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
