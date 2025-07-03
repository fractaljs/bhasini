import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";
import { Metadata } from "next";
import { extractHeadings } from "@/utils/toc";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";

// Define the metadata interface
interface PageMetadata {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  author?: string;
  date?: string;
  image?: string;
  keywords?: string;
  [key: string]: any;
}

// Function to get file content and metadata
async function getFileContent(slugArray: string[]) {
  const basePath = path.join(process.cwd(), "app", "docs", "content");

  let filePath =
    path.join(
      basePath,
      Array.isArray(slugArray) ? slugArray.join("/") : slugArray
    ) + ".mdx";
  if (!fs.existsSync(filePath)) {
    filePath = path.join(basePath, ...slugArray, "page.mdx");
    if (!fs.existsSync(filePath)) {
      return null;
    }
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { frontmatter } = await compileMDX({
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

  return frontmatter as PageMetadata;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const frontmatter = await getFileContent(resolvedParams.slug || []);

  if (!frontmatter) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const metadata: PageMetadata = {
    title: frontmatter.title || "Untitled",
    description: frontmatter.description || "",
    category: frontmatter.category || "",
    tags: frontmatter.tags || [],
    ...frontmatter,
  };

  const metadataObject: Metadata = {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "article",
      tags: metadata.tags,
      ...(metadata.image && { images: [{ url: metadata.image }] }),
      ...(metadata.author && { authors: [{ name: metadata.author }] }),
      ...(metadata.date && { publishedTime: metadata.date }),
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      ...(metadata.image && { images: [metadata.image] }),
    },
  };

  // Add optional properties only if they exist
  if (metadata.keywords) {
    metadataObject.keywords = metadata.keywords;
  } else if (metadata.tags && metadata.tags.length > 0) {
    metadataObject.keywords = metadata.tags.join(", ");
  }

  if (metadata.category) {
    metadataObject.other = {
      category: metadata.category,
    };

    if (metadata.tags && metadata.tags.length > 0) {
      metadataObject.other.tags = metadata.tags.join(", ");
    }
  }

  return metadataObject;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
  const basePath = path.join(process.cwd(), "app", "docs", "content");

  let filePath =
    path.join(
      basePath,
      Array.isArray(slugArray) ? slugArray.join("/") : slugArray
    ) + ".mdx";
  if (!fs.existsSync(filePath)) {
    filePath = path.join(basePath, ...slugArray, "page.mdx");
    if (!fs.existsSync(filePath)) {
      // notFound();
      return <div>not found</div>;
    }
  }

  const fileContent = fs.readFileSync(filePath, "utf8");

  // Extract headings for TOC
  const headings = extractHeadings(fileContent);

  const { content, frontmatter } = await compileMDX({
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

  // Extract metadata from frontmatter
  const metadata: PageMetadata = {
    title: (frontmatter as PageMetadata)?.title || "Untitled",
    description: (frontmatter as PageMetadata)?.description || "",
    category: (frontmatter as PageMetadata)?.category || "",
    tags: (frontmatter as PageMetadata)?.tags || [],
    ...(frontmatter as PageMetadata), // Include any other frontmatter properties
  };

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <div className="flex-1">
        {/* Display metadata */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{metadata.title}</h1>
          {metadata.description && (
            <p className="text-gray-600 mb-4">{metadata.description}</p>
          )}
          {metadata.category && (
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
              {metadata.category}
            </span>
          )}
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="mt-2">
              {metadata.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mr-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Render MDX content */}
        <article className="prose prose-lg max-w-none">{content}</article>
      </div>

      {/* Table of Contents */}
      {headings.length > 0 && (
        <>
          {/* Desktop TOC */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents items={headings} />
            </div>
          </aside>

          {/* Mobile TOC */}
          <aside className="lg:hidden w-full mb-6">
            <details className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-gray-900 dark:text-gray-100 mb-2">
                Table of Contents
              </summary>
              <TableOfContents items={headings} isMobile={true} />
            </details>
          </aside>
        </>
      )}
    </div>
  );
}
