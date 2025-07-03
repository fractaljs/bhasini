import { TOCItem } from "@/components/TableOfContents";

// Function to generate a slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Function to extract headings from MDX content
export function extractHeadings(content: string): TOCItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // Number of # symbols
    const text = match[2].trim();
    const id = generateSlug(text);

    // Only include h1, h2, and h3 headings
    if (level >= 1 && level <= 3) {
      headings.push({
        id,
        text,
        level,
      });
    }
  }

  return headings;
}
