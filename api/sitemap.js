const ORIGIN = "https://noorapp.in";

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const BASE_ROUTES = [
  "/", "/quran", "/hadith", "/hadith/sahih-bukhari",
  "/hadith/sahih-bukhari/bangla", "/hadith/sahih-bukhari/english", "/hadith/sahih-bukhari/urdu",
  "/dua", "/prayer-times", "/prayer-guide", "/qibla", "/tasbih", "/99-names", "/baby-names",
  "/calendar", "/quiz", "/stories", "/about", "/contact", "/sources", "/data-sources",
  "/privacy", "/privacy-policy", "/terms", "/download", "/islamic-app",
];

export default function handler(req, res) {
  const routes = [...BASE_ROUTES];
  for (let i = 1; i <= 114; i++) routes.push(`/quran/${i}`);
  for (const lang of ["bangla", "english", "urdu"]) {
    for (let i = 1; i <= 97; i++) routes.push(`/hadith/sahih-bukhari/${lang}/chapter-${i}`);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${xmlEscape(`${ORIGIN}${route}`)}</loc><changefreq>weekly</changefreq><priority>${route === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}\n</urlset>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
  return res.status(200).send(body);
}
