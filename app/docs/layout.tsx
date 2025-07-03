import Sidebar from "@/components/Sidebar";
import path from "path";
import React from "react";
import scanDirectory from "./utils/scanDirectory";
import Link from "next/link";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-screen h-screen relative">
      <div className="fixed top-0 left-0 right-0 h-[var(--default-navbar-height)] z-10 border-b border-gray-700/40 bg-background/30 backdrop-blur-sm flex items-center justify-center px-6">
        <nav className="max-w-8xl mx-auto w-full">
          <Link
            href="/"
            className="inline-flex text-lg font-bold items-center justify-center whitespace-nowrap transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3"
          >
            Blend Docs
          </Link>
        </nav>
      </div>
      <div className="w-screen flex h-screen">
        <div className="max-w-8xl mx-auto w-full flex">
          <aside
            className="min-w-[16rem] debug h-screen px-4"
            style={{ paddingTop: "calc(var(--default-navbar-height) + 1rem)" }}
          >
            <Sidebar
              items={scanDirectory(
                path.join(process.cwd(), "app", "docs", "content")
              )}
            />
          </aside>
          <div className="grow p-4 h-screen overflow-y-auto pt-[var(--default-navbar-height)]">
            <div className=" mx-auto pt-6 max-w-7xl">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default layout;
