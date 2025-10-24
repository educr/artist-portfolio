import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

type WorkItem = {
  slug?: string;
  href?: string;
  title: string;
  year?: number | null;
  artist?: string;
  displayYear?: string;
};

export default function Home() {
  const contentDir = path.join(process.cwd(), "content");
  const files = fs
    .readdirSync(contentDir)
    .filter(
      (file) =>
        file.endsWith(".mdx") &&
        file !== "cv.mdx" &&
        file !== "parabiosis-credits.mdx" &&
        file !== "de-profundis-video.mdx" &&
        file !== "addendum.mdx"
    );

  const rawWorks: WorkItem[] = files
    .map((file) => {
      const fullPath = path.join(contentDir, file);
      const src = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(src);
      // infer year: prefer frontmatter, else filename, else content, else file mtime
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
        } catch (e) {
          year = null;
        }
      }

      return {
        slug: file.replace(".mdx", ""),
        title: data.title || file.replace(".mdx", ""),
        year,
        artist: data.artist || "Eduardo Andrés Crespo",
      } satisfies WorkItem;
    });

  const paintingsPattern = /^paintings-\d{4}$/;
  const paintingEntries = rawWorks.filter(
    (work) => work.slug && paintingsPattern.test(work.slug)
  );
  const nonPaintingEntries = rawWorks.filter(
    (work) => !work.slug || !paintingsPattern.test(work.slug)
  );

  let combinedPaintings: WorkItem | null = null;
  if (paintingEntries.length > 0) {
    const years = paintingEntries
      .map((entry) => entry.year)
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
    if (years.length > 0) {
      const latestYear = Math.max(...years);
      const earliestYear = Math.min(...years);
      combinedPaintings = {
        slug: "paintings",
        title: "Paintings",
        year: latestYear,
        displayYear:
          latestYear === earliestYear
            ? `${latestYear}`
            : `${latestYear}–${earliestYear}`,
        artist: paintingEntries[0]?.artist ?? "Eduardo Andrés Crespo",
      };
    }
  }

  const works: WorkItem[] = combinedPaintings
    ? [...nonPaintingEntries, combinedPaintings]
    : nonPaintingEntries;

  // sort by year desc, fallback to title
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
    },
  ];
  const compareWorks = (a: WorkItem, b: WorkItem) => {
    const ya = a.year ?? 0;
    const yb = b.year ?? 0;
    if (yb !== ya) return yb - ya;
    return a.title.localeCompare(b.title);
  };

  const primaryWorks = works.filter(
    (work) => !work.artist || work.artist === primaryArtist
  );
  const otherWorks = works.filter(
    (work) => work.artist && work.artist !== primaryArtist
  );

  const primaryList = [...primaryWorks, ...externalWorks.filter((work) => work.artist === primaryArtist || !work.artist)].sort(compareWorks);
  const otherList = [...otherWorks, ...externalWorks.filter((work) => work.artist && work.artist !== primaryArtist)].sort(compareWorks);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">Eduardo Andrés Crespo</h1>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Works</h2>
        <ul className="space-y-4">
          {primaryList.map((item) => (
            <li key={item.slug ?? item.href} className="flex items-baseline gap-3">
              {item.slug ? (
                <Link href={`/${item.slug}`} className="text-lg text-blue-600 hover:underline">
                  {item.title}
                </Link>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
              )}
              {item.displayYear ? (
                <span className="text-sm text-gray-500">{item.displayYear}</span>
              ) : item.year ? (
                <span className="text-sm text-gray-500">{item.year}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {otherList.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Works created as Andrea Crespo</h2>
          <ul className="space-y-4">
            {otherList.map((item) => (
              <li key={item.slug ?? item.href} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <div>
                  {item.slug ? (
                    <Link href={`/${item.slug}`} className="text-lg text-blue-600 hover:underline">
                      {item.title}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-blue-600 hover:underline"
                    >
                      {item.title}
                    </a>
                  )}
                </div>
                {item.displayYear ? (
                  <span className="text-sm text-gray-500">{item.displayYear}</span>
                ) : item.year ? (
                  <span className="text-sm text-gray-500">{item.year}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
