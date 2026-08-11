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
        <p className="kicker">
          {article.target_keyword} / {article.group}
        </p>
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span>{article.group}</span>
          <span>更新日: {article.last_updated}</span>
          <span>18歳以上向け</span>
        </div>
        <aside className="medical-note">
          <strong>先に確認してください</strong>
          <p>この記事は診断・治療・効果保証ではなく、個人差のある体験を見直すための読み物です。痛み、不安、強い苦痛がある場合は閲覧や試行を中断してください。</p>
        </aside>
        <div className="article-body">{markdownToNodes(body, idToUrl)}</div>
        <section className="related">
          <h2>関連する記事</h2>
          <div className="article-grid">{related.length ? related.map(articleCard) : articleCard(articles.find((item) => item.f_id === "F13")!)}</div>
        </section>
        <section className="source-note">
          <h2>強い言葉に流されないために</h2>
          <p>体験談やコツは参考になりますが、成功保証ではありません。この記事では、できなかった人を責める言い方や、根拠のない断定を避けています。</p>
          <Link className="text-link" href="/evidence">
            判断のしかたを見る
          </Link>
        </section>
        {article.f_id === "F09" ? null : guideCta()}
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
              articleSection: article.group,
            }),
          }}
        />
      </article>
    </main>
  );
}
