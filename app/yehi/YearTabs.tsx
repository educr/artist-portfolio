"use client";

import { useRouter } from "next/navigation";

type Section = {
  year: number;
  label: string;
};

type Props = {
  sections: Section[];
  activeYear: number;
};

export default function YearTabs({ sections, activeYear }: Props) {
  const router = useRouter();

  if (!sections.length) return null;

  return (
    <div
      className="sticky z-20 py-2"
      style={{
        top: "49px",
        background: "rgba(249, 247, 245, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(200, 168, 128, 0.22)",
      }}
    >
      <div className="mx-auto max-w-2xl px-8">
      <div className="flex overflow-hidden rounded-lg" style={{ border: "1px solid var(--warm-border)" }}>
        {sections.map((section, i) => {
          const isActive = activeYear === section.year;
          return (
            <button
              key={section.year}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                router.replace(`/yehi?year=${section.year}`, { scroll: false });
              }}
              className="flex-1 py-1.5 text-xs uppercase tracking-[0.15em] font-light transition-colors cursor-pointer"
              style={{
                background: isActive ? "var(--warm-accent)" : "transparent",
                color: isActive ? "var(--background)" : "var(--warm-nav)",
                borderLeft: i > 0 ? "1px solid var(--warm-border)" : undefined,
              }}
            >
              {section.label}
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
}
