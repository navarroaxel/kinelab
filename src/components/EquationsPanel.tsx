'use client'

import { useState, memo } from 'react'
import type { VisibilityState } from '@/types/simulator'

interface Props {
  visibility: VisibilityState
}

export const EquationsPanel = memo(function EquationsPanel({ visibility }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span>Equations</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 flex flex-col gap-1.5 text-xs font-mono text-gray-700 dark:text-gray-300">
          <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-1 mb-0.5">Position &amp; r vector</p>
          <p>r = √[(x−x₀)² + (y−y₀)²]</p>
          <p>θ = atan2(y−y₀, x−x₀)</p>

          {visibility.showVelocity && (
            <>
              <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-1 mb-0.5">Polar velocity</p>
              <p>ṙ  = R · ω · sin(θ − φ)</p>
              <p>rθ̇ = R · ω · cos(φ − θ)</p>
            </>
          )}

          {visibility.showAcceleration && (
            <>
              <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-1 mb-0.5">Polar acceleration</p>
              <p>aᵣ = r̈ − r · θ̇²</p>
              <p>aₒ = r · θ̈ + 2 · ṙ · θ̇</p>
            </>
          )}

          {visibility.showNormalAccel && (
            <>
              <p className="text-gray-500 dark:text-gray-500 font-sans text-[10px] mt-1 mb-0.5">Normal acceleration</p>
              <p>aₙ = R · ω²  (→ O)</p>
            </>
          )}

          <p className="mt-2 text-[10px] font-sans text-gray-500 dark:text-gray-500 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
            Pole at center → ṙ = 0, rθ̇ = R·ω = const.
            Move the pole off-center → both components become non-zero
            even though the path remains a perfect circle.
          </p>
        </div>
      )}
    </div>
  )
})
