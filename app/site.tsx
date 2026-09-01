/* eslint-disable @next/next/no-html-link-for-pages */
import type { ReactNode } from "react";
import { rawArticles } from "./content-data";
import SubscriptionForm from "./subscription-form";

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
export const premiumGuideUrl = "https://deeps.me/u/sei/a/nouiki";

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

const listCtaArticleIds = new Set(["F05", "F06", "F08", "F10", "F11", "F12", "F13"]);

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
    <a className="article-card" href={articleUrl(article)} key={article.f_id}>
      <span>{cardLabels[article.f_id] ?? article.group}</span>
      <h3>{article.title}</h3>
      <p>{article.meta_description}</p>
    </a>
  );
}

export function shouldShowListCta(article: Article) {
  return listCtaArticleIds.has(article.f_id);
}

export function listAcquisitionCta(source: "top" | "article" = "top") {
  const freeMemoCta = source === "top" ? "top-free-memo" : "article-free-memo";
  return (
    <section className={`list-cta list-cta-${source}`} aria-labelledby={`list-cta-title-${source}`}>
      <div className="list-cta-primary">
        <p className="kicker">昨日の状態を1分で分けるメモ</p>
        <h2 id={`list-cta-title-${source}`}>まだ「自分がどこで止まっているか」が分からない人へ</h2>
        <p>できた人の方法を、もうひとつ増やす前に。</p>
        <p>まず、昨日の自分がどこで止まっていたのかを1分で分けてみてください。</p>
        <ul>
          <li>何も感じなかったのか。</li>
          <li>少し来たけれど消えたのか。</li>
          <li>怖くなって止めたのか。</li>
          <li>確認する頭が勝ったのか。</li>
          <li>前にあった感覚を探しているのか。</li>
          <li>そもそも何を目印にすればいいか分からないのか。</li>
        </ul>
        <p>
          最初に届くのは、「昨日の状態を1分で分けるメモ」です。成功談を増やすためではなく、次に見る場所を減らすための短いメモです。
        </p>
        <SubscriptionForm
          cta={freeMemoCta}
          description="無料記事の読み進め方、状態別メモ、次に見る記事の案内を受け取れます。"
          heading="コンテンツ誘導メールマガジン"
          kind="content"
          submitLabel="無料メモを受け取る"
        />
      </div>

      <div className="list-cta-secondary">
        <p className="kicker">すでに自分の止まり方が見えている人へ</p>
        <h3>「自分はたぶんここで止まっている」</h3>
        <p>
          そこまでは整理できていて、次に何を見るか、何を1つだけ変えるか、どう記録して比較するかまで進みたい場合は、詳細ガイドがあります。
        </p>
        <SubscriptionForm
          cta="paid-updates"
          description="有料コンテンツの追加、改訂、販売ページ更新があった時だけ通知します。"
          heading="有料コンテンツ更新通知"
          kind="paid"
          submitLabel="更新通知を受け取る"
        />
        <a className="secondary-link" href="/premium-guide" data-cta="premium-guide">
          詳細ガイドを見る
        </a>
        <p className="microcopy">約38,000文字 / 5,980円 / 18歳以上向け</p>
        <p className="microcopy">特定の体験や結果を保証するものではありません。</p>
      </div>
    </section>
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
      <a className="button" href="/guide">
        メモの残し方を見る
      </a>
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
      <a href={idToUrl[match[2]] || "#"} key={`${match[2]}-${match.index}`}>
        {match[1]}
      </a>,
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
