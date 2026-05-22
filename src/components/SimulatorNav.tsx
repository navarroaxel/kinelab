'use client'

import { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/lib/i18n'

const ITEMS: { href: string; key: TranslationKey }[] = [
  { href: '/',     key: 'nav.polar' },
  { href: '/ring', key: 'nav.ring' },
]

export const SimulatorNav = memo(function SimulatorNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav aria-label="Simulators" className="inline-flex rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {ITEMS.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300'
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {t(item.key)}
          </Link>
        )
      })}
    </nav>
  )
})
