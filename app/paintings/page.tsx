import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import YearTabs from "./YearTabs";

type PaintingEntry = {
  year: number;
  content: string;
  artist?: string;
};

const paintingsPattern = /^paintings-(\d{4})\.mdx$/;

const loadPaintings = (): PaintingEntry[] => {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs
    .readdirSync(contentDir)
    .filter((file) => paintingsPattern.test(file));

  const entries = files
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { content, data } = matter(raw);
      const [, yearMatch] = paintingsPattern.exec(file) ?? [];
      const frontmatterYear = typeof data.year === "number" ? data.year : Number(data.year);
      const year = Number.isFinite(frontmatterYear)
        ? frontmatterYear
        : yearMatch
        ? Number(yearMatch)
        : null;

      if (!year) {
        return null;
      }

      return {
        year,
        content,
        artist: typeof data.artist === "string" ? data.artist : undefined,
      } satisfies PaintingEntry;
    })
    .filter((entry): entry is PaintingEntry => Boolean(entry));

  entries.sort((a, b) => b.year - a.year);
  return entries;
};

export default function PaintingsPage() {
  const entries = loadPaintings();

  if (!entries.length) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold">Paintings</h1>
        <p className="mt-4 text-gray-500">Paintings will appear here once they are published.</p>
      </main>
    );
  }

  const sections = entries.map((entry) => ({
    id: `year-${entry.year}`,
    label: entry.year.toString(),
  }));

  const years = entries.map((entry) => entry.year);
  const latestYear = Math.max(...years);
  const earliestYear = Math.min(...years);
  const artist = entries.find((entry) => entry.artist)?.artist ?? "Eduardo Andrés Crespo";

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="space-y-1 pb-4">
        <h1 className="text-3xl font-bold">Paintings</h1>
        <div className="text-sm text-gray-500">{artist}</div>
        <div className="text-sm text-gray-500">
          {latestYear === earliestYear ? latestYear : `${latestYear}–${earliestYear}`}
        </div>
      </header>

      <YearTabs sections={sections} />

      <div className="space-y-20 py-8">
        {entries.map((entry) => (
          <section
            id={`year-${entry.year}`}
            key={entry.year}
            className="scroll-mt-28"
            aria-labelledby={`heading-${entry.year}`}
          >
            <h2 id={`heading-${entry.year}`} className="mb-4 text-2xl font-semibold">
              {entry.year}
            </h2>
            <MDXRemote source={entry.content} />
          </section>
        ))}
      </div>
    </main>
  );
}
