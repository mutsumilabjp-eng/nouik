import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { staticPages } from "../static-pages";

type StaticSlug = keyof typeof staticPages;
type Params = {
  params: Promise<{ page: string }>;
};

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
      canonical: `/${page}/`,
    },
  };
}

export default async function StaticPage({ params }: Params) {
  const { page } = await params;
  const data = staticPages[page as StaticSlug];
  if (!data) notFound();

  return (
    <main className="static-page">
      <section className="article">
        <h1>{data.title}</h1>
        {data.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </main>
  );
}
