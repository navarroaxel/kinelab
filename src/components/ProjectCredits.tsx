"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const RELAX_URL = "https://relax-method-viz.vercel.app";
const RLC_URL = "https://resonara-phi.vercel.app";
const NQM_URL = "https://sagitta-nqm.vercel.app";

export const ProjectCredits = memo(function ProjectCredits() {
  const { t } = useLanguage();
  return (
    <footer className="col-span-full flex flex-wrap gap-x-6 gap-y-1 border-t border-gray-200 pt-3 dark:border-gray-700">
      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
        {t("footer.attribution")}
      </p>
      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
        {t("footer.related.prefix")}{" "}
        <a
          href={RELAX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-blue-600 hover:underline dark:text-blue-400"
        >
          relax-method-viz.vercel.app
        </a>
      </p>
      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
        {t("footer.rlc.prefix")}{" "}
        <a
          href={RLC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-blue-600 hover:underline dark:text-blue-400"
        >
          resonara-phi.vercel.app
        </a>
      </p>
      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
        {t("footer.nqm.prefix")}{" "}
        <a
          href={NQM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-blue-600 hover:underline dark:text-blue-400"
        >
          sagitta-nqm.vercel.app
        </a>
      </p>
    </footer>
  );
});
