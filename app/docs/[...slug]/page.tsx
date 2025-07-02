import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slugArray = params.slug || [];
  const basePath = path.join(process.cwd(), "app", "docs", "content");

  let filePath = path.join(basePath, Array.isArray(slugArray) ? slugArray.join("/") : slugArray) + ".mdx";
  console.log("searching for", filePath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(basePath, ...slugArray, "page.mdx");
    if (!fs.existsSync(filePath)) {
      // notFound();
      return <div>not found</div>;
    }
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = await compileMDX({
    source: fileContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
    components: useMDXComponents(),
  });

  return <article className="prose prose-lg max-w-none p-8">{content}</article>;
}
