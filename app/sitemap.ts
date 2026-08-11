import { articleUrl, getArticles } from "./site";
import { staticPages } from "./static-pages";

export default function sitemap() {
  const base = "https://example.com";
  return [
    { url: base },
    ...getArticles().map((article) => ({ url: `${base}${articleUrl(article)}` })),
    ...Object.keys(staticPages).map((page) => ({ url: `${base}/${page}` })),
  ];
}
