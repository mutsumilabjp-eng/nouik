import { articleUrl, getArticles } from "./site";
import { staticPages } from "./static-pages";

export default function sitemap() {
  const base = "https://nouiki-lab.com";
  const siteUpdated = new Date("2026-09-15");
  return [
    { url: base, lastModified: siteUpdated },
    { url: `${base}/premium-guide`, lastModified: siteUpdated },
    { url: `${base}/premium-updates`, lastModified: siteUpdated },
    ...getArticles().map((article) => ({
      url: `${base}${articleUrl(article)}`,
      lastModified: new Date(article.last_updated),
    })),
    ...Object.keys(staticPages).map((page) => ({ url: `${base}/${page}`, lastModified: siteUpdated })),
  ];
}
