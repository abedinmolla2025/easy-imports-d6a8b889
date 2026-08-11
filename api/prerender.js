import { createClient } from '@supabase/supabase-js';

const SITE_ORIGIN = "https://noorapp.in";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const VALID_STATIC_PATHS = new Set([
  "/", "/quran", "/hadith", "/dua", "/prayer-times", "/prayer-guide", "/qibla", "/tasbih", "/99-names", "/baby-names", "/calendar", "/quiz", "/stories", "/about", "/contact", "/sources", "/data-sources", "/privacy-policy", "/terms", "/download", "/islamic-app",
]);

const FALLBACK_SURAHS = [
  { number: 1, english_name: "Al-Faatiha", name: "الفاتحة", number_of_ayahs: 7 },
  { number: 2, english_name: "Al-Baqara", name: "البقرة", number_of_ayahs: 286 },
  { number: 3, english_name: "Aal-i-Imraan", name: "آল ইমরান", number_of_ayahs: 200 },
  { number: 36, english_name: "Ya-Seen", name: "يس", number_of_ayahs: 83 },
  { number: 67, english_name: "Al-Mulk", name: "الملক", number_of_ayahs: 30 },
  { number: 114, english_name: "An-Naas", name: "الناس", number_of_ayahs: 6 }
];

function isKnownPublicPath(path) {
  return VALID_STATIC_PATHS.has(path)
    || /^\/stories\/(?:category\/[a-zA-Z0-9-]+|[a-zA-Z0-9-]+(?:\/trailer)?)$/.test(path)
    || /^\/hadith\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+){0,3}$/.test(path)
    || /^\/dua\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?$/.test(path)
    || /^\/quran\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?$/.test(path);
}

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const SEO_BY_PATH = {
  "/": { title: "Noor — Quran, Hadith, Dua & Prayer Times", description: "Read Quran, Hadith, Dua, prayer times, Qibla and Islamic resources in Bengali with Noor." },
  "/hadith": { title: "Authentic Hadith in Bengali | Noor", description: "Explore authentic Hadith collections and Sahih Bukhari resources in Bengali on Noor." },
  "/quran": { title: "Quran Reader — পবিত্র কুরআন | NOOR", description: "Read the Holy Quran with Arabic text, Bengali translation & audio recitation on Noor App." },
  "/dua": { title: "Daily Dua in Bengali | Noor", description: "Read daily duas with Bengali meaning, Arabic text and practical guidance on Noor." },
};

