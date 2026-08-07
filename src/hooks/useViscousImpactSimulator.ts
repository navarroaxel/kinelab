"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  ViscousImpactParams,
  ViscousImpactVisibility,
} from "@/types/simulator";
import { computeViscousImpactState } from "@/lib/viscousImpactKinematics";

const INITIAL_PARAMS: ViscousImpactParams = {
  bulletMass: 0.014,
  entrySpeed: 500,
  exitSpeed: 200,
  plateThickness: 0.025,
};

const INITIAL_VISIBILITY: ViscousImpactVisibility = {
  showBullet: true,
  showVelocityCurve: true,
};

export function useViscousImpactSimulator() {
  const [params, setParams] = useState<ViscousImpactParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ViscousImpactVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Animation-cycle elapsed time — the only high-frequency state; the
  // deceleration and penetration depth are constant for a given set of
  // params, so they're derived directly rather than threaded through a
  // throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeViscousImpactState(params), [params]);

  const setParam = useCallback(
    <K extends keyof ViscousImpactParams>(
      key: K,
      value: ViscousImpactParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof ViscousImpactVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => {
    phaseRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
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
  };
}
