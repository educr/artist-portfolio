"use client";

import { useState } from "react";

export function AccordionSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        onClick={() => setOpen(!open)}
        className="group mb-8 pb-3 text-[10px] uppercase tracking-[0.25em] font-light border-b w-full text-left flex items-center justify-between transition-opacity duration-200 hover:opacity-60 cursor-pointer"
        style={{ color: "var(--warm-label)", borderColor: "var(--warm-border)" }}
      >
        {label}
        <span className="text-base transition-transform duration-200" style={{ display: "inline-block", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </button>
      {open && children}
    </section>
  );
}
