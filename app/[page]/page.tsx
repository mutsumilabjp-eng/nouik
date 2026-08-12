import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { staticPages } from "../static-pages";

type StaticSlug = keyof typeof staticPages;
type Params = {
  params: Promise<{ page: string }>;
};

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
          <p key={paragraph}>{paragraphParts(paragraph)}</p>
        ))}
      </section>
    </main>
  );
}
