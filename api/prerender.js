import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const SITE_ORIGIN = "https://noorapp.in";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORY_MAP = {
  "Balanced Life": "ভারসাম্যপূর্ণ জীবন",
  "Character": "চরিত্র",
  "Daily": "দৈনিক",
  "Death": "মৃত্যু",
  "Evening": "সন্ধ্যা",
  "Faith": "ঈমান",
  "Family": "পরিবার",
  "Fasting": "রোজা",
  "Food": "খাবার",
  "Forgiveness": "ক্ষমা",
  "Gratitude": "কৃতজ্ঞতা",
  "Guidance": "হেদায়েত",
  "Hajj": "হজ",
  "Healing": "আরোগ্য",
  "Health": "স্বাস্থ্য",
  "Hereafter": "পরকাল",
  "Hope": "আশা",
  "Journey": "সফর",
  "Justice": "ইনসাফ",
  "Knowledge": "জ্ঞান",
  "Legacy": "উত্তরাধিকার",
  "Masjid": "মসজিদ",
  "Morning": "সকাল",
  "Names of Allah": "আল্লাহর নাম",
  "Parents": "পিতা-মাতা",
  "Praise": "প্রশংসা",
  "Promise": "প্রতিশ্রুতি",
  "Protection": "সুরক্ষা",
  "Quran": "কুরআন",
  "Ramadan": "রমজান",
  "Remembrance": "জিকির",
  "Repentance": "তওবা",
  "Responsibility": "দায়িত্ব",
  "Ruqyah": "রুকইয়াহ",
  "Salah": "নামাজ",
  "Sleep": "ঘুম",
  "Steadfastness": "অবিচলতা",
  "Submission": "আত্মসমর্পণ",
  "Tawhid": "তাওহীদ",
  "Travel": "ভ্রমণ",
  "Weather": "আবহাওয়া",
  "Wisdom": "প্রজ্ঞা",
  "Worship": "ইবাদত",
  "Wudu": "ওযু",
  "Dua": "🤲",
};

const getCategoryLabel = (cat) => {
  if (!cat) return "সাধারণ";
  return CATEGORY_MAP[cat] || cat;
};

const CATEGORY_ICONS = {
  "Balanced Life": "⚖️",
  "Character": "👤",
  "Daily": "☀️",
  "Death": "⚰️",
  "Evening": "🌙",
  "Faith": "🕋",
  "Family": "👨‍👩‍👧‍👦",
  "Fasting": "🍽️",
  "Food": "🍲",
  "Forgiveness": "🤲",
  "Gratitude": "🤲",
  "Guidance": "🧭",
  "Hajj": "🕋",
  "Healing": "💊",
  "Health": "🏥",
  "Hereafter": "🌌",
  "Hope": "✨",
  "Journey": "🚗",
  "Justice": "⚖️",
  "Knowledge": "📚",
  "Legacy": "📜",
  "Masjid": "🕌",
  "Morning": "🌅",
  "Names of Allah": "✨",
  "Parents": "👴👵",
  "Praise": "🙌",
  "Promise": "🤝",
  "Protection": "🛡️",
  "Quran": "📖",
  "Ramadan": "🌙",
  "Remembrance": "📿",
  "Repentance": "🛐",
  "Responsibility": "📋",
  "Ruqyah": "🛡️",
  "Salah": "🛐",
  "Sleep": "💤",
  "Steadfastness": "⚓",
  "Submission": "🛐",
  "Tawhid": "☝️",
  "Travel": "✈️",
  "Weather": "⛈️",
  "Wisdom": "💡",
  "Worship": "🛐",
  "Wudu": "🚿",
  "Dua": "🤲",
};

const getCategoryIcon = (cat) => {
  return CATEGORY_ICONS[cat] || "🤲";
};

