/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  articleCard,
  articleUrl,
  getArticleBySlug,
  getArticles,
  guideCta,
  listAcquisitionCta,
  markdownToNodes,
  shouldShowListCta,
} from "../../site";

type Params = {
  params: Promise<{ slug: string }>;
};

const baseUrl = "https://nouiki-lab.com";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const canonical = articleUrl(article);
  return {
    title: article.title,
    description: article.meta_description,
    keywords: [article.target_keyword],
    alternates: {
      canonical,
    },
    openGraph: {
      title: article.title,
      description: article.meta_description,
      type: "article",
      url: canonical,
      siteName: "脳イキ研究ノート",
      images: ["/images/hero-desk.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description,
      images: ["/images/hero-desk.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const articles = getArticles();
  const idToUrl = Object.fromEntries(articles.map((item) => [item.f_id, articleUrl(item)]));
  const related = article.internal_links.map((id) => articles.find((item) => item.f_id === id)).filter(Boolean);
  const body = article.body.replace(/^# .*\n+/, "").trim();
  const canonicalPath = articleUrl(article);
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: article.title,
        description: article.meta_description,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        dateModified: article.last_updated,
        inLanguage: "ja",
        author: {
          "@type": "Person",
          name: "汐",
          url: `${baseUrl}/about`,
          description: "体験談と研究資料を分けて調査・編集する編集者。脳イキ経験者ではないことを開示しています。",
        },
        isPartOf: {
          "@type": "WebSite",
          name: "脳イキ研究ノート",
          url: baseUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: article.title,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="article-shell">
      <nav className="breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a>
        <span>/</span>
        <span>{article.title}</span>
      </nav>

      <article className="article">
        <p className="kicker">{article.group}</p>
        <h1>{article.title}</h1>
        <p className="article-meta">編集・調査: 汐 / 最終更新: {article.last_updated}</p>
        <aside className="article-research-note" aria-label="この記事の調査方針">
          <strong>この記事の調査方針</strong>
          <p>
            体験談と研究資料を分け、研究で確認されていること・推測できること・体験談として語られていること・まだ分からないことを混同しないよう編集しています。
          </p>
          <p>
            <a href="/about">編集者とサイト方針</a> ／ <a href="/evidence">参考にした研究と、そこから言えること・言えないこと</a>
          </p>
        </aside>
        {markdownToNodes(body, idToUrl)}

        <aside className="article-note">
          <strong>読んでいて怖くなった時は、そこで止めてください。</strong>
          <p>不快感、眠れなさ、動悸、日常生活への影響がある場合は、コツ探しより休むことを優先してください。</p>
        </aside>
      </article>

      {shouldShowListCta(article) ? listAcquisitionCta("article") : null}

      {related.length ? (
        <section className="section related-section">
          <div className="section-head">
            <p className="kicker">近い悩み</p>
            <h2>次に読むなら、このあたりです。</h2>
            <p>今の状態に近い記事だけ拾って読めます。全部読む必要はありません。</p>
          </div>
          <div className="article-grid">{related.map((item) => articleCard(item))}</div>
        </section>
      ) : null}

      {guideCta()}

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
