import { createClient } from '@supabase/supabase-js';

const SITE_ORIGIN = "https://noorapp.in";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const VALID_STATIC_PATHS = new Set([
  "/", "/quran", "/hadith", "/dua", "/prayer-times", "/prayer-guide", "/qibla", "/tasbih", "/99-names", "/baby-names", "/calendar", "/quiz", "/stories", "/about", "/contact", "/sources", "/data-sources", "/privacy-policy", "/terms", "/download", "/islamic-app",
]);

const FALLBACK_SURAHS = [
  {"number": 1, "english_name": "Al-Faatiha", "name": "الفاتحة", "number_of_ayahs": 7},
  {"number": 2, "english_name": "Al-Baqara", "name": "البقرة", "number_of_ayahs": 286},
  {"number": 3, "english_name": "Aal-i-Imraan", "name": "آل عمران", "number_of_ayahs": 200},
  {"number": 4, "english_name": "An-Nisaa", "name": "النساء", "number_of_ayahs": 176},
  {"number": 5, "english_name": "Al-Maaida", "name": "المائدة", "number_of_ayahs": 120},
  {"number": 6, "english_name": "Al-An'aam", "name": "الأنعام", "number_of_ayahs": 165},
  {"number": 7, "english_name": "Al-A'raaf", "name": "الأعراف", "number_of_ayahs": 206},
  {"number": 8, "english_name": "Al-Anfaal", "name": "الأنفال", "number_of_ayahs": 75},
  {"number": 9, "english_name": "At-Tawba", "name": "التوبة", "number_of_ayahs": 129},
  {"number": 10, "english_name": "Yunus", "name": "يونس", "number_of_ayahs": 109},
  {"number": 11, "english_name": "Hud", "name": "هود", "number_of_ayahs": 123},
  {"number": 12, "english_name": "Yusuf", "name": "يوسف", "number_of_ayahs": 111},
  {"number": 13, "english_name": "Ar-Ra'd", "name": "الرعد", "number_of_ayahs": 43},
  {"number": 14, "english_name": "Ibrahim", "name": "إبراهيم", "number_of_ayahs": 52},
  {"number": 15, "english_name": "Al-Hijr", "name": "الحجر", "number_of_ayahs": 99},
  {"number": 16, "english_name": "An-Nahl", "name": "النحل", "number_of_ayahs": 128},
  {"number": 17, "english_name": "Al-Israa", "name": "الإسراء", "number_of_ayahs": 111},
  {"number": 18, "english_name": "Al-Kahf", "name": "الكهফ", "number_of_ayahs": 110},
  {"number": 19, "english_name": "Maryam", "name": "مريم", "number_of_ayahs": 98},
  {"number": 20, "english_name": "Taa-Haa", "name": "طه", "number_of_ayahs": 135},
  {"number": 21, "english_name": "Al-Anbiyaa", "name": "الأنبياء", "number_of_ayahs": 112},
  {"number": 22, "english_name": "Al-Hajj", "name": "الحج", "number_of_ayahs": 78},
  {"number": 23, "english_name": "Al-Muminoon", "name": "المؤمنون", "number_of_ayahs": 118},
  {"number": 24, "english_name": "An-Noor", "name": "النور", "number_of_ayahs": 64},
  {"number": 25, "english_name": "Al-Furqaan", "name": "الفرقان", "number_of_ayahs": 77},
  {"number": 26, "english_name": "Ash-Shu'araa", "name": "الشعراء", "number_of_ayahs": 227},
  {"number": 27, "english_name": "An-Naml", "name": "النمل", "number_of_ayahs": 93},
  {"number": 28, "english_name": "Al-Qasas", "name": "القصص", "number_of_ayahs": 88},
  {"number": 29, "english_name": "Al-Ankaboot", "name": "العنكبوت", "number_of_ayahs": 69},
  {"number": 30, "english_name": "Ar-Room", "name": "الروم", "number_of_ayahs": 60},
  {"number": 31, "english_name": "Luqman", "name": "لقمان", "number_of_ayahs": 34},
  {"number": 32, "english_name": "As-Sajda", "name": "السجدة", "number_of_ayahs": 30},
  {"number": 33, "english_name": "Al-Ahzaab", "name": "الأحزاب", "number_of_ayahs": 73},
  {"number": 34, "english_name": "Saba", "name": "سبإ", "number_of_ayahs": 54},
  {"number": 35, "english_name": "Faatir", "name": "فاطر", "number_of_ayahs": 45},
  {"number": 36, "english_name": "Ya-Seen", "name": "يس", "number_of_ayahs": 83},
  {"number": 37, "english_name": "As-Saaffaat", "name": "الصافات", "number_of_ayahs": 182},
  {"number": 38, "english_name": "Saad", "name": "ص", "number_of_ayahs": 88},
  {"number": 39, "english_name": "Az-Zumar", "name": "الزمر", "number_of_ayahs": 75},
  {"number": 40, "english_name": "Ghafir", "name": "غافر", "number_of_ayahs": 85},
  {"number": 41, "english_name": "Fussilat", "name": "فصلت", "number_of_ayahs": 54},
  {"number": 42, "english_name": "Ash-Shura", "name": "الشورى", "number_of_ayahs": 53},
  {"number": 43, "english_name": "Az-Zukhruf", "name": "الزخرف", "number_of_ayahs": 89},
  {"number": 44, "english_name": "Ad-Dukhaan", "name": "الدخان", "number_of_ayahs": 59},
  {"number": 45, "english_name": "Al-Jaathiya", "name": "الجاثية", "number_of_ayahs": 37},
  {"number": 46, "english_name": "Al-Ahqaf", "name": "الأحقاف", "number_of_ayahs": 35},
  {"number": 47, "english_name": "Muhammad", "name": "محمد", "number_of_ayahs": 38},
  {"number": 48, "english_name": "Al-Fath", "name": "الفتح", "number_of_ayahs": 29},
  {"number": 49, "english_name": "Al-Hujuraat", "name": "الحجرات", "number_of_ayahs": 18},
  {"number": 50, "english_name": "Qaf", "name": "ق", "number_of_ayahs": 45},
  {"number": 51, "english_name": "Adh-Dhaariyat", "name": "الذاريات", "number_of_ayahs": 60},
  {"number": 52, "english_name": "At-Toor", "name": "الطور", "number_of_ayahs": 49},
  {"number": 53, "english_name": "An-Najm", "name": "النجم", "number_of_ayahs": 62},
  {"number": 54, "english_name": "Al-Qamar", "name": "القمر", "number_of_ayahs": 55},
  {"number": 55, "english_name": "Ar-Rahmaan", "name": "الرحمن", "number_of_ayahs": 78},
  {"number": 56, "english_name": "Al-Waaqia", "name": "الواقعة", "number_of_ayahs": 96},
  {"number": 57, "english_name": "Al-Hadid", "name": "الحديد", "number_of_ayahs": 29},
  {"number": 58, "english_name": "Al-Mujaadila", "name": "المجادلة", "number_of_ayahs": 22},
  {"number": 59, "english_name": "Al-Hashr", "name": "الحشر", "number_of_ayahs": 24},
  {"number": 60, "english_name": "Al-Mumtahana", "name": "الممتحنة", "number_of_ayahs": 13},
  {"number": 61, "english_name": "As-Saff", "name": "الصف", "number_of_ayahs": 14},
  {"number": 62, "english_name": "Al-Jumu'a", "name": "الجمعة", "number_of_ayahs": 11},
  {"number": 63, "english_name": "Al-Munaafiqoon", "name": "المنافقون", "number_of_ayahs": 11},
  {"number": 64, "english_name": "At-Taghaabun", "name": "التغابن", "number_of_ayahs": 18},
  {"number": 65, "english_name": "At-Talaaq", "name": "الطلاق", "number_of_ayahs": 12},
  {"number": 66, "english_name": "At-Tahrim", "name": "التحريم", "number_of_ayahs": 12},
  {"number": 67, "english_name": "Al-Mulk", "name": "الملك", "number_of_ayahs": 30},
  {"number": 68, "english_name": "Al-Qalam", "name": "القلم", "number_of_ayahs": 52},
  {"number": 69, "english_name": "Al-Haaqqa", "name": "الحاقة", "number_of_ayahs": 52},
  {"number": 70, "english_name": "Al-Ma'aarij", "name": "المعارج", "number_of_ayahs": 44},
  {"number": 71, "english_name": "Nooh", "name": "نوح", "number_of_ayahs": 28},
  {"number": 72, "english_name": "Al-Jinn", "name": "الجن", "number_of_ayahs": 28},
  {"number": 73, "english_name": "Al-Muzzammil", "name": "المزمل", "number_of_ayahs": 20},
  {"number": 74, "english_name": "Al-Muddaththir", "name": "المدثر", "number_of_ayahs": 56},
  {"number": 75, "english_name": "Al-Qiyaama", "name": "القيامة", "number_of_ayahs": 40},
  {"number": 76, "english_name": "Al-Insaan", "name": "الإنسان", "number_of_ayahs": 31},
  {"number": 77, "english_name": "Al-Mursalaat", "name": "المرسلات", "number_of_ayahs": 50},
  {"number": 78, "english_name": "An-Naba", "name": "النبإ", "number_of_ayahs": 40},
  {"number": 79, "english_name": "An-Naazi'aat", "name": "النازعات", "number_of_ayahs": 46},
  {"number": 80, "english_name": "Abasa", "name": "عبس", "number_of_ayahs": 42},
  {"number": 81, "english_name": "At-Takwir", "name": "التكوير", "number_of_ayahs": 29},
  {"number": 82, "english_name": "Al-Infitaar", "name": "الانفطار", "number_of_ayahs": 19},
  {"number": 83, "english_name": "Al-Mutaffifin", "name": "المطففين", "number_of_ayahs": 36},
  {"number": 84, "english_name": "Al-Inshiqaaq", "name": "الانشقاق", "number_of_ayahs": 25},
  {"number": 85, "english_name": "Al-Burooj", "name": "البروج", "number_of_ayahs": 22},
  {"number": 86, "english_name": "At-Taariq", "name": "الطارق", "number_of_ayahs": 17},
  {"number": 87, "english_name": "Al-A'laa", "name": "الأعلى", "number_of_ayahs": 19},
  {"number": 88, "english_name": "Al-Ghaashiya", "name": "الغاشية", "number_of_ayahs": 26},
  {"number": 89, "english_name": "Al-Fajr", "name": "الفجر", "number_of_ayahs": 30},
  {"number": 90, "english_name": "Al-Balad", "name": "البلد", "number_of_ayahs": 20},
  {"number": 91, "english_name": "Ash-Shams", "name": "الشمس", "number_of_ayahs": 15},
  {"number": 92, "english_name": "Al-Layl", "name": "الليل", "number_of_ayahs": 21},
  {"number": 93, "english_name": "Ad-Duhaa", "name": "الضحى", "number_of_ayahs": 11},
  {"number": 94, "english_name": "Ash-Sharh", "name": "الشرح", "number_of_ayahs": 8},
  {"number": 95, "english_name": "At-Tin", "name": "التين", "number_of_ayahs": 8},
  {"number": 96, "english_name": "Al-Alaq", "name": "العلق", "number_of_ayahs": 19},
  {"number": 97, "english_name": "Al-Qadr", "name": "القدر", "number_of_ayahs": 5},
  {"number": 98, "english_name": "Al-Bayyina", "name": "البينة", "number_of_ayahs": 8},
  {"number": 99, "english_name": "Az-Zalzala", "name": "الزلزلة", "number_of_ayahs": 8},
  {"number": 100, "english_name": "Al-Aadiyaat", "name": "العاديات", "number_of_ayahs": 11},
  {"number": 101, "english_name": "Al-Qaari'a", "name": "القارعة", "number_of_ayahs": 11},
  {"number": 102, "english_name": "At-Takaathur", "name": "التكاثر", "number_of_ayahs": 8},
  {"number": 103, "english_name": "Al-Asr", "name": "العصر", "number_of_ayahs": 3},
  {"number": 104, "english_name": "Al-Humaza", "name": "الهمزة", "number_of_ayahs": 9},
  {"number": 105, "english_name": "Al-Fil", "name": "الفيل", "number_of_ayahs": 5},
  {"number": 106, "english_name": "Quraish", "name": "قريش", "number_of_ayahs": 4},
  {"number": 107, "english_name": "Al-Maa'oon", "name": "الماعون", "number_of_ayahs": 7},
  {"number": 108, "english_name": "Al-Kawthar", "name": "الكوثر", "number_of_ayahs": 3},
  {"number": 109, "english_name": "Al-Kaafiroon", "name": "الكافرون", "number_of_ayahs": 6},
  {"number": 110, "english_name": "An-Nasr", "name": "النصر", "number_of_ayahs": 3},
  {"number": 111, "english_name": "Al-Masad", "name": "المسد", "number_of_ayahs": 5},
  {"number": 112, "english_name": "Al-Ikhlaas", "name": "الإخلاص", "number_of_ayahs": 4},
  {"number": 113, "english_name": "Al-Falaq", "name": "الفلق", "number_of_ayahs": 5},
  {"number": 114, "english_name": "An-Naas", "name": "الناس", "number_of_ayahs": 6}
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

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing Supabase credentials");
      return res.status(500).send("Configuration Error");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    let title = SEO_BY_PATH[path]?.title || "Noor — Islamic App";
    let description = SEO_BY_PATH[path]?.description || "Noor is a free Islamic app for Muslims. Read Quran, Hadith, Dua, and more.";
    let bodyContent = "";
    let jsonLd = null;
    let canonicalUrl = `${SITE_ORIGIN}${path}`;

    // Safely initialize variables
    let surahHtml = "";
    let chapterList = "";
    let sampleList = "";

    // --- SSR Branch: Hadith Root/Language ---
    const hadithLangMatch = path.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)$/);
    if (hadithLangMatch) {
      const lang = hadithLangMatch[1];
      const dbField = lang === "bangla" ? "bengali" : lang;
      
      const { data: chapters } = await supabase.from("hadith_chapters").select("*").eq("book_id", "bukhari").order("chapter_number");
      const { data: sampleHadiths } = await supabase.from("hadiths").select("hadith_number, arabic, " + dbField).eq("book_key", "bukhari").not(dbField, "is", null).limit(25);

      title = `Sahih Bukhari ${humanizeSlug(lang)} Hadith Collection | Noor`;
      description = `Browse all ${chapters?.length || 97} chapters of Sahih Bukhari with ${lang} translation and original Arabic text on Noor.`;
      
      chapterList = (chapters || []).map(c => `<li><a href="/hadith/sahih-bukhari/${lang}/chapter-${c.chapter_number}">${esc(c.title_bn || c.title)}</a> (${c.hadith_count || 0} hadiths)</li>`).join("");
      sampleList = (sampleHadiths || []).map(h => `<article><h4>Hadith ${h.hadith_number}</h4><p dir="rtl" style="font-size: 1.2em;">${esc(h.arabic)}</p><p>${esc(h[dbField])}</p></article>`).join("");

      bodyContent = `
        <h1>Sahih Bukhari - ${humanizeSlug(lang)} Translation</h1>
        <p>Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari. His collection is recognized by the overwhelming majority of the Muslim world to be the most authentic collection of reports of the Sunnah of the Prophet Muhammad (ﷺ).</p>
        <h3>Books / Chapters</h3>
        <ul>${chapterList || "<li>Loading chapters...</li>"}</ul>
        <h3>Sample Hadiths</h3>
        ${sampleList || "<p>No sample hadiths available at the moment.</p>"}
      `;
    }

    // --- SSR Branch: Hadith Chapter ---
    const hadithChapterMatch = path.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)\/chapter-(\d+)$/);
    if (hadithChapterMatch) {
      const [, lang, chapterNum] = hadithChapterMatch;
      const dbField = lang === "bangla" ? "bengali" : lang;
      
      const { data: chapter } = await supabase.from("hadith_chapters").select("*").eq("book_id", "bukhari").eq("chapter_number", chapterNum).maybeSingle();
      const { data: hadiths } = await supabase.from("hadiths").select("hadith_number, arabic, " + dbField).eq("book_key", "bukhari").eq("chapter_id", chapterNum).not(dbField, "is", null).limit(60);

      const chapTitle = chapter?.title_bn || chapter?.title || `Chapter ${chapterNum}`;
      title = `Sahih Bukhari ${humanizeSlug(lang)} - ${chapTitle} | Noor`;
      description = `Read hadiths from Sahih Bukhari ${chapTitle} in ${lang} with Arabic text and authentic references on Noor App.`;

      sampleList = (hadiths || []).map(h => `
        <article>
          <h3>Hadith ${h.hadith_number}</h3>
          <p dir="rtl" style="font-size: 1.2em;">${esc(h.arabic)}</p>
          <p>${esc(h[dbField])}</p>
        </article>
      `).join("");

      bodyContent = `
        <nav><a href="/hadith">Hadith</a> &gt; <a href="/hadith/sahih-bukhari/${lang}">Sahih Bukhari</a> &gt; ${esc(chapTitle)}</nav>
        <h1>Sahih Bukhari - ${esc(chapTitle)}</h1>
        <p>Explore authentic hadiths from Sahih Bukhari Chapter ${chapterNum} with ${lang} translation.</p>
        ${sampleList || "<p>Loading hadiths...</p>"}
      `;
    }

    // --- SSR Branch: Quran Root ---
    if (path === "/quran") {
      let surahs = [];
      try {
        const { data } = await supabase.from("quran_surahs").select("*").order("number");
        surahs = data || [];
      } catch (e) {
        console.error("Supabase Quran fetch failed:", e);
      }
      
      if (surahs.length === 0) surahs = FALLBACK_SURAHS;
      
      title = "Read Holy Quran Online - Bengali Translation & Audio | Noor";
      description = "Access the complete Holy Quran with Arabic text, Bengali translation, and beautiful audio recitations. Explore all 114 surahs on Noor App.";
      
      surahHtml = surahs.map(s => `
        <a href="/quran/${s.number}" style="display: block; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 12px; text-decoration: none; color: inherit; border: 1px solid rgba(255,255,255,0.1);">
          <strong style="font-size: 1.1em; color: #10b981;">${s.number}. ${esc(s.english_name || s.englishName)}</strong><br/>
          <span style="font-size: 0.9em; color: #888;">${esc(s.name)} - ${s.number_of_ayahs || s.numberOfAyahs} Ayahs</span>
        </a>
      `).join("");

      bodyContent = `
        <h1>Holy Quran - পবিত্র কুরআন মাজীদ</h1>
        <p>Read, listen, and study the Holy Quran. Below are all 114 Surahs with links to read their full text and translations on Noor App.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; margin-top: 20px;">
          ${surahHtml}
        </div>
      `;
    }

    // Final safety check
    if (!bodyContent || bodyContent.includes("undefined")) {
      bodyContent = `<h1>${esc(title)}</h1><p>${esc(description)}</p><p>Explore authentic Islamic resources, Quran, Hadith, and Dua on Noor App.</p>`;
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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0a1a1a; color: white; padding: 20px; line-height: 1.6;">
    <div style="max-width: 800px; margin: 0 auto;">
        <header style="margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
            <a href="/" style="color: #10b981; font-size: 2.5em; font-weight: bold; text-decoration: none; letter-spacing: -1px;">NOOR</a>
        </header>
        <main>
            ${bodyContent}
        </main>
        <footer style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; font-size: 0.9em; color: #666; text-align: center;">
            <p>&copy; 2026 Noor Islamic App. All rights reserved.</p>
            <div style="margin-top: 10px;">
                <a href="/about" style="color: #888; text-decoration: none; margin: 0 10px;">About</a>
                <a href="/privacy-policy" style="color: #888; text-decoration: none; margin: 0 10px;">Privacy</a>
                <a href="/terms" style="color: #888; text-decoration: none; margin: 0 10px;">Terms</a>
            </div>
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
    return res.status(200).send(`<!DOCTYPE html><html><body style="background:#0a1a1a;color:white;padding:20px;"><h1>NOOR</h1><p>Explore Quran, Hadith and Dua in Bengali.</p></body></html>`);
  }
}
