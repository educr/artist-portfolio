import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { redirect } from "next/navigation";

const oilPaintingsSlugPattern = /^oil-paintings-\d{4}$/;
const oilPaintingsFilePattern = /^oil-paintings-\d{4}\.mdx$/;
const legacyPaintingsSlugPattern = /^paintings-\d{4}$/;
const legacyPaintingsFilePattern = /^paintings-\d{4}\.mdx$/;

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "content"));
  return files
    .filter(
      (file) =>
        file.endsWith(".mdx") &&
        file !== "cv.mdx" &&
        file !== "de-profundis.mdx" &&
        file !== "de-profundis-video.mdx" &&
        file !== "addendum.mdx" &&
        !oilPaintingsFilePattern.test(file) &&
        !legacyPaintingsFilePattern.test(file)
    )
    .map((file) => ({
      slug: file.replace(".mdx", ""),
    }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (oilPaintingsSlugPattern.test(params.slug)) {
    redirect("/oil-paintings");
  }

  if (legacyPaintingsSlugPattern.test(params.slug)) {
    redirect("/oil-paintings");
  }

  const filePath = path.join(process.cwd(), "content", `${params.slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);

  return (
    <article className="prose mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <div className="mb-4 space-y-1 text-sm text-gray-500">
        {data.artist ? <div>{data.artist}</div> : null}
        {data.year ? <div>{data.year}</div> : null}
      </div>
      <MDXRemote source={content} />
    </article>
  );
}
