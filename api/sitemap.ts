import { createClient } from '@supabase/supabase-js';

const ORIGIN = "https://noorapp.in";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const BASE_ROUTES = [
  "/",
  "/quran",
  "/hadith",
  "/hadith/sahih-bukhari",
  "/hadith/sahih-bukhari/bangla",
  "/hadith/sahih-bukhari/english",
  "/hadith/sahih-bukhari/urdu",
  "/dua",
  "/prayer-times",
  "/prayer-guide",
  "/qibla",
  "/tasbih",
  "/99-names",
  "/baby-names",
  "/calendar",
  "/quiz",
  "/stories",
  "/about",
  "/contact",
  "/sources",
  "/data-sources",
  "/privacy-policy",
  "/terms",
  "/download",
  "/islamic-app",
];

export default async function handler(_req: any, res: any) {
  try {
    const routes = [...BASE_ROUTES];
    
    // 1. Add Quran Surahs (1-114)
    for (let i = 1; i <= 114; i++) {
      routes.push(`/quran/${i}`);
    }

    // 2. Add Sahih Bukhari chapters (1-97) for all 3 languages
    const langs = ["bangla", "english", "urdu"];
    for (const lang of langs) {
      for (let i = 1; i <= 97; i++) {
        routes.push(`/hadith/sahih-bukhari/${lang}/chapter-${i}`);
      }
    }

    // 3. Add dynamic content from Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Stories and Duas
        const { data: content } = await supabase
          .from("admin_content")
          .select("slug, content_type")
          .in("content_type", ["story", "dua"]);
        
        if (content) {
          for (const item of content) {
            const prefix = item.content_type === "story" ? "/stories" : "/dua";
            routes.push(`${prefix}/${item.slug}`);
          }
        }

        // Hadith detail slugs (Top 2000 for SEO)
        const { data: hadiths } = await supabase
          .from("hadiths")
          .select("slug")
          .not("slug", "is", null)
          .order("id", { ascending: true })
          .limit(500);
        
        if (hadiths) {
          for (const h of hadiths) {
            routes.push(`/hadith/h/${h.slug}`);
          }
        }
      } catch (e) {
        console.error("Supabase sitemap fetch failed:", e);
      }
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((path) => `  <url>
    <loc>${xmlEscape(`${ORIGIN}${path}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`)
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    );
    return res.status(200).send(body);
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return res.status(500).send("Error generating sitemap");
  }
}
