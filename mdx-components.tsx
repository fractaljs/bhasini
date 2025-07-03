import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { highlight } from "sugar-high";

// Function to generate a slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

const components = {
  h1: ({ children, ...props }: HeadingProps) => {
    const text = typeof children === "string" ? children : "";
    const id = generateSlug(text);
    return (
      <h1 id={id} className="text-2xl pt-12 mb-0 font-bold" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }: HeadingProps) => {
    const text = typeof children === "string" ? children : "";
    const id = generateSlug(text);
    return (
      <h2
        id={id}
        className="text-gray-800 dark:text-zinc-200 font-medium mt-8 mb-3"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: HeadingProps) => {
    const text = typeof children === "string" ? children : "";
    const id = generateSlug(text);
    return (
      <h3
        id={id}
        className="text-gray-800 dark:text-zinc-200 font-medium mt-8 mb-3"
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: (props: HeadingProps) => <h4 className="font-medium" {...props} />,
  p: (props: ParagraphProps) => (
    <p className="text-gray-800 dark:text-zinc-300 leading-snug" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol
      className="text-gray-800 dark:text-zinc-300 list-decimal pl-5 space-y-2"
      {...props}
    />
  ),
  ul: (props: ListProps) => (
    <ul
      className="text-gray-800 dark:text-zinc-300 list-disc pl-5 space-y-1"
      {...props}
    />
  ),
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      "text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 dark:underline dark:underline-offset-2 dark:decoration-gray-800";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <table
      className="w-full table-auto border-collapse border border-gray-300 dark:border-zinc-600 my-6"
      {...props}
    />
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-gray-50 dark:bg-zinc-800" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody
      className="divide-y divide-gray-200 dark:divide-zinc-700"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-700 last:border-b-0"
      {...props}
    />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-300 dark:border-zinc-600 whitespace-nowrap bg-gray-50 dark:bg-zinc-800"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="px-4 py-3 text-sm text-gray-800 dark:text-zinc-300 break-words align-top"
      {...props}
    />
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300"
      {...props}
    />
  ),
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
