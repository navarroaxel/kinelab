'use client'

import { memo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const RELAX_URL = 'https://relax-method-viz.vercel.app'

export const ProjectCredits = memo(function ProjectCredits() {
  const { t } = useLanguage()
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900 flex flex-col gap-2">
      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
        {t('footer.attribution')}
      </p>
      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
        {t('footer.related.prefix')}{' '}
        <a
          href={RELAX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
        >
          relax-method-viz.vercel.app
        </a>
      </p>
    </div>
  )
})
