"use client";

import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { coreSimulators } from "@/lib/simulators";

const HOME_HREF = "/";
const CPM_SECTION_HREF = "/particle-kinematics";
const DPM_SECTION_HREF = "/particle-dynamics";

const pillClass = (active: boolean) =>
  `px-2.5 py-1 text-xs font-medium transition-colors ${
    active
      ? "bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300"
      : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
  }`;

function focusItem(items: (HTMLAnchorElement | null)[], index: number) {
  const n = items.length;
  const wrapped = ((index % n) + n) % n;
  items[wrapped]?.focus();
}

export const SimulatorNav = memo(function SimulatorNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const desktopItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const items = coreSimulators().map((s) => ({ href: s.href, key: s.navKey }));
  const cpmActive = pathname.startsWith(CPM_SECTION_HREF);
  const dpmActive = pathname.startsWith(DPM_SECTION_HREF);

  const allItems = [
    { href: HOME_HREF, key: "nav.home" as const },
    { href: CPM_SECTION_HREF, key: "nav.particle_kinematics" as const },
    { href: DPM_SECTION_HREF, key: "nav.particle_dynamics" as const },
    ...items,
  ];

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleBarKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLAnchorElement>,
      index: number,
      refs: React.RefObject<(HTMLAnchorElement | null)[]>,
    ) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        focusItem(refs.current, index + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        focusItem(refs.current, index - 1);
      } else if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    },
    [menuOpen],
  );

  return (
    <nav aria-label={t("nav.aria_label")} className="relative">
      {/* Desktop / tablet: flat pill bar */}
      <div className="hidden overflow-hidden rounded-md border border-gray-200 md:inline-flex dark:border-gray-700">
        {allItems.map((item, index) => {
          const active =
            item.href === CPM_SECTION_HREF
              ? cpmActive
              : item.href === DPM_SECTION_HREF
                ? dpmActive
                : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                desktopItemRefs.current[index] = el;
              }}
              aria-current={active ? "page" : undefined}
              onKeyDown={(e) => handleBarKeyDown(e, index, desktopItemRefs)}
              className={pillClass(active)}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </div>

      {/* Mobile: collapse into a menu button */}
      <div className="md:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          {t("nav.aria_label")}
        </button>
        {menuOpen && (
          <div
            id={menuId}
            role="menu"
            className="absolute top-full right-0 z-10 mt-1 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {allItems.map((item, index) => {
              const active =
                item.href === CPM_SECTION_HREF
                  ? cpmActive
                  : item.href === DPM_SECTION_HREF
                    ? dpmActive
                    : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  ref={(el) => {
                    mobileItemRefs.current[index] = el;
                  }}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  onKeyDown={(e) => handleBarKeyDown(e, index, mobileItemRefs)}
                  className={`px-3 py-2 text-left text-xs font-medium whitespace-nowrap ${pillClass(active)}`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
});
