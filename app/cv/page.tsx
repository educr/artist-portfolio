import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata = {
  title: "Eduardo Andrés Crespo — CV",
  description: "Curriculum vitae for Eduardo Andrés Crespo",
};

type CVEntry = string | { text: string; href: string };

type YearGroup = {
  year: string;
  entries: CVEntry[];
};

type CVSection = {
  title: string;
  groups: YearGroup[];
};

const parseEntry = (line: string): CVEntry => {
  const match = line.match(/^\[(.+)\]\((.+)\)$/);
  if (match) {
    const text = match[1].replace(/\\\[/g, "[").replace(/\\\]/g, "]");
    return { text, href: match[2] };
  }
  return line;
};

const parseCVContent = (content: string): { bio: string[]; sections: CVSection[] } => {
  const lines = content.split("\n");
  const bio: string[] = [];
  const sections: CVSection[] = [];
  let currentSection: CVSection | null = null;
  let currentGroup: YearGroup | null = null;
  let inBio = true;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      inBio = false;
      currentSection = { title: trimmed.slice(2), groups: [] };
      sections.push(currentSection);
      currentGroup = null;
    } else if (trimmed.startsWith("## ")) {
      inBio = false;
      currentGroup = { year: trimmed.slice(3), entries: [] };
      if (currentSection) currentSection.groups.push(currentGroup);
    } else if (inBio) {
      bio.push(trimmed);
    } else if (currentGroup) {
      currentGroup.entries.push(parseEntry(trimmed));
    }
  }

  return { bio, sections };
};

const EntryRow = ({ entry }: { entry: CVEntry }) => {
  if (typeof entry === "string") {
    return (
      <div className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
        {entry}
      </div>
    );
  }
  return (
    <a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-sm leading-relaxed transition-opacity duration-200 hover:opacity-50"
      style={{ color: "var(--foreground)" }}
    >
      {entry.text}
    </a>
  );
};

export default function CVPage() {
  const filePath = path.join(process.cwd(), "content", "cv.mdx");
  const source = fs.readFileSync(filePath, "utf8");
  const { content } = matter(source);
  const { bio, sections } = parseCVContent(content);

  return (
    <main className="mx-auto max-w-2xl px-8 py-12">
      {/* Bio */}
      <div className="mb-14 space-y-1">
        {bio.map((line, i) => (
          <div key={i} className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {line}
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {sections.map((section) => (
          <section key={section.title}>
            {/* Section header */}
            <p
              className="mb-8 pb-3 text-[10px] uppercase tracking-[0.25em] font-light border-b"
              style={{ color: "var(--warm-label)", borderColor: "var(--warm-border)" }}
            >
              {section.title}
            </p>

            {/* Timeline */}
            <div className="space-y-7">
              {section.groups.map((group) => (
                <div key={group.year} className="flex items-start gap-6">
                  <div className="flex-shrink-0 text-right" style={{ width: 52 }}>
                    <span className="text-sm" style={{ color: "var(--warm-text)" }}>
                      {group.year}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    {group.entries.map((entry, i) => (
                      <EntryRow key={i} entry={entry} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