const ISLAMIC_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.08'%3E%3Cpath d='M0 0l20 20m40 0l20-20M0 80l20-20m40 0l20 20M40 0l20 20m0 40l-20 20m-20-20l-20 20m0-80l20 20'/%3E%3Cpath d='M20 20h40v40H20z'/%3E%3Cpath d='M40 0v20m0 40v20M0 40h20m40 0h20'/%3E%3Cpath d='M20 20L0 40l20 20 20-20-20-20zm40 0l20 20-20 20-20-20 20-20z'/%3E%3C/g%3E%3C/svg%3E")`;

const FALLBACK_SURAHS = [
  {"number": 1, "english_name": "Al-Fatiha", "name": "الفاتحة", "number_of_ayahs": 7, "english_name_translation": "The Opening"},
  {"number": 2, "english_name": "Al-Baqarah", "name": "البقرة", "number_of_ayahs": 286, "english_name_translation": "The Cow"},
  {"number": 3, "english_name": "Al-Imran", "name": "آل عمران", "number_of_ayahs": 200, "english_name_translation": "The Family of Imraan"},
  {"number": 4, "english_name": "An-Nisa", "name": "النساء", "number_of_ayahs": 176, "english_name_translation": "The Women"},
  {"number": 5, "english_name": "Al-Ma'idah", "name": "المائدة", "number_of_ayahs": 120, "english_name_translation": "The Table"}
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

const getAppTemplate = () => {
  const candidates = [
    path.join(process.cwd(), "dist", "app.html"),
    path.join("/var/task", "dist", "app.html"),
  ];
  for (const file of candidates) {
    try {
      if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
    } catch (e) {}
  }
  return `<!DOCTYPE html><html><head><title>{{TITLE}}</title></head><body><div id="root"></div></body></html>`;
};

function inject(html, { title, description, canonical, body }) {
  const tags = [
    [`<title>${esc(title)}</title>`, /<title[^>]*>[\s\S]*?<\/title>/i],
    [`<meta name="description" content="${esc(description)}" />`, /<meta\s+name=["']description["'][^>]*>/i],
    [`<link rel="canonical" href="${esc(canonical)}" />`, /<link\s+rel=["']canonical["'][^>]*>/i],
    [`<meta property="og:title" content="${esc(title)}" />`, /<meta\s+property=["']og:title["'][^>]*>/i],
    [`<meta property="og:description" content="${esc(description)}" />`, /<meta\s+property=["']og:description["'][^>]*>/i],
    [`<meta property="og:url" content="${esc(canonical)}" />`, /<meta\s+property=["']og:url["'][^>]*>/i],
    [`<meta name="twitter:title" content="${esc(title)}" />`, /<meta\s+name=["']twitter:title["'][^>]*>/i],
    [`<meta name="twitter:description" content="${esc(description)}" />`, /<meta\s+name=["']twitter:description["'][^>]*>/i],
  ];
  for (const [replacement, pattern] of tags) {
    html = pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `${replacement}</head>`);
  }
  // Robust root injection
  return html.replace(/<div\s+id=["']root["'][^>]*>[\s\S]*?<\/div>/i, `<div id="root">${body}</div>`);
}

export default async function handler(req, res) {
  let routePath = req.query.path || "/";
  if (!routePath.startsWith("/")) routePath = `/${routePath}`;
  routePath = routePath.replace(/\/$/, "") || "/";
  
  console.log("[PRERENDER] Processing Path:", routePath);
  
  let title = "Noor – Prayer Times, Quran & More";
  let description = "Read authentic Quran, Hadith, Dua, Prayer Times, Qibla, Islamic Stories and Baby Names in Bengali with a fast and beautiful Islamic app.";
  let bodyContent = "";
  let canonicalUrl = `${SITE_ORIGIN}${routePath === "/" ? "" : routePath}`;

  try {
    // --- Homepage ---
    if (routePath === "/") {
      bodyContent = `
        <div class="min-h-screen bg-background pb-20 w-full overflow-x-hidden">
          <main class="w-full px-3 py-4">
            <div class="space-y-4">
              <section class="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                      <span class="font-bold">N</span>
                    </div>
                    <div>
                      <h1 class="font-bold tracking-widest text-sm uppercase">NOOR</h1>
                      <p class="text-[9px] uppercase tracking-widest opacity-70">Your Islamic Companion</p>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-[9px] uppercase tracking-widest text-amber-400 font-bold mb-1">Current Prayer</p>
                    <h2 class="text-3xl font-bold">Fajr</h2>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-light opacity-80">05:00 AM</p>
                  </div>
                </div>
              </section>

              <div class="grid grid-cols-4 gap-3 py-2">
                <a href="/quran" class="flex flex-col items-center gap-1">
                  <div class="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">📖</div>
                  <span class="text-[10px] font-medium opacity-70">Quran</span>
                </a>
                <a href="/hadith" class="flex flex-col items-center gap-1">
                  <div class="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">📜</div>
                  <span class="text-[10px] font-medium opacity-70">Hadith</span>
                </a>
                <a href="/dua" class="flex flex-col items-center gap-1">
                  <div class="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">🤲</div>
                  <span class="text-[10px] font-medium opacity-70">Dua</span>
                </a>
                <a href="/stories" class="flex flex-col items-center gap-1">
                  <div class="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">✨</div>
                  <span class="text-[10px] font-medium opacity-70">Stories</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      `;
    }

    // --- Quran Root Page ---
    else if (routePath === "/quran") {
      title = "Quran Reader — পবিত্র কুরআন | NOOR";
      description = "Read all 114 Surahs of the Holy Quran with Arabic text and Bengali translation.";
      
      let surahs = FALLBACK_SURAHS;
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah", { signal: AbortSignal.timeout(5000) });
        const json = await response.json();
        if (json.code === 200) surahs = json.data;
      } catch (e) {}

      const surahList = surahs.map(s => `
        <a href="/quran/${s.number}" class="flex items-center justify-between p-4 bg-card border border-border rounded-2xl mb-3 hover:shadow-md transition-all group">
          <div class="flex items-center gap-4">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">${s.number}</span>
            <div>
              <h3 class="font-bold text-lg group-hover:text-primary transition-colors">${esc(s.englishName)}</h3>
              <p class="text-xs text-muted-foreground">${esc(s.englishNameTranslation)} • ${s.numberOfAyahs} Ayahs</p>
            </div>
          </div>
          <span class="text-2xl font-arabic text-primary/80">${esc(s.name)}</span>
        </a>
      `).join("");

      bodyContent = `
        <div class="min-h-screen bg-background">
          <header class="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white text-center">
            <h1 class="text-3xl font-bold mb-2">পবিত্র কুরআন</h1>
            <p class="text-white/80 max-w-md mx-auto">সহজ বাংলা অনুবাদ ও উচ্চারণসহ আল-কুরআন পড়ুন</p>
          </header>
          <div class="p-4 max-w-2xl mx-auto -mt-6">
            <div class="bg-card rounded-2xl shadow-xl p-2">
              ${surahList}
            </div>
          </div>
        </div>
      `;
    }

    // --- Quran Detail Page ---
    else if (routePath.startsWith("/quran/")) {
      const num = routePath.split("/")[2];
      if (num && !isNaN(num)) {
        try {
          const response = await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,bn.bengali`, { signal: AbortSignal.timeout(8000) });
          const json = await response.json();
          if (json.code === 200) {
            const ar = json.data[0];
            const bn = json.data[1];
            title = `Surah ${ar.englishName} (${ar.name}) — বাংলা অর্থ ও আরবি | Noor`;
            
            const ayahs = ar.ayahs.map((a, i) => `
              <div class="p-6 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <div class="flex justify-between items-start mb-4">
                  <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${a.numberInSurah}</span>
                </div>
                <p dir="rtl" class="text-3xl md:text-4xl font-arabic leading-[2.5] text-right mb-4">${esc(a.text)}</p>
                <p class="text-lg text-muted-foreground leading-relaxed">${esc(bn.ayahs[i].text)}</p>
              </div>
            `).join("");

            bodyContent = `
              <div class="min-h-screen bg-background">
                <header class="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white sticky top-0 z-30">
                  <div class="max-w-3xl mx-auto flex items-center justify-between">
                    <a href="/quran" class="p-2 bg-white/10 rounded-full">←</a>
                    <div class="text-center">
                      <h1 class="text-xl font-bold">${esc(ar.englishName)}</h1>
                      <p class="text-xs opacity-80">${esc(ar.englishNameTranslation)} • ${ar.numberOfAyahs} Ayahs</p>
                    </div>
                    <span class="text-2xl font-arabic">${esc(ar.name)}</span>
                  </div>
                </header>
                <main class="max-w-3xl mx-auto bg-card shadow-sm border-x border-border min-h-screen">
                  ${ayahs}
                </main>
              </div>
            `;
          }
        } catch (e) {}
      }
    }

    // --- Hadith Root Page ---
    else if (routePath === "/hadith") {
      title = "Hadith Collections — হাদিস সংকলন | Noor";
      bodyContent = `
        <div class="min-h-screen bg-background">
          <header class="bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white text-center">
            <h1 class="text-3xl font-bold mb-2">হাদিস সংকলন</h1>
            <p class="text-white/80">সহীহ হাদিসের নির্ভরযোগ্য ভাণ্ডার</p>
          </header>
          <div class="p-4 max-w-2xl mx-auto -mt-6">
            <div class="grid grid-cols-1 gap-4">
              <a href="/hadith/sahih-bukhari/bangla" class="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all flex items-center justify-between group">
                <div>
                  <h3 class="text-xl font-bold group-hover:text-primary transition-colors">সহীহ বুখারী (বাংলা)</h3>
                  <p class="text-sm text-muted-foreground">সম্পূর্ণ বাংলা অনুবাদসহ</p>
                </div>
                <span class="text-2xl">→</span>
              </a>
              <a href="/hadith/sahih-bukhari/english" class="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all flex items-center justify-between group">
                <div>
                  <h3 class="text-xl font-bold group-hover:text-primary transition-colors">Sahih Al-Bukhari (English)</h3>
                  <p class="text-sm text-muted-foreground">Complete English translation</p>
                </div>
                <span class="text-2xl">→</span>
              </a>
              <a href="/hadith/sahih-bukhari/urdu" class="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all flex items-center justify-between group">
                <div>
                  <h3 class="text-xl font-bold group-hover:text-primary transition-colors">صحیح البخاری (Urdu)</h3>
                  <p class="text-sm text-muted-foreground">Urdu translation</p>
                </div>
                <span class="text-2xl">→</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }

    // --- Dua Root Page ---
    else if (routePath === "/dua") {
      title = "Daily Duas & Supplications — দোয়া সমূহ | Noor";
      description = "দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও জিকিরসমূহ অর্থ ও ফজিলতসহ পড়ুন।";
      
      const { data: duas } = await supabase
        .from("admin_content")
        .select("category")
        .eq("content_type", "dua")
        .eq("status", "published");

      const categories = [...new Set((duas || []).map(d => d.category))].filter(Boolean);

      const categoryList = categories.map(cat => `
        <a href="/dua/category/${cat.toLowerCase().replace(/ /g, '-')}" class="shrink-0 w-32 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col items-center text-center relative overflow-hidden" style="background-image: ${ISLAMIC_PATTERN}">
          <div class="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-xl mb-2 relative z-10">
            ${getCategoryIcon(cat)}
          </div>
          <p class="text-xs font-bold text-white line-clamp-1 relative z-10">${esc(getCategoryLabel(cat))}</p>
          <p class="text-[9px] text-white/40 mt-1 uppercase tracking-wider whitespace-nowrap relative z-10">সব দোয়া দেখুন →</p>
        </a>
      `).join("");

      bodyContent = `
        <div class="min-h-screen bg-[hsl(158,64%,18%)]">
          <header class="bg-gradient-to-br from-[hsl(158,55%,22%)] to-[hsl(158,64%,15%)] p-10 text-white text-center border-b border-white/10 relative overflow-hidden" style="background-image: ${ISLAMIC_PATTERN}, linear-gradient(to bottom right, hsl(158,55%,22%), hsl(158,64%,15%))">
            <div class="relative z-10">
              <h1 class="text-4xl font-bold mb-3">দোয়া সংকলন</h1>
              <p class="text-white/70 max-w-md mx-auto">দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও জিকিরসমূহ</p>
            </div>
          </header>
          <div class="p-4 max-w-4xl mx-auto">
            <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              ${categoryList || '<p class="text-center p-8 text-white/50 w-full">দোয়া লোড হচ্ছে...</p>'}
            </div>
          </div>
        </div>
      `;
    }

    // --- Dua Detail Page ---
    else if (routePath.startsWith("/dua/")) {
      const slug = routePath.split("/")[2];
      const { data: dua } = await supabase
        .from("admin_content")
        .select("*")
        .eq("slug", slug)
        .eq("content_type", "dua")
        .eq("status", "published")
        .maybeSingle();

      if (dua) {
        title = `${dua.title} — বাংলা অর্থ, ফজিলত ও আরবি টেক্সট | Noor`;
        description = esc(dua.explanation_bn || dua.content || `${dua.title} এর আরবি, বাংলা উচ্চারণ, অর্থ ও ফজিলত পড়ুন।`);
        
        bodyContent = `
          <div class="min-h-screen bg-[hsl(158,64%,18%)] pb-20">
            <header class="bg-gradient-to-br from-[hsl(158,55%,22%)] to-[hsl(158,64%,15%)] p-6 text-white sticky top-0 z-30 relative overflow-hidden" style="background-image: ${ISLAMIC_PATTERN}">
              <div class="max-w-3xl mx-auto flex items-center gap-4 relative z-10">
                <a href="/dua" class="p-2 bg-white/10 rounded-full">←</a>
                <div class="min-w-0">
                  <h1 class="text-xl font-bold truncate">${esc(dua.title)}</h1>
                  <p class="text-[10px] uppercase tracking-widest opacity-70">বিভাগ: ${esc(getCategoryLabel(dua.category))}</p>
                </div>
              </div>
            </header>
            
            <main class="max-w-3xl mx-auto p-4 space-y-6">
              <!-- Arabic Card -->
              <div class="relative bg-gradient-to-br from-[hsl(158,55%,25%)] to-[hsl(158,64%,20%)] border border-white/10 rounded-3xl shadow-xl overflow-hidden" style="background-image: ${ISLAMIC_PATTERN}, linear-gradient(to bottom right, hsl(158,55%,25%), hsl(158,64%,20%))">
                <div class="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none"></div>
                <div class="p-8 text-center relative z-10">
                  <p class="text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-80">আরবি</p>
                  <p dir="rtl" class="text-3xl md:text-5xl font-arabic leading-[2.2] text-white drop-shadow-md">${esc(dua.content_arabic)}</p>
                </div>
              </div>

              <!-- Pronunciation Card -->
              <div class="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-sm" style="background-image: ${ISLAMIC_PATTERN}">
                <div class="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div>
                <h2 class="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-3 opacity-80">উচ্চারণ</h2>
                <p class="text-xl md:text-2xl leading-[1.8] tracking-wide font-bangla" style="color: #FFFFFF !important; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${esc(dua.content_pronunciation)}</p>
              </div>

              <!-- Meaning Card -->
              <div class="bg-gradient-to-br from-amber-400/10 to-transparent border border-amber-400/20 rounded-2xl p-6 relative overflow-hidden shadow-sm" style="background-image: ${ISLAMIC_PATTERN}, linear-gradient(to bottom right, rgba(251, 191, 36, 0.1), transparent)">
                <div class="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div>
                <h2 class="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-3 opacity-80">অর্থ</h2>
                <p class="text-xl md:text-2xl leading-[1.8] tracking-wide font-bangla-serif" style="color: #FFFFFF !important; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${esc(dua.content)}</p>
              </div>
              
              <!-- Virtues & Explanation -->
              ${dua.virtue ? `
                <div class="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 class="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <span>✨</span> ফজিলত
                  </h3>
                  <p class="text-white/80 italic leading-relaxed">
                    ${esc(dua.virtue)}
                  </p>
                  ${dua.virtue_reference ? `<p class="mt-4 text-xs text-white/40">[রেফারেন্স: ${esc(dua.virtue_reference)}]</p>` : ''}
                </div>
              ` : ''}
              
              ${dua.explanation_bn ? `
                <div class="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 class="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <span>📚</span> বিস্তারিত ব্যাখ্যা
                  </h3>
                  <div class="text-white/70 leading-relaxed whitespace-pre-line">
                    ${esc(dua.explanation_bn)}
                  </div>
                </div>
              ` : ''}
              
              <!-- Footer Reference -->
              <div class="text-center py-8 opacity-30 text-xs text-white">
                <p>উৎস: ${esc(dua.reference || "হাদিস সংকলন")}</p>
                <p class="mt-1">© Noor Islamic App</p>
              </div>
            </main>
          </div>
        `;
      }
    }

    // --- Stories Root Page ---
    else if (routePath === "/stories") {
      title = "Islamic Stories | NoorApp";
      
      const { data: stories } = await supabase
        .from("admin_content")
        .select("slug, title, content")
        .eq("content_type", "story")
        .eq("status", "published");

      const storyList = (stories || []).map(s => `
        <div class="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-4">
          <div class="p-5">
            <h3 class="text-xl font-bold mb-2">${esc(s.title)}</h3>
            <a href="/stories/${s.slug}" class="text-primary font-bold">পড়ুন →</a>
          </div>
        </div>
      `).join("");

      bodyContent = `
        <div class="min-h-screen bg-background pb-24">
          <section class="bg-emerald-800 text-white p-10">
            <h1 class="text-3xl font-bold">Islamic Stories</h1>
            <p class="mt-2">Authentic stories of the Prophets and Sahaba.</p>
          </section>
          <div class="p-4 max-w-4xl mx-auto">
            ${storyList || '<p class="text-center text-muted-foreground">No stories found.</p>'}
          </div>
        </div>
      `;
    }

    // --- Contact Page ---
    else if (routePath === "/contact") {
      title = "Contact Us | Noor";
      bodyContent = `
        <div class="min-h-screen bg-background p-4">
          <header class="mb-8">
            <h1 class="text-2xl font-bold">Contact Us</h1>
            <p class="text-muted-foreground">যোগাযোগ করুন</p>
          </header>
          <div class="max-w-2xl mx-auto space-y-6">
            <section class="bg-card p-6 rounded-2xl border border-border">
              <h2 class="text-lg font-bold mb-4">Get in Touch</h2>
              <p class="mb-4">Email: <a href="mailto:support@noorapp.in" class="text-primary">support@noorapp.in</a></p>
              <p class="text-sm text-muted-foreground">We typically respond within 24-48 hours.</p>
            </section>
          </div>
        </div>
      `;
    }

    // --- Fallback for other routes ---
    if (!bodyContent) {
      bodyContent = `
        <div class="min-h-screen flex items-center justify-center p-4 bg-background">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-2">${esc(title)}</h1>
            <p class="text-muted-foreground">Loading the full experience...</p>
          </div>
        </div>
      `;
    }

    // Use actual app.html as base
    const appTemplate = getAppTemplate();
    
    // Inject custom styles for premium typography
    const customStyles = `
      <style>
        .font-bangla { font-family: 'Noto Sans Bengali', 'Hind Siliguri', sans-serif !important; }
        .font-bangla-serif { font-family: 'Noto Serif Bengali', serif !important; }
        .font-arabic { font-family: 'Scheherazade New', 'Amiri', serif !important; }
        [dir="rtl"] { text-align: right; }
      </style>
    `;
    
    const finalHtml = inject(appTemplate.replace('</head>', `${customStyles}</head>`), {
      title,
      description,
      canonical: canonicalUrl,
      body: bodyContent
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600, max-age=60");
    res.setHeader("X-Noor-Prerender", "true");
    res.status(200).send(finalHtml);
  } catch (error) {
    console.error("Prerender error:", error);
    res.setHeader("X-Noor-Prerender-Error", "true");
    res.status(200).send(getAppTemplate());
  }
}
