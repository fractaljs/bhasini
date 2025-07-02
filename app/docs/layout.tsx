import Sidebar from "@/components/Sidebar";
import fs from "fs";
import Link from "next/link";
import path from "path";
import React from "react";

export interface DocItem {
  slug: string;
  name: string;
  path: string;
  children?: DocItem[];
  showInSidebar?: boolean;
}

function scanDirectory(dirPath: string, basePath: string = ""): DocItem[] {
  const items: DocItem[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const children = scanDirectory(fullPath, relativePath);
        items.push({
          slug: entry.name,
          name: entry.name,
          path: relativePath,
          children,
        });
      } else if (entry.name.endsWith(".mdx") && entry.name !== "page.mdx") {
        // Skip page.mdx files as they're handled by the catch-all route
        const slug = entry.name.replace(/\.mdx$/, "");
        items.push({
          slug,
          name: slug,
          path: relativePath.replace(/\.mdx$/, ""),
        });
      }
    }
  } catch (error) {
    console.error("Error scanning directory:", error);
  }

  return items.sort((a, b) => {
    // Directories first, then files
    const aIsDir = a.children !== undefined;
    const bIsDir = b.children !== undefined;
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.name.localeCompare(b.name);
  });
}


const layout = ({ children }: { children: React.ReactNode }) => {
  console.log(scanDirectory(path.join(process.cwd(), "app", "docs", "content")))
  return (
    <main className="w-screen h-screen relative">
      <div className="fixed top-0 left-0 right-0 h-[var(--default-navbar-height)] z-10 border-b border-gray-700/40 bg-background/30 backdrop-blur-sm">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro
        obcaecati, pariatur ut quam commodi amet veniam explicabo dignissimos,
        laudantium, numquam iste veritatis unde aliquam delectus molestiae sint
        quaerat deserunt nesciunt!
      </div>
      <div className="w-screen flex h-screen debug">
        <aside
          className="min-w-[270px] h-screen  px-4 border-r border-gray-700/40 debug"
          style={{ paddingTop: "calc(var(--default-navbar-height) + 1rem)" }}
        >
          <Sidebar items={scanDirectory(path.join(process.cwd(), "app", "docs", "content"))} />
        </aside>
        <div className="grow p-4 h-screen overflow-y-auto pt-[var(--default-navbar-height)]">
          <article className="max-w-3xl mx-auto pt-6">{children}</article>
        </div>
      </div>
    </main>
  );
};

export default layout;
