"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  VehiclePowerParams,
  VehiclePowerVisibility,
} from "@/types/simulator";
import {
  computeVehiclePowerState,
  MIN_CALIB_SPEED_SEPARATION_KMH,
} from "@/lib/vehiclePowerKinematics";

const INITIAL_PARAMS: VehiclePowerParams = {
  vehicleMass: 1600,
  calibSpeed1Kmh: 50,
  calibPower1: 6,
  calibSpeed2Kmh: 60,
  calibPower2: 10,
  targetSpeedKmh: 90,
  slopeSpeedKmh: 60,
  gradeDeg: 5,
};

const INITIAL_VISIBILITY: VehiclePowerVisibility = {
  showForces: true,
  showGradeForce: true,
};

export function useVehiclePowerSimulator() {
  const [params, setParams] = useState<VehiclePowerParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<VehiclePowerVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Road-scroll phase — the only high-frequency state; the fitted
  // coefficients and predicted powers are constant for a given set of
  // params, so they're derived directly rather than threaded through a
  // throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeVehiclePowerState(params), [params]);

  const setParam = useCallback(
    <K extends keyof VehiclePowerParams>(
      key: K,
      value: VehiclePowerParams[K],
    ) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        // The two calibration speeds feed a 2×2 solve that's singular when
        // they coincide — nudge the *other* one away rather than let the
        // fit blow up (see MIN_CALIB_SPEED_SEPARATION_KMH).
        if (key === "calibSpeed1Kmh" || key === "calibSpeed2Kmh") {
          const gap = next.calibSpeed2Kmh - next.calibSpeed1Kmh;
          if (Math.abs(gap) < MIN_CALIB_SPEED_SEPARATION_KMH) {
            if (key === "calibSpeed1Kmh") {
              next.calibSpeed2Kmh =
                next.calibSpeed1Kmh + MIN_CALIB_SPEED_SEPARATION_KMH;
            } else {
              next.calibSpeed1Kmh =
                next.calibSpeed2Kmh - MIN_CALIB_SPEED_SEPARATION_KMH;
            }
          }
        }
        return next;
      });
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof VehiclePowerVisibility) => {
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
