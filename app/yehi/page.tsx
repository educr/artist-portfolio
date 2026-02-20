import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import YearTabs from "./YearTabs";

type YehiEntry = {
  year: number;
  filePath: string;
  artist?: string;
};

const yehiPattern = /^yehi-(\d{4})\.mdx$/;

const loadEntries = (): YehiEntry[] => {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs
    .readdirSync(contentDir)
    .filter((file) => yehiPattern.test(file));

  const entries = files
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      const [, yearMatch] = yehiPattern.exec(file) ?? [];
      const frontmatterYear = typeof data.year === "number" ? data.year : Number(data.year);
      const year = Number.isFinite(frontmatterYear)
        ? frontmatterYear
        : yearMatch
        ? Number(yearMatch)
        : null;

      if (!year) {
        return null;
      }

      const entry: YehiEntry = {
        year,
        filePath,
        artist: typeof data.artist === "string" ? data.artist : undefined,
      };

      return entry;
    })
    .filter((entry): entry is YehiEntry => entry !== null);

  entries.sort((a, b) => b.year - a.year);
  return entries;
};

type Props = {
  searchParams?: Promise<{
    year?: string;
  }>;
};

export default async function YehiPage({ searchParams }: Props) {
  const entries = loadEntries();

  if (!entries.length) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold">Yehi</h1>
        <p className="mt-4 text-gray-500">Entries will appear here once they are published.</p>
      </main>
    );
  }

  const sections = entries.map((entry) => ({
    year: entry.year,
    label: entry.year.toString(),
  }));

  const years = entries.map((entry) => entry.year);
  const latestYear = Math.max(...years);
  const earliestYear = Math.min(...years);
  const artist = entries.find((entry) => entry.artist)?.artist ?? "Eduardo Andrés Crespo";
  const params = searchParams ? await searchParams : undefined;
  const requestedYear = Number(params?.year);
  const selectedEntry = Number.isFinite(requestedYear)
    ? entries.find((entry) => entry.year === requestedYear) ?? entries[0]
    : entries[0];
  const rawSelected = fs.readFileSync(selectedEntry.filePath, "utf8");
  const { content: selectedContent } = matter(rawSelected);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="space-y-1 pb-4">
        <h1 className="text-3xl font-bold">Yehi</h1>
        <div className="text-sm text-gray-500">{artist}</div>
        <div className="text-sm text-gray-500">
          {latestYear === earliestYear ? latestYear : `${latestYear}–${earliestYear}`}
        </div>
      </header>

      <YearTabs sections={sections} activeYear={selectedEntry.year} />

      <section className="py-8" aria-labelledby={`heading-${selectedEntry.year}`}>
        <h2 id={`heading-${selectedEntry.year}`} className="mb-4 text-2xl font-semibold">
          {selectedEntry.year}
        </h2>
        <MDXRemote source={selectedContent} />
      </section>
    </main>
  );
}
