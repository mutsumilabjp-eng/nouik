import Link from "next/link";
import type { ReactNode } from "react";
import { rawArticles } from "./content-data";

export type Article = {
  f_id: string;
  title: string;
  meta_description: string;
  target_keyword: string;
  category: string;
  tier: string;
  internal_links: string[];
  version: string;
  last_updated: string;
  body: string;
  file: string;
  slug: string;
  group: string;
};

export const categoryOrder = ["はじめに", "できない理由", "6つのTYPE", "安全性"] as const;

const categoryMap: Record<string, string> = {
  F01: "はじめに",
  F02: "はじめに",
  F04: "はじめに",
  F13: "できない理由",
  F05: "できない理由",
  F06: "できない理由",
  F07: "できない理由",
  F08: "できない理由",
  F11: "できない理由",
  F12: "できない理由",
  F10: "6つのTYPE",
  F09: "安全性",
};

function parseFrontMatter(raw: string, file: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing front matter: ${file}`);
  const meta: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    const rawValue = rest.join(":").trim();
    if (!key || rawValue === "") continue;
    meta[key.trim()] = rawValue.startsWith("[") ? JSON.parse(rawValue) : rawValue.replace(/^"|"$/g, "");
  }
  return { meta, body: match[2].trim() };
}

function slugFor(file: string) {
  const id = file.slice(0, 3).toLowerCase().replace("f", "f-");
  return `${id}-${file.replace(/^F\d+_/, "").replace(/\.md$/, "").replaceAll("_", "-")}`;
}

export function getArticles(): Article[] {
  return rawArticles
    .map(([file, raw]) => {
      const { meta, body } = parseFrontMatter(raw, file);
      const article = meta as unknown as Omit<Article, "body" | "file" | "slug" | "group">;
      return {
        ...article,
        body,
        file,
        slug: slugFor(file),
        group: categoryMap[article.f_id] || "はじめに",
      };
    })
    .filter((article) => article.f_id !== "F03" && article.f_id !== "F14")
    .sort((a, b) => a.f_id.localeCompare(b.f_id, "en"));
}

export function getArticleById(id: string) {
  const article = getArticles().find((item) => item.f_id === id);
  if (!article) throw new Error(`Article not found: ${id}`);
  return article;
}

export function getArticleBySlug(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}

export function getArticlesByGroup() {
  const articles = getArticles();
  return Object.fromEntries(categoryOrder.map((group) => [group, articles.filter((article) => article.group === group)])) as Record<
    (typeof categoryOrder)[number],
    Article[]
  >;
}

export function articleUrl(article: Article) {
  return `/articles/${article.slug}/`;
}

export function articleCard(article: Article): ReactNode {
  return (
    <Link className="article-card" href={articleUrl(article)} key={article.f_id}>
      <span>{article.target_keyword}</span>
      <h3>{article.title}</h3>
      <p>{article.meta_description}</p>
    </Link>
  );
}

export function guideCta() {
  return (
    <section className="guide-cta" aria-labelledby="guide-title">
      <div>
        <p className="kicker">次の段階へ</p>
        <h2 id="guide-title">理由が見えたら、次は条件を整理する</h2>
        <p>無料記事では「なぜ起きるのか」までを扱います。自分の状態を記録し、条件を比較しながら読み解く手順は、完全ガイド側で扱います。</p>
      </div>
      <Link className="button" href="/guide/">
        完全ガイドを見る
      </Link>
    </section>
  );
}

function inlineNodes(text: string, idToUrl: Record<string, string>): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\[([^\]]+)\]\((F\d+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <Link href={idToUrl[match[2]] || "#"} key={`${match[2]}-${match.index}`}>
        {match[1]}
      </Link>,
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function markdownToNodes(markdown: string, idToUrl: Record<string, string>) {
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (!listItems.length) return;
    const items = listItems;
    listItems = [];
    blocks.push(
      <ul key={`ul-${blocks.length}`}>
        {items.map((item, index) => (
          <li key={index}>{inlineNodes(item, idToUrl)}</li>
        ))}
      </ul>,
    );
  }

  for (const line of markdown.split("\n")) {
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(<h2 key={`h2-${blocks.length}`}>{inlineNodes(line.slice(3), idToUrl)}</h2>);
    } else if (line.startsWith("### ")) {
      flushList();
      blocks.push(<h3 key={`h3-${blocks.length}`}>{inlineNodes(line.slice(4), idToUrl)}</h3>);
    } else if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(<p key={`p-${blocks.length}`}>{inlineNodes(line, idToUrl)}</p>);
    }
  }
  flushList();
  return blocks;
}
