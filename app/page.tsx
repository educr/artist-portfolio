import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { AccordionSection } from "./AccordionSection";

type WorkItem = {
  slug?: string;
  href?: string;
  url?: string;
  title: string;
  year?: number | null;
  artist?: string;
  displayYear?: string;
  thumbnail?: string | null;
};

const firstImagePattern = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/;

const normalizeImageSrc = (src: string): string => {
  if (/^https?:\/\//i.test(src)) {
    return src;
  }
  if (src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
};

const extractThumbnail = (frontmatter: Record<string, unknown>, content: string): string | null => {
  const directThumbnail = frontmatter.thumbnail ?? frontmatter.cover ?? frontmatter.image;
  if (typeof directThumbnail === "string" && directThumbnail.trim().length > 0) {
    return normalizeImageSrc(directThumbnail.trim());
  }

  const firstImage = content.match(firstImagePattern)?.[1];
  if (firstImage) {
    return normalizeImageSrc(firstImage.trim());
  }

  return null;
};

const WorkCard = ({ item }: { item: WorkItem }) => {
  const inner = (
    <div className="group flex flex-col rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "var(--warm-card-bg)", border: "1px solid var(--warm-border)" }}>
      <div
        className="w-full overflow-hidden"
        style={{ aspectRatio: "3/2", background: "var(--warm-placeholder)" }}
      >
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={`${item.title} thumbnail`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: "var(--warm-placeholder-gradient)" }}
          />
        )}
      </div>
      <div className="px-3 pt-2.5 pb-3">
        <p className="text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>
          {item.title}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--warm-text)" }}>
          {item.displayYear ?? item.year ?? ""}
        </p>
      </div>
    </div>
  );

  if (item.url) {
    return (
      <Link href={item.url} className="block">
        {inner}
      </Link>
    );
  }
  if (item.slug) {
    return (
      <Link href={`/${item.slug}`} className="block">
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  );
};

const WorkGrid = ({ works }: { works: WorkItem[] }) => (
  <div className="grid grid-cols-2 gap-4 sm:gap-5">
    {works.map((item) => (
      <WorkCard key={item.url ?? item.slug ?? item.href} item={item} />
    ))}
  </div>
);

export default function Home() {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs
    .readdirSync(contentDir)
    .filter(
      (file) =>
        file.endsWith(".mdx") &&
        file !== "cv.mdx" &&
        file !== "parabiosis-credits.mdx" &&
        file !== "addendum.mdx"
    );

  const rawWorks: WorkItem[] = files.map((file) => {
    const fullPath = path.join(contentDir, file);
    const src = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(src);

    let year: number | null = null;
    if (data && data.year) {
      year = Number(data.year);
    }
    if (!year) {
      const nameMatch = file.match(/(20\d{2})/);
      if (nameMatch) year = Number(nameMatch[1]);
    }
    if (!year) {
      const contentMatch = src.match(/20\d{2}/);
      if (contentMatch) year = Number(contentMatch[0]);
    }
    if (!year) {
      try {
        const stat = fs.statSync(fullPath);
        year = stat.mtime.getFullYear();
      } catch {
        year = null;
      }
    }

    return {
      slug: file.replace(".mdx", ""),
      title: data.title || file.replace(".mdx", ""),
      year,
      artist: data.artist || "Eduardo Andrés Crespo",
      thumbnail: extractThumbnail(data as Record<string, unknown>, src),
    } satisfies WorkItem;
  });

  const yehiPattern = /^yehi-\d{4}$/;
  const legacyPaintingsPattern = /^paintings-\d{4}$/;
  const yehiEntries = rawWorks.filter(
    (work) => work.slug && (yehiPattern.test(work.slug) || legacyPaintingsPattern.test(work.slug))
  );
  const nonPaintingEntries = rawWorks.filter(
    (work) =>
      !work.slug || (!yehiPattern.test(work.slug) && !legacyPaintingsPattern.test(work.slug))
  );

  const yehiCards: WorkItem[] = yehiEntries.map((entry) => ({
    url: `/yehi?year=${entry.year}`,
    title: "Paintings",
    year: entry.year,
    artist: entry.artist ?? "Eduardo Andrés Crespo",
    thumbnail: entry.thumbnail,
  }));

  const works: WorkItem[] = [...nonPaintingEntries, ...yehiCards];

  works.sort((a, b) => {
    const ya = a.year ?? 0;
    const yb = b.year ?? 0;
    if (yb !== ya) return yb - ya;
    return a.title.localeCompare(b.title);
  });

  const primaryArtist = "Eduardo Andrés Crespo";
  const externalWorks: WorkItem[] = [
    {
      title: "Step Right Up",
      href: "https://www.k-t-z.com/exhibitions/14-step-right-up-andrea-crespo/",
      year: 2019,
      artist: "Andrea Crespo",
      thumbnail: null,
    },
  ];

  const compareWorks = (a: WorkItem, b: WorkItem) => {
    const ya = a.year ?? 0;
    const yb = b.year ?? 0;
    if (yb !== ya) return yb - ya;
    return a.title.localeCompare(b.title);
  };

  const primaryWorks = works.filter((work) => !work.artist || work.artist === primaryArtist);
  const otherWorks = works.filter((work) => work.artist && work.artist !== primaryArtist);

  const primaryList = [
    ...primaryWorks,
    ...externalWorks.filter((work) => work.artist === primaryArtist || !work.artist),
  ].sort(compareWorks);

  const otherList = [
    ...otherWorks,
    ...externalWorks.filter((work) => work.artist && work.artist !== primaryArtist),
  ].sort(compareWorks);

  return (
    <main className="mx-auto max-w-2xl px-8 py-12">
      <h1
        className="mb-1 font-light tracking-wide"
        style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}
      >
        Eduardo Andrés Crespo
      </h1>
      <div className="mb-12 flex items-center gap-6">
        <a
          href="mailto:ed.an.crespo@gmail.com"
          className="flex items-center gap-1.5 text-sm transition-opacity duration-200 hover:opacity-50"
          style={{ color: "var(--warm-nav)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          Email
        </a>
        <a
          href="https://www.instagram.com/eduardo.andres.crespo/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm transition-opacity duration-200 hover:opacity-50"
          style={{ color: "var(--warm-nav)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
          Instagram
        </a>
      </div>

      <section className="mb-16">
        <WorkGrid works={primaryList} />
      </section>

      {otherList.length > 0 && (
        <AccordionSection label="Works created as Andrea Crespo">
          <WorkGrid works={otherList} />
        </AccordionSection>
      )}
    </main>
  );
}
