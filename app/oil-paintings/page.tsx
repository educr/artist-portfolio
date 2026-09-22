import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { OilPaintingsYearList, OilPaintingsPrevNext } from "./OilPaintingsPagination";

type OilPaintingsEntry = {
  year: number;
  filePath: string;
  artist?: string;
};

const oilPaintingsPattern = /^oil-paintings-(\d{4})\.mdx$/;

const loadEntries = (): OilPaintingsEntry[] => {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs
    .readdirSync(contentDir)
    .filter((file) => oilPaintingsPattern.test(file));

  const entries = files
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      const [, yearMatch] = oilPaintingsPattern.exec(file) ?? [];
      const frontmatterYear = typeof data.year === "number" ? data.year : Number(data.year);
      const year = Number.isFinite(frontmatterYear)
        ? frontmatterYear
        : yearMatch
        ? Number(yearMatch)
        : null;

      if (!year) {
        return null;
      }

      const entry: OilPaintingsEntry = {
        year,
        filePath,
        artist: typeof data.artist === "string" ? data.artist : undefined,
      };

      return entry;
    })
    .filter((entry): entry is OilPaintingsEntry => entry !== null);

  entries.sort((a, b) => b.year - a.year);
  return entries;
};

type Props = {
  searchParams?: {
    year?: string;
  };
};

export default function OilPaintingsPage({ searchParams }: Props) {
  const entries = loadEntries();

  if (!entries.length) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold">Oil Paintings</h1>
        <p className="mt-4 text-gray-500">Entries will appear here once they are published.</p>
      </main>
    );
  }

  const years = entries.map((entry) => entry.year);
  const latestYear = Math.max(...years);
  const earliestYear = Math.min(...years);
  const requestedYear = Number(searchParams?.year);
  const selectedIndex = Number.isFinite(requestedYear)
    ? entries.findIndex((entry) => entry.year === requestedYear)
    : 0;
  const activeIndex = selectedIndex === -1 ? 0 : selectedIndex;
  const selectedEntry = entries[activeIndex];

  const prevYear = activeIndex > 0 ? entries[activeIndex - 1].year : null;
  const nextYear = activeIndex < entries.length - 1 ? entries[activeIndex + 1].year : null;

  const rawSelected = fs.readFileSync(selectedEntry.filePath, "utf8");
  const { content: selectedContent } = matter(rawSelected);

  return (
    <>
      <div className="mx-auto max-w-2xl px-8 pt-12 pb-6">
        <h1
          className="mb-1 font-light tracking-wide"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}
        >
          Oil Paintings
        </h1>
        <p className="text-sm" style={{ color: "var(--warm-text)" }}>
          {latestYear === earliestYear ? latestYear : `${earliestYear}–${latestYear}`}
        </p>
      </div>

      <OilPaintingsYearList years={years} activeYear={selectedEntry.year} />

      <main className="mx-auto max-w-2xl px-8 py-8">
        <section aria-labelledby={`heading-${selectedEntry.year}`}>
          <MDXRemote source={selectedContent} />
        </section>
      </main>

      <OilPaintingsPrevNext prevYear={prevYear} nextYear={nextYear} />
    </>
  );
}
