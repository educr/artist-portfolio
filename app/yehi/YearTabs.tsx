"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Section = {
  id: string;
  label: string;
};

type Props = {
  sections: Section[];
};

export default function YearTabs({ sections }: Props) {
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const frameRef = useRef<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const updateActive = useCallback(
    (nextId: string | null) => {
      activeIdRef.current = nextId;
      setActiveId((prev) => (prev === nextId ? prev : nextId));
    },
    [setActiveId]
  );

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    const hash = window.location.hash.replace("#", "");
    if (hash && sectionIds.includes(hash)) {
      updateActive(hash);
    } else {
      updateActive(sections[0]?.id ?? null);
    }
  }, [sectionIds, sections, updateActive]);

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    const getOffsetFromTop = () => {
      const navHeight = navRef.current?.offsetHeight ?? 64;
      return navHeight + 32;
    };

    const calculateActiveSection = () => {
      frameRef.current = null;
      const scrollPosition = window.scrollY + getOffsetFromTop();
      let currentId: string | null = sections[0]?.id ?? null;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (!element) {
          return;
        }
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        if (scrollPosition >= elementTop) {
          currentId = section.id;
        }
      });

      if (currentId && currentId !== activeIdRef.current) {
        updateActive(currentId);
      }
    };

    const handleScroll = () => {
      if (frameRef.current !== null) {
        return;
      }
      frameRef.current = window.requestAnimationFrame(calculateActiveSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections, updateActive]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", `#${id}`);
      }
      updateActive(id);
    }
  };

  if (!sections.length) {
    return null;
  }

  const navStyle: CSSProperties = {
    background: "var(--background)",
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-20 border-b border-black/10 backdrop-blur"
      data-year-tabs-nav
      style={navStyle}
    >
      <ul className="flex gap-2 overflow-x-auto px-2 py-3">
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => handleClick(event, section.id)}
                style={
                  isActive
                    ? {
                        background: "var(--foreground)",
                        color: "var(--background)",
                      }
                    : {
                        color: "var(--foreground)",
                      }
                }
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  isActive ? "" : "hover:bg-black/5"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