const esc = (s) => String(s || "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

export default async function handler(req, res) {
  try {
    let { path = "/" } = req.query;
    if (path !== "/" && path.endsWith("/")) path = path.replace(/\/+$/, "");

    if (!isKnownPublicPath(path)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, follow");
      return res.status(404).send("<!DOCTYPE html><html><body><h1>404 Not Found</h1></body></html>");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    let title = SEO_BY_PATH[path]?.title || "Noor — Islamic App";
    let description = SEO_BY_PATH[path]?.description || "Noor is a free Islamic app for Muslims. Read Quran, Hadith, Dua, and more.";
    let bodyContent = "";
    let jsonLd = null;
    let canonicalUrl = `${SITE_ORIGIN}${path}`;

    // --- Hadith Root/Language ---
    const hadithLangMatch = path.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)$/);
    if (hadithLangMatch) {
      const lang = hadithLangMatch[1];
      const dbField = lang === "bangla" ? "bengali" : lang;
      const { data: chapters } = await supabase.from("hadith_chapters").select("*").eq("book_id", "bukhari").order("chapter_number");
      const { data: sampleHadiths } = await supabase.from("hadiths").select("hadith_number, arabic, " + dbField).eq("book_key", "bukhari").not(dbField, "is", null).limit(25);

      title = `Sahih Bukhari ${humanizeSlug(lang)} Hadith Collection | Noor`;
      description = `Browse all ${chapters?.length || 97} chapters of Sahih Bukhari with ${lang} translation and original Arabic text on Noor.`;
      
      let chaptersHtml = (chapters || []).map(c => `<li><a href="/hadith/sahih-bukhari/${lang}/chapter-${c.chapter_number}">${esc(c.title_bn || c.title)}</a> (${c.hadith_count || 0} hadiths)</li>`).join("");
      let hadithsHtml = (sampleHadiths || []).map(h => `<article><h4>Hadith ${h.hadith_number}</h4><p dir="rtl">${esc(h.arabic)}</p><p>${esc(h[dbField])}</p></article>`).join("");

      bodyContent = `
        <h1>Sahih Bukhari - ${humanizeSlug(lang)} Translation</h1>
        <p>Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari. His collection is recognized by the overwhelming majority of the Muslim world to be the most authentic collection of reports of the Sunnah of the Prophet Muhammad (ﷺ).</p>
        <h3>Books / Chapters</h3>
        <ul>${chaptersHtml || "<li>Loading chapters...</li>"}</ul>
        <h3>Sample Hadiths</h3>
        ${hadithsHtml || "<p>No sample hadiths available at the moment.</p>"}
      `;
    }

    // --- Hadith Chapter ---
    const hadithChapterMatch = path.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)\/chapter-(\d+)$/);
    if (hadithChapterMatch) {
      const [, lang, chapterNum] = hadithChapterMatch;
      const dbField = lang === "bangla" ? "bengali" : lang;
      const { data: chapter } = await supabase.from("hadith_chapters").select("*").eq("book_id", "bukhari").eq("chapter_number", chapterNum).maybeSingle();
      const { data: hadiths } = await supabase.from("hadiths").select("hadith_number, arabic, " + dbField).eq("book_key", "bukhari").eq("chapter_id", chapterNum).not(dbField, "is", null).limit(60);

      const chapTitle = chapter?.title_bn || chapter?.title || `Chapter ${chapterNum}`;
      title = `Sahih Bukhari ${humanizeSlug(lang)} - ${chapTitle} | Noor`;
      description = `Read hadiths from Sahih Bukhari ${chapTitle} in ${lang} with Arabic text and authentic references on Noor App.`;

      let hadithsHtml = (hadiths || []).map(h => `
        <article>
          <h3>Hadith ${h.hadith_number}</h3>
          <p dir="rtl" style="font-size: 1.2em;">${esc(h.arabic)}</p>
          <p>${esc(h[dbField])}</p>
        </article>
      `).join("");

      bodyContent = `
        <nav><a href="/hadith">Hadith</a> &gt; <a href="/hadith/sahih-bukhari/${lang}">Sahih Bukhari</a> &gt; ${esc(chapTitle)}</nav>
        <h1>Sahih Bukhari - ${esc(chapTitle)}</h1>
        <p>Explore ${hadiths?.length || 0} authentic hadiths from Sahih Bukhari Chapter ${chapterNum} with ${lang} translation.</p>
        ${hadithsHtml || "<p>Loading hadiths...</p>"}
      `;
    }

    // --- Quran Root ---
    if (path === "/quran") {
      let surahs = [];
      try {
        const { data } = await supabase.from("quran_surahs").select("*").order("number");
        surahs = data || [];
      } catch (e) {}
      
      if (surahs.length === 0) surahs = FALLBACK_SURAHS;
      
      title = "Read Holy Quran Online - Bengali Translation & Audio | Noor";
      description = "Access the complete Holy Quran with Arabic text, Bengali translation, and beautiful audio recitations. Explore all 114 surahs on Noor App.";
      
      let surahsHtml = surahs.map(s => `
        <a href="/quran/${s.number}" style="display: block; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; text-decoration: none; color: inherit;">
          <strong>${s.number}. ${esc(s.english_name || s.englishName)}</strong><br/>
          <span style="font-size: 0.8em; color: #888;">${esc(s.name)} - ${s.number_of_ayahs || s.numberOfAyahs} Ayahs</span>
        </a>
      `).join("");

      bodyContent = `
        <h1>Holy Quran - পবিত্র কুরআন মাজীদ</h1>
        <p>Read, listen, and study the Holy Quran. Below are Surahs with links to read their full text and translations.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
          ${surahsHtml}
        </div>
      `;
    }

    const html = `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${esc(canonicalUrl)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${esc(canonicalUrl)}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body style="font-family: sans-serif; background: #0a1a1a; color: white; padding: 20px; line-height: 1.6;">
    <div style="max-width: 800px; margin: 0 auto;">
        <header><a href="/" style="color: #10b981; font-size: 2em; font-weight: bold; text-decoration: none;">NOOR</a></header>
        <main style="margin-top: 40px;">
            ${bodyContent || `<h1>${esc(title)}</h1><p>${esc(description)}</p>`}
        </main>
        <footer style="margin-top: 50px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-size: 0.8em; color: #888;">
            &copy; 2026 Noor Islamic App. All rights reserved.
        </footer>
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('X-Robots-Tag', 'index, follow');
    return res.status(200).send(html);
  } catch (err) {
    console.error("Prerender Error:", err);
    return res.status(200).send(`<!DOCTYPE html><html><body><h1>NOOR</h1><p>Loading...</p></body></html>`);
  }
}
