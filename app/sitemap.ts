import { articleUrl, getArticles } from "./site";
import { staticPages } from "./static-pages";

export default function sitemap() {
  const base = "https://nouiki-lab.com";
  const lastModified = new Date("2026-08-30");
  return [
    { url: base, lastModified },
    { url: `${base}/premium-guide`, lastModified },
    ...getArticles().map((article) => ({ url: `${base}${articleUrl(article)}`, lastModified })),
    ...Object.keys(staticPages).map((page) => ({ url: `${base}/${page}`, lastModified })),
  ];
}
