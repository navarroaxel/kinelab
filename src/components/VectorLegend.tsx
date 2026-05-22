import { memo } from 'react'

const items = [
  { color: '#3B8BD4', label: 'r  (pole → P)' },
  { color: '#1D9E75', label: 'ṙ · eᵣ  (radial velocity)' },
  { color: '#E8593C', label: 'rθ̇ · eₒ  (transverse velocity)' },
  { color: '#9B59B6', label: 'Polar acceleration (aᵣ, aₒ)' },
  { color: '#D97706', label: 'Normal acceleration aₙ' },
]

export const VectorLegend = memo(function VectorLegend() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Legend</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map(item => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              style={{ background: item.color }}
              className="w-3 h-3 rounded-full shrink-0"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
