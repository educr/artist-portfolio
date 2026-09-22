"use client";

import { useRouter } from "next/navigation";

type AllYearsProps = {
  years: number[];
  activeYear: number;
};

export function OilPaintingsYearList({ years, activeYear }: AllYearsProps) {
  const router = useRouter();

  const navigate = (year: number) => {
    router.replace(`/oil-paintings?year=${year}`, { scroll: false });
  };

  return (
    <div
      className="sticky z-20 py-3"
      style={{
        top: "49px",
        background: "rgba(249, 247, 245, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(200, 168, 128, 0.22)",
      }}
    >
      <div className="mx-auto max-w-2xl px-8 flex flex-wrap gap-2">
        {years.map((year) => {
          const isActive = year === activeYear;
          return (
            <button
              key={year}
              onClick={() => navigate(year)}
              className="px-4 py-1 rounded-full text-xs uppercase tracking-[0.15em] font-light cursor-pointer transition-all"
              style={{
                background: isActive ? "var(--warm-accent)" : "transparent",
                color: isActive ? "var(--background)" : "var(--warm-nav)",
                border: "1px solid var(--warm-border)",
              }}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type PrevNextProps = {
  prevYear: number | null;
  nextYear: number | null;
};

export function OilPaintingsPrevNext({ prevYear, nextYear }: PrevNextProps) {
  const router = useRouter();

  const navigate = (year: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.replace(`/oil-paintings?year=${year}`, { scroll: false });
  };

  if (!prevYear && !nextYear) return null;

  return (
    <div className="mx-auto max-w-2xl px-8 flex items-center justify-between py-6">
      {prevYear ? (
        <button
          onClick={() => navigate(prevYear)}
          className="text-xs uppercase tracking-[0.15em] font-light cursor-pointer transition-opacity hover:opacity-60"
          style={{ color: "var(--warm-nav)" }}
        >
          ← {prevYear}
        </button>
      ) : (
        <span />
      )}
      {nextYear ? (
        <button
          onClick={() => navigate(nextYear)}
          className="text-xs uppercase tracking-[0.15em] font-light cursor-pointer transition-opacity hover:opacity-60"
          style={{ color: "var(--warm-nav)" }}
        >
          {nextYear} →
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}
