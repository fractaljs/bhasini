"use client";
import { DocItem } from "@/app/docs/layout";
import Link from "next/link";
import React from "react";

const SidebarItem = ({ item, level = 0 }: { item: DocItem; level?: number }) => {
  const paddingLeft = level * 16; // 16px indent per level

  if (item.children) {
    // This is a directory
    return (
      <div key={item.slug}>
        <div 
          className="font-medium text-gray-300 py-1"
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {item.name}
        </div>
        {item.children.map((child) => (
          <SidebarItem key={child.slug} item={child} level={level + 1} />
        ))}
      </div>
    );
  } else {
    // This is a file
    return (
      <Link 
        key={item.slug} 
        href={`/docs/${item.path}`}
        className="block py-1 text-gray-400 hover:text-white transition-colors"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {item.name}
      </Link>
    );
  }
};

const Sidebar = ({ items }: { items: DocItem[] }) => {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <SidebarItem key={item.slug} item={item} />
      ))}
    </div>
  );
};

export default Sidebar;
