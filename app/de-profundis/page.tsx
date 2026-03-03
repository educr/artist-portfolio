import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import VideoGrid from "./VideoGrid";

export const metadata = {
  title: "De Profundis — Eduardo Andrés Crespo",
};

const videos = [
  { id: "jy-HVM0rz0s", title: "Timor" },
  { id: "to3zRCdGQaM", title: "Visitator" },
  { id: "ANau3q40Aww", title: "Recognitio" },
  { id: "1RFriIpS8Bo", title: "Pestis" },
  { id: "25Qq75Waa4c", title: "Sicut fluit cera a facie ignis" },
  { id: "aMM3hCtF04Q", title: "Occursus" },
  { id: "l3VK4h0qCaE", title: "Irae" },
  { id: "zZYVNzmMj6k", title: "Horae" },
  { id: "fyO6NwBsmyM", title: "Incantatio" },
  { id: "pZh5ZzxOUBI", title: "Divinatio" },
  { id: "8Z2C2Jljcug", title: "Divinatio II" },
  { id: "ZN1u80gfRuU", title: "Timoris" },
  { id: "3SCdx_D_h-w", title: "Luxuria" },
  { id: "zWsd-4hZ9II", title: "Anima mea sicut passer erepta est de laqueo venantium" },
  { id: "6ICxbtTInM8", title: "Terror noctis" },
  { id: "XLnZmUwJUDQ", title: "Ecclesia Militans" },
  { id: "5mNb37Zh60I", title: "Et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris" },
  { id: "9BdjVIAx13c", title: "Amicis et hostibus" },
  { id: "IQrpye9dWKU", title: "Silentium" },
  { id: "a9ICpKDF8sY", title: "Artificium" },
  { id: "Ye69IHClr6I", title: "Ecclesia Militans II" },
  { id: "Wvz180eCGoI", title: "Latus dolor" },
  { id: "_mpjdvKj_Cc", title: "Proclivitas" },
];

export default async function DeProfundisPage() {
  const filePath = path.join(process.cwd(), "content", "de-profundis.mdx");
  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  // Strip the Watch Videos link — videos are shown inline below
  const cleanedContent = content.replace(/###\s*\[Watch Videos\]\([^)]*\)\n?/g, "");

  return (
    <article className="prose mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <div className="mb-4 space-y-1 text-sm text-gray-500">
        {data.artist ? <div>{data.artist}</div> : null}
        {data.year ? <div>{data.year}</div> : null}
      </div>

      <MDXRemote source={cleanedContent} />

      {/* Video grid */}
      <div className="not-prose mt-10">
        <p
          className="mb-6 pb-3 text-[10px] uppercase tracking-[0.25em] font-light border-b"
          style={{ color: "var(--warm-label)", borderColor: "var(--warm-border)" }}
        >
          Videos
        </p>
        <VideoGrid videos={videos} />
      </div>
    </article>
  );
}
