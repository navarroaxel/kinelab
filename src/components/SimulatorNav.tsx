"use client";

import { memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { coreSimulators } from "@/lib/simulators";

const HOME_HREF = "/";
const PK_SECTION_HREF = "/particle-kinematics";
const PD_SECTION_HREF = "/particle-dynamics";
const VIB_SECTION_HREF = "/mechanical-vibrations";

export const SimulatorNav = memo(function SimulatorNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const items = coreSimulators().map((s) => ({ href: s.href, key: s.navKey }));
  const pkActive = pathname.startsWith(PK_SECTION_HREF);
  const pdActive = pathname.startsWith(PD_SECTION_HREF);
  const vibActive = pathname.startsWith(VIB_SECTION_HREF);

  const allItems = [
    { href: HOME_HREF, key: "nav.home" as const },
    { href: PK_SECTION_HREF, key: "nav.particle_kinematics" as const },
    { href: PD_SECTION_HREF, key: "nav.particle_dynamics" as const },
    { href: VIB_SECTION_HREF, key: "nav.mechanical_vibrations" as const },
    ...items,
  ];

  const currentHref = pkActive
    ? PK_SECTION_HREF
    : pdActive
      ? PD_SECTION_HREF
      : vibActive
        ? VIB_SECTION_HREF
        : (allItems.find((item) => item.href === pathname)?.href ?? HOME_HREF);

  return (
    <nav aria-label={t("nav.aria_label")} className="relative inline-block">
      <select
        aria-label={t("nav.aria_label")}
        value={currentHref}
        onChange={(e) => router.push(e.target.value)}
        className="cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-1 pr-7 pl-3 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        {allItems.map((item) => (
          <option key={item.href} value={item.href}>
            {t(item.key)}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute top-1/2 right-2 h-3 w-3 -translate-y-1/2 text-gray-400"
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </nav>
  );
});
