import fs from "fs";
import path from "path";

export interface DocItem {
  slug: string;
  name: string;
  path: string;
  children?: DocItem[];
  showInSidebar?: boolean;
}

const scanDirectory = (dirPath: string, basePath: string = ""): DocItem[] => {
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
};

export default scanDirectory;
