import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleCard, articleUrl, getArticleBySlug, getArticles, guideCta, markdownToNodes } from "../../site";

type Params = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.meta_description,
    alternates: {
      canonical: articleUrl(article),
    },
    openGraph: {
      title: article.title,
      description: article.meta_description,
      type: "article",
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

  return (
    <main className="article-shell">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span>/</span>
        <span>{article.group}</span>
      </nav>

      <article className="article">
        <p className="kicker">{article.group}</p>
        <h1>{article.title}</h1>
        <p className="article-meta">最終更新: {article.last_updated}</p>
        {markdownToNodes(body, idToUrl)}

        <aside className="article-note">
          <strong>読んでいて怖くなった時は、そこで止めてください。</strong>
          <p>不快感、眠れなさ、動悸、日常生活への影響がある場合は、コツ探しより休むことを優先してください。</p>
        </aside>
      </article>

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.meta_description,
            dateModified: article.last_updated,
            inLanguage: "ja",
            isPartOf: {
              "@type": "WebSite",
              name: "脳イキ研究ノート",
            },
          }),
        }}
      />
    </main>
  );
}
