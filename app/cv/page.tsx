import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

export const metadata = {
  title: "Eduardo Andrés Crespo — CV",
  description: "Curriculum vitae for Eduardo Andrés Crespo",
};

export default async function CVPage() {
  const filePath = path.join(process.cwd(), "content", "cv.mdx");
  const source = fs.readFileSync(filePath, "utf8");
  const { content } = matter(source);

  return (
    <article className="prose mx-auto max-w-3xl p-8">
      <MDXRemote source={content} />
    </article>
  );
}
