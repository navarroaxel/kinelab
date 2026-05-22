'use client'

import { useState, useRef, useCallback } from 'react'
import type { SimulatorParams, VisibilityState } from '@/types/simulator'

export function useSimulator() {
  const [params, setParams] = useState<SimulatorParams>({
    poleX: 0,
    poleY: 0,
    angularVelocity: 60,
    circleRadius: 100,
  })

  const [visibility, setVisibility] = useState<VisibilityState>({
    showVelocity: true,
    showCartesian: true,
    showRVector: true,
    showAcceleration: false,
    showNormalAccel: false,
    showTrace: false,
  })

  const [paused, setPaused] = useState(false)

  // phi is advanced inside the RAF loop — ref avoids re-renders on every frame
  const phiRef = useRef(0)

  // Accumulated trace points in screen coordinates
  const traceRef = useRef<{ x: number; y: number }[]>([])

  // Update a single parameter; clear trace when the pole moves
  const setParam = useCallback(
    <K extends keyof SimulatorParams>(key: K, value: SimulatorParams[K]) => {
      setParams(prev => ({ ...prev, [key]: value }))
      if (key === 'poleX' || key === 'poleY') {
        traceRef.current = []
      }
    },
    []
  )

  // Toggle a visibility layer; clear trace when toggling showTrace off
  const toggleVisibility = useCallback((key: keyof VisibilityState) => {
    setVisibility(prev => {
      const next = !prev[key]
      if (key === 'showTrace' && !next) traceRef.current = []
      return { ...prev, [key]: next }
    })
  }, [])

  // Snap the pole back to the circle center
  const resetPole = useCallback(() => {
    setParams(prev => ({ ...prev, poleX: 0, poleY: 0 }))
    traceRef.current = []
  }, [])

  const togglePause = useCallback(() => setPaused(p => !p), [])

  return {
    params,
    setParam,
    visibility,
    toggleVisibility,
    resetPole,
    phiRef,
    traceRef,
    paused,
    togglePause,
  }
}
