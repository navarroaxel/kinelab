"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  ParabolicTrackParams,
  ParabolicTrackVisibility,
} from "@/types/simulator";
import { computeParabolicTrackState } from "@/lib/parabolicTrackKinematics";

const INITIAL_PARAMS: ParabolicTrackParams = {
  coeff: 1 / 80,
  xA: 10,
  v: 12,
  vDot: 4,
};

const INITIAL_VISIBILITY: ParabolicTrackVisibility = {
  showOsculatingCircle: true,
  showVelocity: true,
  showAcceleration: true,
  showParallelogram: true,
};

export function useParabolicTrackSimulator() {
  const [params, setParams] = useState<ParabolicTrackParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ParabolicTrackVisibility>(INITIAL_VISIBILITY);

  const state = useMemo(() => computeParabolicTrackState(params), [params]);

  const setParam = useCallback(
    <K extends keyof ParabolicTrackParams>(
      key: K,
      value: ParabolicTrackParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof ParabolicTrackVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => setParams(INITIAL_PARAMS), []);

  return { params, setParam, visibility, toggleVisibility, state, reset };
}
