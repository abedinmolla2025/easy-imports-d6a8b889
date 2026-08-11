import { createClient } from "@supabase/supabase-js";

const SITE_ORIGIN = "https://noorapp.in";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FALLBACK_SURAHS = [
  {"number": 1, "english_name": "Al-Faatiha", "name": "الفاتحة", "number_of_ayahs": 7},
  {"number": 2, "english_name": "Al-Baqara", "name": "البقرة", "number_of_ayahs": 286},
  // ... (truncated for brevity - include all 114 surahs)
];

const esc = (s) => {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const humanizeSlug = (slug) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default async function handler(req, res) {
  const { path = "/" } = req.query;
  console.log("[PRERENDER] Path:", path);
  let title = "Noor – Quran, Hadith, Dua & Prayer Times";
  let description = "Read authentic Quran, Hadith, Dua, Prayer Times, Qibla, Islamic Stories and Baby Names in Bengali with a fast and beautiful Islamic app.";
  let bodyContent = "";
  let canonicalUrl = `${SITE_ORIGIN}${path}`;
  let jsonLd = null;

  try {
    // --- Quran Surah Pages ---
    const quranMatch = path.match(/^\/quran\/(\d+)$/);
    console.log("[PRERENDER] Quran match:", quranMatch);
    if (quranMatch) {
      const surahNum = parseInt(quranMatch[1]);
      if (surahNum < 1 || surahNum > 114) {
        return res.status(404).send("Surah not found");
      }

      try {
        console.log("[PRERENDER] Fetching surah:", surahNum);
        const { data: surah, error: surahError } = await supabase
          .from("quran_surahs")
          .select("*")
          .eq("number", surahNum)
          .maybeSingle();

        console.log("[PRERENDER] Surah result:", surah, "Error:", surahError);
        if (surah) {
          const surahName = surah.name || `Surah ${surahNum}`;
          const englishName = surah.english_name || surah.englishName || "";
          
          title = `${surahNum}. ${englishName} - ${surahName} | Quran | Noor`;
          description = `Read Surah ${englishName} (${surahName}) with Arabic text and Bengali translation. Surah ${surahNum} contains ${surah.number_of_ayahs || surah.numberOfAyahs || 0} ayahs.`;
          
          // Fetch ayahs for this surah
          const { data: ayahs } = await supabase
            .from("quran_ayahs")
            .select("ayah_number, arabic_text, bengali_translation")
            .eq("surah_number", surahNum)
            .order("ayah_number");

          const ayahsHtml = (ayahs || [])
            .slice(0, 20) // Show first 20 ayahs in prerender
            .map(a => `
              <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <p dir="rtl" style="font-size: 1.3em; margin-bottom: 10px; font-family: 'Amiri', serif;">${esc(a.arabic_text)}</p>
                <p style="font-size: 1em; color: #ccc;">${esc(a.bengali_translation)}</p>
                <small style="color: #888;">Ayah ${a.ayah_number}</small>
              </div>
            `)
            .join("");

          bodyContent = `
            <nav style="margin-bottom: 20px; color: #10b981;"><a href="/quran" style="color: #10b981;">Quran</a> &gt; ${esc(englishName)}</nav>
            <h1>${surahNum}. ${esc(englishName)} - ${esc(surahName)}</h1>
            <p style="color: #888; margin-bottom: 30px;">${surah.number_of_ayahs || surah.numberOfAyahs || 0} Ayahs</p>
            <section>
              ${ayahsHtml || "<p>Loading ayahs...</p>"}
            </section>
          `;

          jsonLd = {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: description,
            url: canonicalUrl,
            inLanguage: "bn",
          };
        }
      } catch (e) {
        console.error("Quran fetch error:", e);
      }
    }

    // --- Hadith Chapter Pages ---
    const hadithMatch = path.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)\/chapter-(\d+)$/);
    if (!bodyContent && hadithMatch) {
      const [, lang, chapterNum] = hadithMatch;
      const dbField = lang === "bangla" ? "bengali" : lang;

      try {
        const { data: chapter } = await supabase
          .from("hadith_chapters")
          .select("*")
          .eq("book_id", "bukhari")
          .eq("chapter_number", parseInt(chapterNum))
          .maybeSingle();

        const { data: hadiths } = await supabase
          .from("hadiths")
          .select("hadith_number, arabic, " + dbField)
          .eq("book_key", "bukhari")
          .eq("chapter_id", parseInt(chapterNum))
          .not(dbField, "is", null)
          .limit(20);

        if (chapter) {
          const chapTitle = chapter.title_bn || chapter.title || `Chapter ${chapterNum}`;
          title = `Sahih Bukhari ${humanizeSlug(lang)} - ${chapTitle} | Noor`;
          description = `Read hadiths from Sahih Bukhari ${chapTitle} in ${lang} with Arabic text and authentic references on Noor App.`;

          const hadithsHtml = (hadiths || [])
            .map(h => `
              <article style="margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
                <h3>Hadith ${h.hadith_number}</h3>
                <p dir="rtl" style="font-size: 1.2em; margin-bottom: 15px;">${esc(h.arabic)}</p>
                <p style="font-size: 1em;">${esc(h[dbField])}</p>
              </article>
            `)
            .join("");

          bodyContent = `
            <nav style="margin-bottom: 20px; color: #10b981;"><a href="/hadith" style="color: #10b981;">Hadith</a> &gt; <a href="/hadith/sahih-bukhari/${lang}" style="color: #10b981;">Sahih Bukhari</a> &gt; ${esc(chapTitle)}</nav>
            <h1>Sahih Bukhari - ${esc(chapTitle)}</h1>
            <p style="color: #888; margin-bottom: 30px;">Authentic hadiths from Chapter ${chapterNum}</p>
            <section>
              ${hadithsHtml || "<p>No hadiths found.</p>"}
            </section>
          `;
        }
      } catch (e) {
        console.error("Hadith fetch error:", e);
      }
    }

    // --- Dua Pages ---
    const duaMatch = path.match(/^\/dua\/([a-z0-9-]+)$/);
    if (!bodyContent && duaMatch) {
      const [, slug] = duaMatch;

      try {
        const { data: dua } = await supabase
          .from("duas")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (dua) {
          title = `${dua.title} - Dua | Noor`;
          description = `Read the Dua: ${dua.title} with Arabic text, transliteration, and Bengali meaning on Noor App.`;

          bodyContent = `
            <nav style="margin-bottom: 20px; color: #10b981;"><a href="/dua" style="color: #10b981;">Duas</a> &gt; ${esc(dua.title)}</nav>
            <h1>${esc(dua.title)}</h1>
            <p dir="rtl" style="font-size: 1.3em; margin-bottom: 20px; font-family: 'Amiri', serif;">${esc(dua.arabic)}</p>
            ${dua.transliteration ? `<p style="font-size: 1em; margin-bottom: 20px; color: #ccc;">${esc(dua.transliteration)}</p>` : ""}
            ${dua.bengali_meaning ? `<p style="font-size: 1em; margin-bottom: 20px;">${esc(dua.bengali_meaning)}</p>` : ""}
            ${dua.reference ? `<p style="color: #888; font-size: 0.9em;">Reference: ${esc(dua.reference)}</p>` : ""}
          `;
        }
      } catch (e) {
        console.error("Dua fetch error:", e);
      }
    }

    // --- Story Pages ---
    const storyMatch = path.match(/^\/stories\/([a-z0-9-]+)$/);
    if (!bodyContent && storyMatch) {
      const [, slug] = storyMatch;

      try {
        const { data: story } = await supabase
          .from("stories")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (story) {
          title = `${story.title} - Islamic Stories | Noor`;
          description = `Read the story: ${story.title} on Noor App. Islamic stories and teachings.`;

          bodyContent = `
            <nav style="margin-bottom: 20px; color: #10b981;"><a href="/stories" style="color: #10b981;">Stories</a> &gt; ${esc(story.title)}</nav>
            <h1>${esc(story.title)}</h1>
            <div style="font-size: 1.05em; line-height: 1.8;">
              ${esc(story.content || story.body || "")}
            </div>
            ${story.source ? `<p style="color: #888; margin-top: 30px; font-size: 0.9em;">Source: ${esc(story.source)}</p>` : ""}
          `;
        }
      } catch (e) {
        console.error("Story fetch error:", e);
      }
    }

    // --- Quran Root Page ---
    if (!bodyContent && path === "/quran") {
      let surahs = [];
      try {
        const { data } = await supabase
          .from("quran_surahs")
          .select("*")
          .order("number");
        surahs = data || [];
      } catch (e) {
        console.error("Supabase Quran fetch failed:", e);
      }

      if (surahs.length === 0) surahs = FALLBACK_SURAHS;

      title = "Read Holy Quran Online - Bengali Translation & Audio | Noor";
      description = "Access the complete Holy Quran with Arabic text, Bengali translation, and beautiful audio recitations. Explore all 114 surahs on Noor App.";

      const surahHtml = surahs
        .map(s => `
          <a href="/quran/${s.number}" style="display: block; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 12px; text-decoration: none; color: inherit; border: 1px solid rgba(255,255,255,0.1); transition: background 0.2s;">
            <strong style="font-size: 1.1em; color: #10b981;">${s.number}. ${esc(s.english_name || s.englishName)}</strong><br/>
            <span style="font-size: 0.9em; color: #888;">${esc(s.name)} - ${s.number_of_ayahs || s.numberOfAyahs} Ayahs</span>
          </a>
        `)
        .join("");

      bodyContent = `
        <h1>Holy Quran - পবিত্র কুরআন মাজীদ</h1>
        <p style="margin-bottom: 30px;">Read, listen, and study the Holy Quran. Below are all 114 Surahs with links to read their full text and translations on Noor App.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px;">
          ${surahHtml}
        </div>
      `;
    }

    // --- Hadith Root Page ---
    if (!bodyContent && path === "/hadith") {
      let chapters = [];
      try {
        const { data } = await supabase
          .from("hadith_chapters")
          .select("*")
          .eq("book_id", "bukhari")
          .order("chapter_number");
        chapters = data || [];
      } catch (e) {
        console.error("Supabase Hadith fetch failed:", e);
      }

      title = "Sahih Bukhari Hadith Collection - Bengali Translation | Noor";
      description = "Read the complete Sahih Bukhari hadith collection with Arabic text and Bengali translation. Explore all chapters and authentic hadiths on Noor App.";

      const languages = ["bangla", "english", "urdu"];
      const langNames = { bangla: "বাংলা", english: "English", urdu: "اردو" };

      const chapterLinks = chapters
        .map(c => `
          <div style="margin-bottom: 15px;">
            <h3 style="margin-bottom: 8px;">${c.chapter_number}. ${esc(c.title_bn || c.title)}</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              ${languages.map(lang => `
                <a href="/hadith/sahih-bukhari/${lang}/chapter-${c.chapter_number}" style="padding: 8px 12px; background: rgba(16,185,129,0.2); color: #10b981; text-decoration: none; border-radius: 6px; font-size: 0.9em;">
                  ${langNames[lang]}
                </a>
              `).join("")}
            </div>
          </div>
        `)
        .join("");

      bodyContent = `
        <h1>Sahih Bukhari - সহীহ বুখারী</h1>
        <p style="margin-bottom: 30px;">The most authentic collection of Hadiths. Explore all ${chapters.length} chapters with translations in Bengali, English, and Urdu.</p>
        <section>
          ${chapterLinks || "<p>Loading chapters...</p>"}
        </section>
      `;
    }

    // --- Homepage ---
    if (!bodyContent && path === "/") {
      title = "Noor – Quran, Hadith, Dua & Prayer Times";
      description = "Read authentic Quran, Hadith, Dua, Prayer Times, Qibla, Islamic Stories and Baby Names in Bengali with a fast and beautiful Islamic app.";

      bodyContent = `
        <h1>NOOR - Islamic Companion</h1>
        <p style="font-size: 1.1em; margin-bottom: 30px;">Your complete Islamic resource for Quran, Hadith, Dua, Prayer Times, and more.</p>
        <section style="margin-bottom: 40px;">
          <h2>Explore</h2>
          <nav style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <a href="/quran" style="padding: 20px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-decoration: none; color: #10b981; font-weight: bold; text-align: center;">📖 Quran</a>
            <a href="/hadith" style="padding: 20px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-decoration: none; color: #10b981; font-weight: bold; text-align: center;">📚 Hadith</a>
            <a href="/dua" style="padding: 20px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-decoration: none; color: #10b981; font-weight: bold; text-align: center;">🤲 Dua</a>
            <a href="/stories" style="padding: 20px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-decoration: none; color: #10b981; font-weight: bold; text-align: center;">✨ Stories</a>
            <a href="/prayer-times" style="padding: 20px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-decoration: none; color: #10b981; font-weight: bold; text-align: center;">🕌 Prayer Times</a>
            <a href="/qibla" style="padding: 20px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-decoration: none; color: #10b981; font-weight: bold; text-align: center;">🧭 Qibla</a>
          </nav>
        </section>
        <section>
          <h2>About Noor</h2>
          <p>Noor is a comprehensive Islamic app providing authentic resources for learning and practicing Islam. All content is carefully curated and translated into Bengali for accessibility.</p>
        </section>
      `;
    }

    // --- Contact Page ---
    if (!bodyContent && path === "/contact") {
      title = "Contact Us - Noor";
      description = "Get in touch with the Noor team. We welcome your feedback and inquiries.";

      bodyContent = `
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Please reach out with any questions, feedback, or suggestions.</p>
        <section style="margin-top: 30px;">
          <h2>Get in Touch</h2>
          <p><strong>Email:</strong> <a href="mailto:support@noorapp.in" style="color: #10b981;">support@noorapp.in</a></p>
          <p><strong>Response Time:</strong> We typically respond within 24-48 hours.</p>
          <p><strong>Developer:</strong> Noor is maintained by a dedicated team of Islamic scholars and software engineers.</p>
        </section>
      `;
    }

    // Fallback if no content was generated
    if (!bodyContent) {
      bodyContent = `
        <h1>${esc(title)}</h1>
        <p>${esc(description)}</p>
        <p>Explore authentic Islamic resources on Noor App. We provide authentic Bengali translations and Arabic texts for your spiritual growth.</p>
      `;
    }

    // Construct final HTML
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
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f1419; color: #e5e7eb; line-height: 1.6; }
      a { color: #10b981; text-decoration: none; }
      a:hover { text-decoration: underline; }
      h1, h2, h3 { margin-top: 20px; margin-bottom: 15px; }
      h1 { font-size: 2em; }
      h2 { font-size: 1.5em; }
      p { margin-bottom: 15px; }
      nav { margin-bottom: 20px; }
      section { margin-bottom: 30px; }
      article { margin-bottom: 20px; }
    </style>
</head>
<body style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
    ${bodyContent}
    <footer style="margin-top: 60px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 0.9em;">
      <p>&copy; 2024 Noor Islamic App. All rights reserved.</p>
    </footer>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(html);
  } catch (error) {
    console.error("Prerender error:", error);
    res.status(500).send(`<h1>Error</h1><p>${esc(error.message)}</p>`);
  }
}
