import Link from "next/link";
import type { CSSProperties } from "react";

type Section = {
  year: number;
  label: string;
};

type Props = {
  sections: Section[];
  activeYear: number;
};

export default function YearTabs({ sections, activeYear }: Props) {
  if (!sections.length) {
    return null;
  }

  const navStyle: CSSProperties = {
    background: "var(--background)",
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-black/10 backdrop-blur" style={navStyle}>
      <ul className="flex gap-2 overflow-x-auto px-2 py-3">
        {sections.map((section) => {
          const isActive = activeYear === section.year;
          return (
            <li key={section.year}>
              <Link
                href={{ pathname: "/yehi", query: { year: section.year } }}
                prefetch={false}
                aria-current={isActive ? "page" : undefined}
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
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
