/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleUrl, getArticleById } from "../site";
import { staticPages } from "../static-pages";

type StaticSlug = keyof typeof staticPages;
type Params = {
  params: Promise<{ page: string }>;
};

const baseUrl = "https://nouiki-lab.com";
const evidenceArticleIds = ["F01", "F02", "F13", "F05", "F09"];

function paragraphParts(text: string) {
  const urlPattern = /(https:\/\/[^\s。]+)/g;
  return text.split(urlPattern).map((part, index) =>
    part.startsWith("https://") ? (
      <a href={part} key={`${part}-${index}`} rel="noreferrer" target="_blank">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function generateStaticParams() {
  return Object.keys(staticPages).map((page) => ({ page }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { page } = await params;
  const data = staticPages[page as StaticSlug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `/${page}`,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `/${page}`,
      siteName: "脳イキ研究ノート",
      type: "website",
      images: ["/images/hero-desk.jpg"],
    },
  };
}

export default async function StaticPage({ params }: Params) {
  const { page } = await params;
  const data = staticPages[page as StaticSlug];
  if (!data) notFound();

  const canonicalUrl = `${baseUrl}/${page}`;
  const evidenceArticles =
    page === "evidence"
      ? evidenceArticleIds.map((id) => getArticleById(id)).filter((article) => Boolean(article))
      : [];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: baseUrl },
      { "@type": "ListItem", position: 2, name: data.title, item: canonicalUrl },
    ],
  };

  return (
    <main className="static-page">
      <nav className="breadcrumb" aria-label="パンくず">
        <a href="/">ホーム</a>
        <span>/</span>
        <span>{data.title}</span>
      </nav>
      <section className="article">
        <h1>{data.title}</h1>
        {data.body.map((paragraph) => (
          <p key={paragraph}>{paragraphParts(paragraph)}</p>
        ))}

        {page === "evidence" && evidenceArticles.length ? (
          <section aria-labelledby="evidence-related-title">
            <h2 id="evidence-related-title">この資料を使って整理した記事</h2>
            <p>研究の結果をそのまま脳イキ全体へ一般化せず、各記事で「言えること」と「言えないこと」を分けています。</p>
            <ul>
              {evidenceArticles.map((article) =>
                article ? (
                  <li key={article.f_id}>
                    <a href={articleUrl(article)}>{article.title}</a>
                  </li>
                ) : null,
              )}
            </ul>
          </section>
        ) : null}
      </section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
  );
}
