'use client'

import { useState, useRef, useCallback } from 'react'
import type { SimulatorParams, VisibilityState, KinematicState } from '@/types/simulator'
import type { Sample } from '@/lib/strip-chart'

export function useSimulator() {
  const [params, setParams] = useState<SimulatorParams>({
    poleX: 0,
    poleY: 0,
    angularVelocity: 60,
    angularAcceleration: 0,
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

  // Live ω (deg/s), integrated from α each frame. Slider writes here directly.
  const omegaRef = useRef(60)

  // Accumulated trace points in screen coordinates
  const traceRef = useRef<{ x: number; y: number }[]>([])

  // Elapsed simulation time (s) and rolling sample buffer for strip charts.
  // Both keep advancing across parameter changes so transients are visible.
  const tRef = useRef(0)
  const samplesRef = useRef<Sample[]>([])

  // Latest live KinematicState, published every animation frame. Phasor diagrams
  // (and any other 60fps consumer) read this directly — the metrics setState is
  // throttled to ~15fps and would visibly lag the canvas.
  const latestStateRef = useRef<KinematicState | null>(null)

  // Single shared RAF tick: the main animation loop invokes every listener
  // each frame, so strip charts and other consumers don't each spawn their own.
  const tickListenersRef = useRef<Set<() => void>>(new Set())
  const subscribeTick = useCallback((fn: () => void) => {
    tickListenersRef.current.add(fn)
    return () => { tickListenersRef.current.delete(fn) }
  }, [])

  // Update a single parameter; clear trace when the pole moves
  const setParam = useCallback(
    <K extends keyof SimulatorParams>(key: K, value: SimulatorParams[K]) => {
      setParams(prev => ({ ...prev, [key]: value }))
      if (key === 'poleX' || key === 'poleY') {
        traceRef.current = []
      }
      if (key === 'angularVelocity') {
        omegaRef.current = value as number
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

  // Restore uniform motion (α = 0) while keeping the current ω
  const resetAlpha = useCallback(() => {
    setParams(prev => ({ ...prev, angularAcceleration: 0 }))
  }, [])

  const togglePause = useCallback(() => setPaused(p => !p), [])

  return {
    params,
    setParam,
    visibility,
    toggleVisibility,
    resetPole,
    resetAlpha,
    phiRef,
    omegaRef,
    traceRef,
    tRef,
    samplesRef,
    latestStateRef,
    tickListenersRef,
    subscribeTick,
    paused,
    togglePause,
  }
}
