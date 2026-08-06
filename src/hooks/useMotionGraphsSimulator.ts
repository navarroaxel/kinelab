"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  MotionGraphsParams,
  MotionGraphsVisibility,
  MotionVertex,
} from "@/types/simulator";
import {
  segmentsFromVertices,
  velocityAtTime,
  accelerationAtTime,
  positionAtTime,
  finalPosition,
  MOTION_GRAPHS_PRESETS,
} from "@/lib/motionGraphsKinematics";

const DEFAULT_PRESET = "case1";

const INITIAL_PARAMS: MotionGraphsParams = {
  vertices: MOTION_GRAPHS_PRESETS[DEFAULT_PRESET].map((v) => ({ ...v })),
  snapToGrid: false,
};

const INITIAL_VISIBILITY: MotionGraphsVisibility = {
  showAcceleration: true,
  showPosition: true,
  showMarkers: true,
};

const MIN_GAP = 1; // minimum seconds between adjacent vertices
const SNAP_T = 5;
const SNAP_V = 10;

function snap(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function useMotionGraphsSimulator() {
  const [params, setParams] = useState<MotionGraphsParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<MotionGraphsVisibility>(INITIAL_VISIBILITY);
  const [scrubT, setScrubT] = useState(0);

  const segments = useMemo(
    () => segmentsFromVertices(params.vertices),
    [params.vertices],
  );

  const tEnd = params.vertices[params.vertices.length - 1]?.t ?? 0;

  const metrics = useMemo(() => {
    const t = Math.min(Math.max(scrubT, 0), tEnd);
    return {
      t,
      v: velocityAtTime(segments, t),
      a: accelerationAtTime(segments, t),
      x: positionAtTime(segments, t),
      xFinal: finalPosition(segments),
    };
  }, [segments, scrubT, tEnd]);

  const setPreset = useCallback((id: string) => {
    const preset = MOTION_GRAPHS_PRESETS[id];
    if (!preset) return;
    setParams((prev) => ({
      ...prev,
      vertices: preset.map((v) => ({ ...v })),
    }));
    setScrubT(0);
  }, []);

  const toggleSnap = useCallback(() => {
    setParams((prev) => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);

  const toggleVisibility = useCallback((key: keyof MotionGraphsVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const addSegment = useCallback(() => {
    setParams((prev) => {
      const last = prev.vertices[prev.vertices.length - 1];
      const next: MotionVertex = { t: last.t + 10, v: last.v };
      return { ...prev, vertices: [...prev.vertices, next] };
    });
  }, []);

  const removeSegment = useCallback(() => {
    setParams((prev) => {
      if (prev.vertices.length <= 2) return prev;
      return { ...prev, vertices: prev.vertices.slice(0, -1) };
    });
  }, []);

  const moveVertex = useCallback((index: number, t: number, v: number) => {
    setParams((prev) => {
      const vertices = prev.vertices.map((vertex) => ({ ...vertex }));
      const vertex = vertices[index];
      if (!vertex) return prev;

      const isFirst = index === 0;
      const isLast = index === vertices.length - 1;

      let nextT = vertex.t;
      if (!isFirst) {
        const prevT = vertices[index - 1].t;
        const nextNeighborT = isLast ? Infinity : vertices[index + 1].t;
        nextT = Math.min(Math.max(t, prevT + MIN_GAP), nextNeighborT - MIN_GAP);
        if (prev.snapToGrid) nextT = snap(nextT, SNAP_T);
      }

      let nextV = v;
      if (prev.snapToGrid) nextV = snap(nextV, SNAP_V);

      vertices[index] = { t: nextT, v: nextV };
      return { ...prev, vertices };
    });
  }, []);

  const reset = useCallback(() => {
    setPreset(DEFAULT_PRESET);
  }, [setPreset]);

  return {
    params,
    visibility,
    segments,
    tEnd,
    scrubT,
    setScrubT,
    metrics,
    setPreset,
    toggleSnap,
    toggleVisibility,
    addSegment,
    removeSegment,
    moveVertex,
    reset,
  };
}
