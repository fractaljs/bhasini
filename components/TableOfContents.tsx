"use client";

import React, { useEffect, useState } from "react";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  isMobile?: boolean;
}

export default function TableOfContents({
  items,
  isMobile = false,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    // Observe all heading elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="w-64">
      {!isMobile && (
        <div className="toc-header">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            On this page
          </p>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`toc-link text-left w-full px-2 py-1 rounded text-sm transition-colors ${
                activeId === item.id
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
              style={{
                paddingLeft: `${(item.level - 1) * 12 + 8}px`,
              }}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
