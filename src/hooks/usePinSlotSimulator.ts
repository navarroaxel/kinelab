'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { PinSlotParams, PinSlotState, PinSlotVisibility } from '@/types/simulator'
import { computePinSlotState } from '@/lib/pinSlotKinematics'

// Default reference-case values (proportions match r=12.5, d=30, V0=10 cm/s).
// World units here are cm — the canvas renderer auto-scales to fit.
const INITIAL_PARAMS: PinSlotParams = {
  r: 12.5,
  d: 30,
  v0: 10,
}

const INITIAL_VISIBILITY: PinSlotVisibility = {
  showV0: true,
  showVr: true,
  showVPerp: true,
  showAngles: true,
  showRho: true,
}

export function usePinSlotSimulator() {
  const [params, setParams] = useState<PinSlotParams>(INITIAL_PARAMS)
  const [visibility, setVisibility] = useState<PinSlotVisibility>(INITIAL_VISIBILITY)
  const [paused, setPaused] = useState(false)

  // High-frequency state in refs — no re-render per frame
  const phiRef = useRef(0)

  // Metrics state (throttled ~15 fps)
  const [metrics, setMetrics] = useState<PinSlotState>(
    () => computePinSlotState(INITIAL_PARAMS, 0),
  )

  // Reset phi when params change — old trajectory is no longer meaningful
  useEffect(() => {
    phiRef.current = 0
  }, [params.r, params.d, params.v0])

  const setParam = useCallback(
    <K extends keyof PinSlotParams>(key: K, value: PinSlotParams[K]) => {
      setParams(prev => {
        const next = { ...prev, [key]: value }
        // Clamp d > r + epsilon so O always lies outside the slot circle
        if (next.d <= next.r + 1) {
          if (key === 'd') next.d = next.r + 1
          if (key === 'r') next.r = next.d - 1
        }
        return next
      })
    },
    [],
  )

  const toggleVisibility = useCallback((key: keyof PinSlotVisibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    phiRef.current = 0
  }, [])

  const togglePause = useCallback(() => setPaused(p => !p), [])

  return {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    phiRef,
  }
}
