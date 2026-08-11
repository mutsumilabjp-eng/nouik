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

export const categoryOrder = ["はじめに", "うまくいかない時", "状態別", "安全性"] as const;

const categoryMap: Record<string, (typeof categoryOrder)[number]> = {
  F01: "はじめに",
  F02: "はじめに",
  F04: "はじめに",
  F13: "うまくいかない時",
  F05: "うまくいかない時",
  F06: "うまくいかない時",
  F07: "うまくいかない時",
  F08: "うまくいかない時",
  F11: "うまくいかない時",
  F12: "うまくいかない時",
  F10: "状態別",
  F09: "安全性",
};

const cardLabels: Record<string, string> = {
  F01: "言葉の意味が気になる",
  F02: "本当か疑っている",
  F04: "嘘っぽく見えている",
  F05: "何も感じない",
  F06: "途中で別のことを考える",
  F07: "怖くなって力が入る",
  F08: "いい所で止まる",
  F09: "不安が残っている",
  F10: "自分の止まり方を見たい",
  F11: "反応はあるのに快くない",
  F12: "一度だけで戻れない",
  F13: "どれに近いか迷っている",
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
  return rawArticles.map(([file, raw]) => {
    const { meta, body } = parseFrontMatter(raw, file);
    const f_id = String(meta.f_id);
    return {
      f_id,
      title: String(meta.title),
      meta_description: String(meta.meta_description),
      target_keyword: String(meta.target_keyword),
      category: String(meta.category),
      tier: String(meta.tier),
      internal_links: meta.internal_links as string[],
      version: String(meta.version),
      last_updated: String(meta.last_updated),
      body,
      file,
      slug: slugFor(file),
      group: categoryMap[f_id] ?? "はじめに",
    };
  });
}

export function getArticleById(id: string) {
  return getArticles().find((article) => article.f_id === id);
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
  return `/articles/${article.slug}`;
}

export function articleCard(article: Article): ReactNode {
  return (
    <Link className="article-card" href={articleUrl(article)} key={article.f_id}>
      <span>{cardLabels[article.f_id] ?? article.group}</span>
      <h3>{article.title}</h3>
      <p>{article.meta_description}</p>
    </Link>
  );
}

export function guideCta() {
  return (
    <section className="guide-cta" aria-labelledby="guide-title">
      <div>
        <p className="kicker">聞いたあとで残すこと</p>
        <h2 id="guide-title">「何もなかった」で終わらせないメモ</h2>
        <p>音量、姿勢、怖くなった瞬間、冷めた一言。覚えているうちに少しだけ残すと、次に読む記事を選びやすくなります。</p>
      </div>
      <Link className="button" href="/guide">
        メモの残し方を見る
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
