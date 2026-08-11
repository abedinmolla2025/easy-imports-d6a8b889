import { createClient } from "@supabase/supabase-js";

const SITE_ORIGIN = "https://noorapp.in";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FALLBACK_SURAHS = [
  {"number": 1, "english_name": "Al-Fatiha", "name": "الفاتحة", "number_of_ayahs": 7},
  {"number": 2, "english_name": "Al-Baqarah", "name": "البقرة", "number_of_ayahs": 286},
  {"number": 3, "english_name": "Al-Imran", "name": "آل عمران", "number_of_ayahs": 200},
  {"number": 4, "english_name": "An-Nisa", "name": "النساء", "number_of_ayahs": 176},
  {"number": 5, "english_name": "Al-Ma'idah", "name": "المائدة", "number_of_ayahs": 120},
  {"number": 6, "english_name": "Al-An'am", "name": "الأنعام", "number_of_ayahs": 165},
  {"number": 7, "english_name": "Al-A'raf", "name": "الأعراف", "number_of_ayahs": 206},
  {"number": 8, "english_name": "Al-Anfal", "name": "الأنفال", "number_of_ayahs": 75},
  {"number": 9, "english_name": "At-Tawbah", "name": "التوبة", "number_of_ayahs": 129},
  {"number": 10, "english_name": "Yunus", "name": "يونس", "number_of_ayahs": 109},
  {"number": 11, "english_name": "Hud", "name": "هود", "number_of_ayahs": 123},
  {"number": 12, "english_name": "Yusuf", "name": "يوسف", "number_of_ayahs": 111},
  {"number": 13, "english_name": "Ar-Ra'd", "name": "الرعد", "number_of_ayahs": 43},
  {"number": 14, "english_name": "Ibrahim", "name": "إبراهيم", "number_of_ayahs": 52},
  {"number": 15, "english_name": "Al-Hijr", "name": "الحجر", "number_of_ayahs": 99},
  {"number": 16, "english_name": "An-Nahl", "name": "النحل", "number_of_ayahs": 128},
  {"number": 17, "english_name": "Al-Isra", "name": "الإسراء", "number_of_ayahs": 111},
  {"number": 18, "english_name": "Al-Kahf", "name": "الكهف", "number_of_ayahs": 110},
  {"number": 19, "english_name": "Maryam", "name": "مريم", "number_of_ayahs": 98},
  {"number": 20, "english_name": "Ta-Ha", "name": "طه", "number_of_ayahs": 135},
  {"number": 21, "english_name": "Al-Anbiya", "name": "الأنبياء", "number_of_ayahs": 112},
  {"number": 22, "english_name": "Al-Hajj", "name": "الحج", "number_of_ayahs": 78},
  {"number": 23, "english_name": "Al-Mu'minun", "name": "المؤمنون", "number_of_ayahs": 118},
  {"number": 24, "english_name": "An-Nur", "name": "النور", "number_of_ayahs": 64},
  {"number": 25, "english_name": "Al-Furqan", "name": "الفرقان", "number_of_ayahs": 77},
  {"number": 26, "english_name": "Ash-Shu'ara", "name": "الشعراء", "number_of_ayahs": 227},
  {"number": 27, "english_name": "An-Naml", "name": "النمل", "number_of_ayahs": 93},
  {"number": 28, "english_name": "Al-Qasas", "name": "القصص", "number_of_ayahs": 88},
  {"number": 29, "english_name": "Al-Ankabut", "name": "العنكبوت", "number_of_ayahs": 69},
  {"number": 30, "english_name": "Ar-Rum", "name": "الروم", "number_of_ayahs": 60},
  {"number": 31, "english_name": "Luqman", "name": "لقمان", "number_of_ayahs": 34},
  {"number": 32, "english_name": "As-Sajdah", "name": "السجدة", "number_of_ayahs": 30},
  {"number": 33, "english_name": "Al-Ahzab", "name": "الأحزاب", "number_of_ayahs": 73},
  {"number": 34, "english_name": "Saba", "name": "سبإ", "number_of_ayahs": 54},
  {"number": 35, "english_name": "Fatir", "name": "فاطر", "number_of_ayahs": 45},
  {"number": 36, "english_name": "Ya-Sin", "name": "يس", "number_of_ayahs": 83},
  {"number": 37, "english_name": "As-Saffat", "name": "الصافات", "number_of_ayahs": 182},
  {"number": 38, "english_name": "Sad", "name": "ص", "number_of_ayahs": 88},
  {"number": 39, "english_name": "Az-Zumar", "name": "الزمر", "number_of_ayahs": 75},
  {"number": 40, "english_name": "Ghafir", "name": "غافر", "number_of_ayahs": 85},
  {"number": 41, "english_name": "Fussilat", "name": "فصلت", "number_of_ayahs": 54},
  {"number": 42, "english_name": "Ash-Shura", "name": "الشورى", "number_of_ayahs": 53},
  {"number": 43, "english_name": "Az-Zukhruf", "name": "الزخرف", "number_of_ayahs": 89},
  {"number": 44, "english_name": "Ad-Dukhan", "name": "الدخان", "number_of_ayahs": 59},
  {"number": 45, "english_name": "Al-Jathiyah", "name": "الجاثية", "number_of_ayahs": 37},
  {"number": 46, "english_name": "Al-Ahqaf", "name": "الأحقاف", "number_of_ayahs": 35},
  {"number": 47, "english_name": "Muhammad", "name": "محمد", "number_of_ayahs": 38},
  {"number": 48, "english_name": "Al-Fath", "name": "الفتح", "number_of_ayahs": 29},
  {"number": 49, "english_name": "Al-Hujurat", "name": "الحجرات", "number_of_ayahs": 18},
  {"number": 50, "english_name": "Qaf", "name": "ق", "number_of_ayahs": 45},
  {"number": 51, "english_name": "Adh-Dhariyat", "name": "الذاريات", "number_of_ayahs": 60},
  {"number": 52, "english_name": "At-Tur", "name": "الطور", "number_of_ayahs": 49},
  {"number": 53, "english_name": "An-Najm", "name": "النجم", "number_of_ayahs": 62},
  {"number": 54, "english_name": "Al-Qamar", "name": "القمر", "number_of_ayahs": 55},
  {"number": 55, "english_name": "Ar-Rahman", "name": "الرحمن", "number_of_ayahs": 78},
  {"number": 56, "english_name": "Al-Waqi'ah", "name": "الواقعة", "number_of_ayahs": 96},
  {"number": 57, "english_name": "Al-Hadid", "name": "الحديد", "number_of_ayahs": 29},
  {"number": 58, "english_name": "Al-Mujadila", "name": "المجادلة", "number_of_ayahs": 22},
  {"number": 59, "english_name": "Al-Hashr", "name": "الحشر", "number_of_ayahs": 24},
  {"number": 60, "english_name": "Al-Mumtahanah", "name": "الممتحنة", "number_of_ayahs": 13},
  {"number": 61, "english_name": "As-Saff", "name": "الصف", "number_of_ayahs": 14},
  {"number": 62, "english_name": "Al-Jumu'ah", "name": "الجمعة", "number_of_ayahs": 11},
  {"number": 63, "english_name": "Al-Munafiqun", "name": "المنافقون", "number_of_ayahs": 11},
  {"number": 64, "english_name": "At-Taghabun", "name": "التغابن", "number_of_ayahs": 18},
  {"number": 65, "english_name": "At-Talaq", "name": "الطلاق", "number_of_ayahs": 12},
  {"number": 66, "english_name": "At-Tahrim", "name": "التحريم", "number_of_ayahs": 12},
  {"number": 67, "english_name": "Al-Mulk", "name": "الملك", "number_of_ayahs": 30},
  {"number": 68, "english_name": "Al-Qalam", "name": "القلم", "number_of_ayahs": 52},
  {"number": 69, "english_name": "Al-Haqqah", "name": "الحاقة", "number_of_ayahs": 52},
  {"number": 70, "english_name": "Al-Ma'arij", "name": "المعارج", "number_of_ayahs": 44},
  {"number": 71, "english_name": "Nuh", "name": "نوح", "number_of_ayahs": 28},
  {"number": 72, "english_name": "Al-Jinn", "name": "الجن", "number_of_ayahs": 28},
  {"number": 73, "english_name": "Al-Muzzammil", "name": "المزمل", "number_of_ayahs": 20},
  {"number": 74, "english_name": "Al-Muddaththir", "name": "المدثر", "number_of_ayahs": 56},
  {"number": 75, "english_name": "Al-Qiyamah", "name": "القيامة", "number_of_ayahs": 40},
  {"number": 76, "english_name": "Al-Insan", "name": "الإنسان", "number_of_ayahs": 31},
  {"number": 77, "english_name": "Al-Mursalat", "name": "المرسلات", "number_of_ayahs": 50},
  {"number": 78, "english_name": "An-Naba", "name": "النبإ", "number_of_ayahs": 40},
  {"number": 79, "english_name": "An-Nazi'at", "name": "النازعات", "number_of_ayahs": 46},
  {"number": 80, "english_name": "Abasa", "name": "عبس", "number_of_ayahs": 42},
  {"number": 81, "english_name": "At-Takwir", "name": "التكوير", "number_of_ayahs": 29},
  {"number": 82, "english_name": "Al-Infitar", "name": "الانفطار", "number_of_ayahs": 19},
  {"number": 83, "english_name": "Al-Mutaffifin", "name": "المطففين", "number_of_ayahs": 36},
  {"number": 84, "english_name": "Al-Inshiqaq", "name": "الانشقاق", "number_of_ayahs": 25},
  {"number": 85, "english_name": "Al-Buruj", "name": "البروج", "number_of_ayahs": 22},
  {"number": 86, "english_name": "At-Tariq", "name": "الطارق", "number_of_ayahs": 17},
  {"number": 87, "english_name": "Al-A'la", "name": "الأعلى", "number_of_ayahs": 19},
  {"number": 88, "english_name": "Al-Ghashiyah", "name": "الغاشية", "number_of_ayahs": 26},
  {"number": 89, "english_name": "Al-Fajr", "name": "الفجر", "number_of_ayahs": 30},
  {"number": 90, "english_name": "Al-Balad", "name": "البلদ", "number_of_ayahs": 20},
  {"number": 91, "english_name": "Ash-Shams", "name": "الشمس", "number_of_ayahs": 15},
  {"number": 92, "english_name": "Al-Layl", "name": "الليل", "number_of_ayahs": 21},
  {"number": 93, "english_name": "Ad-Duha", "name": "الضحى", "number_of_ayahs": 11},
  {"number": 94, "english_name": "Ash-Sharh", "name": "الشرح", "number_of_ayahs": 8},
  {"number": 95, "english_name": "At-Tin", "name": "التين", "number_of_ayahs": 8},
  {"number": 96, "english_name": "Al-Alaq", "name": "العلق", "number_of_ayahs": 19},
  {"number": 97, "english_name": "Al-Qadr", "name": "القدر", "number_of_ayahs": 5},
  {"number": 98, "english_name": "Al-Bayyinah", "name": "البينة", "number_of_ayahs": 8},
  {"number": 99, "english_name": "Az-Zalzalah", "name": "الزلزلة", "number_of_ayahs": 8},
  {"number": 100, "english_name": "Al-Adiyat", "name": "العاديات", "number_of_ayahs": 11},
  {"number": 101, "english_name": "Al-Qari'ah", "name": "القارعة", "number_of_ayahs": 11},
  {"number": 102, "english_name": "At-Takathur", "name": "التكاثر", "number_of_ayahs": 8},
  {"number": 103, "english_name": "Al-Asr", "name": "العصر", "number_of_ayahs": 3},
  {"number": 104, "english_name": "Al-Humazah", "name": "الهمزة", "number_of_ayahs": 9},
  {"number": 105, "english_name": "Al-Fil", "name": "الفيل", "number_of_ayahs": 5},
  {"number": 106, "english_name": "Quraysh", "name": "قريش", "number_of_ayahs": 4},
  {"number": 107, "english_name": "Al-Ma'un", "name": "الماعون", "number_of_ayahs": 7},
  {"number": 108, "english_name": "Al-Kawthar", "name": "الكوثر", "number_of_ayahs": 3},
  {"number": 109, "english_name": "Al-Kafirun", "name": "الكافرون", "number_of_ayahs": 6},
  {"number": 110, "english_name": "An-Nasr", "name": "النصر", "number_of_ayahs": 3},
  {"number": 111, "english_name": "Al-Masad", "name": "المسد", "number_of_ayahs": 5},
  {"number": 112, "english_name": "Al-Ikhlas", "name": "الإخلاص", "number_of_ayahs": 4},
  {"number": 113, "english_name": "Al-Falaq", "name": "الفلق", "number_of_ayahs": 5},
  {"number": 114, "english_name": "An-Nas", "name": "الناس", "number_of_ayahs": 6}
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

// Base HTML template extracted from built index.html
const BASE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>{{TITLE}}</title>
    <meta name="description" content="{{DESCRIPTION}}" />
    <link rel="canonical" href="{{CANONICAL}}" />
    <meta name="author" content="NOOR" />
    <meta name="theme-color" content="#0d9f6e" />
    <meta name="msvalidate.01" content="BD28A1AD6076D784011352F0CB5D0B75" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Cinzel:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Pro:wght@300;400;500;600;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Noor Islamic App" />
    <meta property="og:title" content="{{TITLE}}" />
    <meta property="og:description" content="{{DESCRIPTION}}" />
    <meta property="og:image" content="https://noorapp.in/og-image.png" />
    <meta property="og:url" content="{{CANONICAL}}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{TITLE}}" />
    <meta name="twitter:description" content="{{DESCRIPTION}}" />
    <meta name="twitter:image" content="https://noorapp.in/og-image.png" />
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500
      });
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2770098542057651" crossorigin="anonymous"></script>
    <meta name="google-adsense-account" content="ca-pub-2770098542057651">
    <script type="module" crossorigin src="/assets/index-DADGngc0.js"></script>
    <link rel="modulepreload" crossorigin href="/assets/vendor-data--_x5elLo.js">
    <link rel="modulepreload" crossorigin href="/assets/vendor-react-Ba1AxkWB.js">
    <link rel="modulepreload" crossorigin href="/assets/vendor-ui-QY8IYcbR.js">
    <link rel="stylesheet" crossorigin href="/assets/index-DewLekkf.css">
    <style>
      .ssr-only { padding: 40px 20px; max-width: 1200px; margin: 0 auto; color: #e5e7eb; }
      .hero { text-align: center; margin-bottom: 40px; }
      .hero h1 { color: #10b981; font-size: 2.5rem; margin-bottom: 1rem; }
      .nav-card { display: block; padding: 20px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-decoration: none; color: #10b981; font-weight: bold; text-align: center; margin-bottom: 15px; }
      .list-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); text-decoration: none; color: inherit; }
      .list-item:hover { background: rgba(255,255,255,0.05); }
      .arabic { font-family: 'Scheherazade New', serif; font-size: 1.8rem; text-align: right; margin: 15px 0; }
      .translation { color: #9ca3af; font-size: 1.1rem; margin-bottom: 10px; }
      .ayah, .hadith { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .breadcrumb { margin-bottom: 20px; color: #6b7280; }
      .breadcrumb a { color: #10b981; }
    </style>
  </head>
  <body style="background: #0f1419;">
    <div id="root">
      <div class="ssr-only">
        {{BODY}}
      </div>
    </div>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    </script>
  </body>
</html>`;

export default async function handler(req, res) {
  const { path = "/" } = req.query;
  console.log("[PRERENDER] Processing Path:", path);
  
  let title = "Noor – Prayer Times, Quran & More";
  let description = "Read authentic Quran, Hadith, Dua, Prayer Times, Qibla, Islamic Stories and Baby Names in Bengali with a fast and beautiful Islamic app.";
  let bodyContent = "";
  let canonicalUrl = `${SITE_ORIGIN}${path}`;

  try {
    // --- Homepage ---
    if (path === "/") {
      bodyContent = `
        <div class="hero">
          <h1>NOOR - Your Islamic Companion</h1>
          <p>Authentic Islamic resources for your daily spiritual journey. Prayer times, Quran, Hadith, and more.</p>
        </div>
        <nav>
          <a href="/quran" class="nav-card">📖 Read Holy Quran</a>
          <a href="/hadith" class="nav-card">📚 Hadith Collections</a>
          <a href="/dua" class="nav-card">🤲 Daily Duas</a>
          <a href="/stories" class="nav-card">✨ Islamic Stories</a>
          <a href="/prayer-times" class="nav-card">🕌 Prayer Times</a>
          <a href="/qibla" class="nav-card">🧭 Qibla Finder</a>
        </nav>
      `;
    }

    // --- Contact Page ---
    else if (path === "/contact") {
      title = "Contact Us | Noor - Islamic App";
      description = "Get in touch with the Noor development team for feedback, support, or inquiries.";
      bodyContent = `
        <h1>Contact Us</h1>
        <div class="contact-info">
          <p>We value your feedback and are here to help with any questions or issues you may have.</p>
          <p><strong>Email:</strong> <a href="mailto:support@noorapp.in" style="color: #10b981;">support@noorapp.in</a></p>
          <p><strong>Response Time:</strong> We typically respond within 24-48 hours.</p>
          <p><strong>About:</strong> Noor is developed by a dedicated team focused on serving the Muslim Ummah with authentic digital resources.</p>
        </div>
      `;
    }

    // --- Quran Root Page ---
    else if (path === "/quran") {
      title = "Read Holy Quran Online - Bengali Translation & Arabic Text | Noor";
      description = "Access all 114 Surahs of the Holy Quran with authentic Bengali translation and clear Arabic text on Noor App.";
      
      const surahLinks = FALLBACK_SURAHS.map(s => `
        <a href="/quran/${s.number}" class="list-item">
          <span>${s.number}. ${s.english_name}</span>
          <span class="arabic">${s.name}</span>
        </a>
      `).join("");

      bodyContent = `
        <h1>Holy Quran (পবিত্র কুরআন মাজীদ)</h1>
        <p>Browse and read all 114 Surahs of the Holy Quran.</p>
        <div class="list">
          ${surahLinks}
        </div>
      `;
    }

    // --- Quran Surah Pages ---
    else if (path.match(/^\/quran\/\d+$/)) {
      const surahNum = parseInt(path.split("/")[2]);
      const surah = FALLBACK_SURAHS.find(s => s.number === surahNum);
      
      if (surah) {
        title = `Surah ${surah.english_name} (${surah.name}) - Read Online | Noor`;
        description = `Read Surah ${surah.english_name} with Arabic text and Bengali translation. Surah ${surahNum} contains ${surah.number_of_ayahs} ayahs.`;
        
        try {
          const apiRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/bn.bengali`);
          const apiData = await apiRes.json();
          
          if (apiData.code === 200) {
            const ayahsHtml = apiData.data.ayahs.slice(0, 30).map(a => `
              <div class="ayah">
                <p class="arabic" dir="rtl">${esc(a.text)}</p>
                <p class="translation">${esc(a.text)}</p>
                <span style="color: #6b7280; font-size: 0.8rem;">Ayah ${a.numberInSurah}</span>
              </div>
            `).join("");
            
            bodyContent = `
              <nav class="breadcrumb"><a href="/quran">Quran</a> &gt; Surah ${surah.english_name}</nav>
              <h1>Surah ${surah.english_name} (${surah.name})</h1>
              <div class="content-list">
                ${ayahsHtml}
              </div>
            `;
          }
        } catch (e) {
          console.error("Quran API Error:", e);
          bodyContent = `<h1>Surah ${surah.english_name}</h1><p>Loading ayahs...</p>`;
        }
      }
    }

    // --- Hadith Root Page ---
    else if (path === "/hadith") {
      title = "Authentic Hadith Collections - Sahih Bukhari & More | Noor";
      description = "Explore authentic Hadith collections including Sahih Bukhari with Bengali translations on Noor App.";
      bodyContent = `
        <h1>Hadith Collections</h1>
        <nav>
          <a href="/hadith/sahih-bukhari/bangla" class="nav-card">Sahih Bukhari (Bengali)</a>
          <a href="/hadith/sahih-bukhari/english" class="nav-card">Sahih Bukhari (English)</a>
          <a href="/hadith/sahih-bukhari/urdu" class="nav-card">Sahih Bukhari (Urdu)</a>
        </nav>
      `;
    }

    // --- Hadith Language Pages ---
    else if (path.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)$/)) {
      const lang = path.split("/")[3];
      title = `Sahih Bukhari Hadith - ${humanizeSlug(lang)} Translation | Noor`;
      
      const { data: chapters } = await supabase
        .from("hadith_chapters")
        .select("chapter_number, title, title_bn")
        .eq("book_id", "bukhari")
        .order("chapter_number");

      const chapterLinks = (chapters || []).map(c => `
        <a href="/hadith/sahih-bukhari/${lang}/chapter-${c.chapter_number}" class="list-item">
          <span>${c.chapter_number}. ${lang === 'bangla' ? (c.title_bn || c.title) : c.title}</span>
        </a>
      `).join("");

      bodyContent = `
        <h1>Sahih Bukhari (${humanizeSlug(lang)})</h1>
        <div class="list">
          ${chapterLinks}
        </div>
      `;
    }

    // --- Hadith Chapter Pages ---
    else if (path.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)\/chapter-\d+$/)) {
      const parts = path.split("/");
      const lang = parts[3];
      const chapterNum = parseInt(parts[4].split("-")[1]);
      const dbField = lang === "bangla" ? "bengali" : lang;

      const { data: chapter } = await supabase
        .from("hadith_chapters")
        .select("*")
        .eq("book_id", "bukhari")
        .eq("chapter_number", chapterNum)
        .maybeSingle();

      const { data: hadiths } = await supabase
        .from("hadiths")
        .select("hadith_number, arabic, " + dbField)
        .eq("book_key", "bukhari")
        .eq("chapter_id", chapterNum)
        .limit(20);

      if (chapter) {
        title = `Sahih Bukhari Chapter ${chapterNum} - ${humanizeSlug(lang)} | Noor`;
        const hadithsHtml = (hadiths || []).map(h => `
          <div class="hadith">
            <h3>Hadith ${h.hadith_number}</h3>
            <p class="arabic" dir="rtl">${esc(h.arabic)}</p>
            <p class="translation">${esc(h[dbField])}</p>
          </div>
        `).join("");

        bodyContent = `
          <nav class="breadcrumb"><a href="/hadith">Hadith</a> &gt; <a href="/hadith/sahih-bukhari/${lang}">Sahih Bukhari</a> &gt; Chapter ${chapterNum}</nav>
          <h1>Chapter ${chapterNum}: ${lang === 'bangla' ? (chapter.title_bn || chapter.title) : chapter.title}</h1>
          <div class="content-list">
            ${hadithsHtml}
          </div>
        `;
      }
    }

    // --- Dua Root Page ---
    else if (path === "/dua") {
      title = "Daily Duas & Supplications - Arabic & Bengali | Noor";
      description = "Read essential daily duas for every occasion with Arabic text, transliteration, and Bengali meaning on Noor App.";
      
      const { data: duas } = await supabase
        .from("admin_content")
        .select("slug, title")
        .eq("content_type", "dua")
        .eq("status", "published");

      const duaLinks = (duas || []).map(d => `
        <a href="/dua/${d.slug}" class="list-item">${esc(d.title)}</a>
      `).join("");

      bodyContent = `
        <h1>Daily Duas</h1>
        <div class="list">
          ${duaLinks}
        </div>
      `;
    }

    // --- Dua Detail Page ---
    else if (path.match(/^\/dua\/[a-z0-9-]+$/)) {
      const slug = path.split("/")[2];
      const { data: dua } = await supabase
        .from("admin_content")
        .select("*")
        .eq("slug", slug)
        .eq("content_type", "dua")
        .maybeSingle();

      if (dua) {
        title = `${dua.title} - Dua | Noor`;
        bodyContent = `
          <h1>${esc(dua.title)}</h1>
          <div class="content">
            <p class="arabic" dir="rtl">${esc(dua.arabic || "")}</p>
            <p class="translation">${esc(dua.content || "")}</p>
            ${dua.reference ? `<p style="color: #6b7280; font-size: 0.9rem; margin-top: 10px;">Source: ${esc(dua.reference)}</p>` : ""}
          </div>
        `;
      }
    }

    // --- Stories Root Page ---
    else if (path === "/stories") {
      title = "Islamic Stories for Kids & Adults - Bengali & English | Noor";
      description = "Read inspirational Islamic stories of the Prophets and Sahaba in Bengali and English on Noor App.";
      
      const { data: stories } = await supabase
        .from("admin_content")
        .select("slug, title")
        .eq("content_type", "story")
        .eq("status", "published");

      const storyLinks = (stories || []).map(s => `
        <a href="/stories/${s.slug}" class="list-item">${esc(s.title)}</a>
      `).join("");

      bodyContent = `
        <h1>Islamic Stories</h1>
        <div class="list">
          ${storyLinks}
        </div>
      `;
    }

    // --- Story Detail Page ---
    else if (path.match(/^\/stories\/[a-z0-9-]+$/)) {
      const slug = path.split("/")[2];
      const { data: story } = await supabase
        .from("admin_content")
        .select("*")
        .eq("slug", slug)
        .eq("content_type", "story")
        .maybeSingle();

      if (story) {
        title = `${story.title} - Islamic Story | Noor`;
        bodyContent = `
          <h1>${esc(story.title)}</h1>
          <div class="story-body">
            ${esc(story.content || "").split('\n').map(p => `<p style="margin-bottom: 15px;">${p}</p>`).join('')}
          </div>
        `;
      }
    }

    // --- Fallback if no specific content generated ---
    if (!bodyContent) {
      bodyContent = `
        <h1>${esc(title)}</h1>
        <p>${esc(description)}</p>
      `;
    }

    // Inject into template
    const finalHtml = BASE_HTML
      .replace(/{{TITLE}}/g, esc(title))
      .replace(/{{DESCRIPTION}}/g, esc(description))
      .replace(/{{CANONICAL}}/g, esc(canonicalUrl))
      .replace(/{{BODY}}/g, bodyContent);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Set explicit Cache-Control for Vercel Edge Cache
    // s-maxage: cache at edge for 24h
    // stale-while-revalidate: serve stale for up to 1h while revalidating in background
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600, max-age=60");
    res.status(200).send(finalHtml);
  } catch (error) {
    console.error("Prerender error:", error);
    // Even on error, serve a basic functional HTML
    res.status(200).send(BASE_HTML.replace("{{BODY}}", "<h1>Noor</h1><p>Loading Islamic resources...</p>"));
  }
}
