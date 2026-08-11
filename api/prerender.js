import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const SITE_ORIGIN = "https://noorapp.in";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FALLBACK_SURAHS = [
  {"number": 1, "english_name": "Al-Fatiha", "name": "الفاتحة", "number_of_ayahs": 7, "english_name_translation": "The Opening"},
  {"number": 2, "english_name": "Al-Baqarah", "name": "البقرة", "number_of_ayahs": 286, "english_name_translation": "The Cow"},
  {"number": 3, "english_name": "Al-Imran", "name": "آل عمران", "number_of_ayahs": 200, "english_name_translation": "The Family of Imraan"},
  {"number": 4, "english_name": "An-Nisa", "name": "النساء", "number_of_ayahs": 176, "english_name_translation": "The Women"},
  {"number": 5, "english_name": "Al-Ma'idah", "name": "المائدة", "number_of_ayahs": 120, "english_name_translation": "The Table"},
  {"number": 6, "english_name": "Al-An'am", "name": "الأنعام", "number_of_ayahs": 165, "english_name_translation": "The Cattle"},
  {"number": 7, "english_name": "Al-A'raf", "name": "الأعراف", "number_of_ayahs": 206, "english_name_translation": "The Heights"},
  {"number": 8, "english_name": "Al-Anfal", "name": "الأنفال", "number_of_ayahs": 75, "english_name_translation": "The Spoils of War"},
  {"number": 9, "english_name": "At-Tawbah", "name": "التوبة", "number_of_ayahs": 129, "english_name_translation": "The Repentance"},
  {"number": 10, "english_name": "Yunus", "name": "يونس", "number_of_ayahs": 109, "english_name_translation": "Yunus"},
  {"number": 11, "english_name": "Hud", "name": "هود", "number_of_ayahs": 123, "english_name_translation": "Hud"},
  {"number": 12, "english_name": "Yusuf", "name": "يوسف", "number_of_ayahs": 111, "english_name_translation": "Yusuf"},
  {"number": 13, "english_name": "Ar-Ra'd", "name": "الرعد", "number_of_ayahs": 43, "english_name_translation": "The Thunder"},
  {"number": 14, "english_name": "Ibrahim", "name": "إبراهيم", "number_of_ayahs": 52, "english_name_translation": "Ibrahim"},
  {"number": 15, "english_name": "Al-Hijr", "name": "الحجر", "number_of_ayahs": 99, "english_name_translation": "The Rocky Tract"},
  {"number": 16, "english_name": "An-Nahl", "name": "النحل", "number_of_ayahs": 128, "english_name_translation": "The Bee"},
  {"number": 17, "english_name": "Al-Isra", "name": "الإسراء", "number_of_ayahs": 111, "english_name_translation": "The Night Journey"},
  {"number": 18, "english_name": "Al-Kahf", "name": "الكهف", "number_of_ayahs": 110, "english_name_translation": "The Cave"},
  {"number": 19, "english_name": "Maryam", "name": "مريم", "number_of_ayahs": 98, "english_name_translation": "Maryam"},
  {"number": 20, "english_name": "Ta-Ha", "name": "طه", "number_of_ayahs": 135, "english_name_translation": "Ta-Ha"},
  {"number": 21, "english_name": "Al-Anbiya", "name": "الأنبياء", "number_of_ayahs": 112, "english_name_translation": "The Prophets"},
  {"number": 22, "english_name": "Al-Hajj", "name": "الحج", "number_of_ayahs": 78, "english_name_translation": "The Pilgrimage"},
  {"number": 23, "english_name": "Al-Mu'minun", "name": "المؤمنون", "number_of_ayahs": 118, "english_name_translation": "The Believers"},
  {"number": 24, "english_name": "An-Nur", "name": "النور", "number_of_ayahs": 64, "english_name_translation": "The Light"},
  {"number": 25, "english_name": "Al-Furqan", "name": "الفرقان", "number_of_ayahs": 77, "english_name_translation": "The Criterion"},
  {"number": 26, "english_name": "Ash-Shu'ara", "name": "الشعراء", "number_of_ayahs": 227, "english_name_translation": "The Poets"},
  {"number": 27, "english_name": "An-Naml", "name": "النمل", "number_of_ayahs": 93, "english_name_translation": "The Ant"},
  {"number": 28, "english_name": "Al-Qasas", "name": "القصص", "number_of_ayahs": 88, "english_name_translation": "The Stories"},
  {"number": 29, "english_name": "Al-Ankabut", "name": "العنكبوت", "number_of_ayahs": 69, "english_name_translation": "The Spider"},
  {"number": 30, "english_name": "Ar-Rum", "name": "الروم", "number_of_ayahs": 60, "english_name_translation": "The Romans"},
  {"number": 31, "english_name": "Luqman", "name": "لقمان", "number_of_ayahs": 34, "english_name_translation": "Luqman"},
  {"number": 32, "english_name": "As-Sajdah", "name": "السجدة", "number_of_ayahs": 30, "english_name_translation": "The Prostration"},
  {"number": 33, "english_name": "Al-Ahzab", "name": "الأحزاب", "number_of_ayahs": 73, "english_name_translation": "The Combined Forces"},
  {"number": 34, "english_name": "Saba", "name": "سبإ", "number_of_ayahs": 54, "english_name_translation": "Saba"},
  {"number": 35, "english_name": "Fatir", "name": "فاطر", "number_of_ayahs": 45, "english_name_translation": "The Originator"},
  {"number": 36, "english_name": "Ya-Sin", "name": "يس", "number_of_ayahs": 83, "english_name_translation": "Ya-Sin"},
  {"number": 37, "english_name": "As-Saffat", "name": "الصافات", "number_of_ayahs": 182, "english_name_translation": "Those Ranges in Ranks"},
  {"number": 38, "english_name": "Sad", "name": "ص", "number_of_ayahs": 88, "english_name_translation": "Sad"},
  {"number": 39, "english_name": "Az-Zumar", "name": "الزمر", "number_of_ayahs": 75, "english_name_translation": "The Groups"},
  {"number": 40, "english_name": "Ghafir", "name": "غافر", "number_of_ayahs": 85, "english_name_translation": "The Forgiver"},
  {"number": 41, "english_name": "Fussilat", "name": "فصلت", "number_of_ayahs": 54, "english_name_translation": "Explained in Detail"},
  {"number": 42, "english_name": "Ash-Shura", "name": "الشورى", "number_of_ayahs": 53, "english_name_translation": "Consultation"},
  {"number": 43, "english_name": "Az-Zukhruf", "name": "الزخرف", "number_of_ayahs": 89, "english_name_translation": "The Ornaments of Gold"},
  {"number": 44, "english_name": "Ad-Dukhan", "name": "الدخان", "number_of_ayahs": 59, "english_name_translation": "The Smoke"},
  {"number": 45, "english_name": "Al-Jathiyah", "name": "الجاثية", "number_of_ayahs": 37, "english_name_translation": "Crouching"},
  {"number": 46, "english_name": "Al-Ahqaf", "name": "الأحقاف", "number_of_ayahs": 35, "english_name_translation": "The Wind-curved Sandhills"},
  {"number": 47, "english_name": "Muhammad", "name": "محمد", "number_of_ayahs": 38, "english_name_translation": "Muhammad"},
  {"number": 48, "english_name": "Al-Fath", "name": "الفتح", "number_of_ayahs": 29, "english_name_translation": "The Victory"},
  {"number": 49, "english_name": "Al-Hujurat", "name": "الحجرات", "number_of_ayahs": 18, "english_name_translation": "The Dwellings"},
  {"number": 50, "english_name": "Qaf", "name": "ق", "number_of_ayahs": 45, "english_name_translation": "Qaf"},
  {"number": 51, "english_name": "Adh-Dhariyat", "name": "الذاريات", "number_of_ayahs": 60, "english_name_translation": "The Winnowing Winds"},
  {"number": 52, "english_name": "At-Tur", "name": "الطور", "number_of_ayahs": 49, "english_name_translation": "The Mount"},
  {"number": 53, "english_name": "An-Najm", "name": "النجم", "number_of_ayahs": 62, "english_name_translation": "The Star"},
  {"number": 54, "english_name": "Al-Qamar", "name": "القمر", "number_of_ayahs": 55, "english_name_translation": "The Moon"},
  {"number": 55, "english_name": "Ar-Rahman", "name": "الرحمن", "number_of_ayahs": 78, "english_name_translation": "The Beneficent"},
  {"number": 56, "english_name": "Al-Waqi'ah", "name": "الواقعة", "number_of_ayahs": 96, "english_name_translation": "The Inevitable"},
  {"number": 57, "english_name": "Al-Hadid", "name": "الحديد", "number_of_ayahs": 29, "english_name_translation": "The Iron"},
  {"number": 58, "english_name": "Al-Mujadila", "name": "المجادلة", "number_of_ayahs": 22, "english_name_translation": "The Pleading Woman"},
  {"number": 59, "english_name": "Al-Hashr", "name": "الحشر", "number_of_ayahs": 24, "english_name_translation": "The Exile"},
  {"number": 60, "english_name": "Al-Mumtahanah", "name": "الممتحنة", "number_of_ayahs": 13, "english_name_translation": "She that is to be examined"},
  {"number": 61, "english_name": "As-Saff", "name": "الصف", "number_of_ayahs": 14, "english_name_translation": "The Ranks"},
  {"number": 62, "english_name": "Al-Jumu'ah", "name": "الجمعة", "number_of_ayahs": 11, "english_name_translation": "The Congregation, Friday"},
  {"number": 63, "english_name": "Al-Munafiqun", "name": "المنافقون", "number_of_ayahs": 11, "english_name_translation": "The Hypocrites"},
  {"number": 64, "english_name": "At-Taghabun", "name": "التغابن", "number_of_ayahs": 18, "english_name_translation": "The Mutual Disillusion"},
  {"number": 65, "english_name": "At-Talaq", "name": "الطلاق", "number_of_ayahs": 12, "english_name_translation": "The Divorce"},
  {"number": 66, "english_name": "At-Tahrim", "name": "التحريم", "number_of_ayahs": 12, "english_name_translation": "The Prohibition"},
  {"number": 67, "english_name": "Al-Mulk", "name": "الملك", "number_of_ayahs": 30, "english_name_translation": "The Sovereignty"},
  {"number": 68, "english_name": "Al-Qalam", "name": "القلم", "number_of_ayahs": 52, "english_name_translation": "The Pen"},
  {"number": 69, "english_name": "Al-Haqqah", "name": "الحاقة", "number_of_ayahs": 52, "english_name_translation": "The Reality"},
  {"number": 70, "english_name": "Al-Ma'arij", "name": "المعارج", "number_of_ayahs": 44, "english_name_translation": "The Ascending Stairways"},
  {"number": 71, "english_name": "Nuh", "name": "نوح", "number_of_ayahs": 28, "english_name_translation": "Nuh"},
  {"number": 72, "english_name": "Al-Jinn", "name": "الجن", "number_of_ayahs": 28, "english_name_translation": "The Jinn"},
  {"number": 73, "english_name": "Al-Muzzammil", "name": "المزمل", "number_of_ayahs": 20, "english_name_translation": "The Enshrouded One"},
  {"number": 74, "english_name": "Al-Muddaththir", "name": "المدثر", "number_of_ayahs": 56, "english_name_translation": "The Cloaked One"},
  {"number": 75, "english_name": "Al-Qiyamah", "name": "القيامة", "number_of_ayahs": 40, "english_name_translation": "The Resurrection"},
  {"number": 76, "english_name": "Al-Insan", "name": "الإنسان", "number_of_ayahs": 31, "english_name_translation": "The Man"},
  {"number": 77, "english_name": "Al-Mursalat", "name": "المرسلات", "number_of_ayahs": 50, "english_name_translation": "The Emissaries"},
  {"number": 78, "english_name": "An-Naba", "name": "النبإ", "number_of_ayahs": 40, "english_name_translation": "The Tidings"},
  {"number": 79, "english_name": "An-Nazi'at", "name": "النازعات", "number_of_ayahs": 46, "english_name_translation": "Those who drag forth"},
  {"number": 80, "english_name": "Abasa", "name": "عبس", "number_of_ayahs": 42, "english_name_translation": "He Frowned"},
  {"number": 81, "english_name": "At-Takwir", "name": "التكوير", "number_of_ayahs": 29, "english_name_translation": "The Overthrowing"},
  {"number": 82, "english_name": "Al-Infitar", "name": "الانفطار", "number_of_ayahs": 19, "english_name_translation": "The Cleaving"},
  {"number": 83, "english_name": "Al-Mutaffifin", "name": "المطففين", "number_of_ayahs": 36, "english_name_translation": "The Defrauding"},
  {"number": 84, "english_name": "Al-Inshiqaq", "name": "الانشقاق", "number_of_ayahs": 25, "english_name_translation": "The Sundering"},
  {"number": 85, "english_name": "Al-Buruj", "name": "البروج", "number_of_ayahs": 22, "english_name_translation": "The Mansions of the Stars"},
  {"number": 86, "english_name": "At-Tariq", "name": "الطارق", "number_of_ayahs": 17, "english_name_translation": "The Nightcomer"},
  {"number": 87, "english_name": "Al-A'la", "name": "الأعلى", "number_of_ayahs": 19, "english_name_translation": "The Most High"},
  {"number": 88, "english_name": "Al-Ghashiyah", "name": "الغاشية", "number_of_ayahs": 26, "english_name_translation": "The Overwhelming"},
  {"number": 89, "english_name": "Al-Fajr", "name": "الفجر", "number_of_ayahs": 30, "english_name_translation": "The Dawn"},
  {"number": 90, "english_name": "Al-Balad", "name": "البلد", "number_of_ayahs": 20, "english_name_translation": "The City"},
  {"number": 91, "english_name": "Ash-Shams", "name": "الشمس", "number_of_ayahs": 15, "english_name_translation": "The Sun"},
  {"number": 92, "english_name": "Al-Layl", "name": "الليل", "number_of_ayahs": 21, "english_name_translation": "The Night"},
  {"number": 93, "english_name": "Ad-Duha", "name": "الضحى", "number_of_ayahs": 11, "english_name_translation": "The Morning Hours"},
  {"number": 94, "english_name": "Ash-Sharh", "name": "الشرح", "number_of_ayahs": 8, "english_name_translation": "The Relief"},
  {"number": 95, "english_name": "At-Tin", "name": "التين", "number_of_ayahs": 8, "english_name_translation": "The Fig"},
  {"number": 96, "english_name": "Al-Alaq", "name": "العلق", "number_of_ayahs": 19, "english_name_translation": "The Clot"},
  {"number": 97, "english_name": "Al-Qadr", "name": "القدر", "number_of_ayahs": 5, "english_name_translation": "The Power"},
  {"number": 98, "english_name": "Al-Bayyinah", "name": "البينة", "number_of_ayahs": 8, "english_name_translation": "The Clear Proof"},
  {"number": 99, "english_name": "Az-Zalzalah", "name": "الزلزلة", "number_of_ayahs": 8, "english_name_translation": "The Earthquake"},
  {"number": 100, "english_name": "Al-Adiyat", "name": "العাদিয়াত", "number_of_ayahs": 11, "english_name_translation": "The Courser"},
  {"number": 101, "english_name": "Al-Qari'ah", "name": "القارعة", "number_of_ayahs": 11, "english_name_translation": "The Calamity"},
  {"number": 102, "english_name": "At-Takathur", "name": "التكاثر", "number_of_ayahs": 8, "english_name_translation": "The Rivalry in world increase"},
  {"number": 103, "english_name": "Al-Asr", "name": "العصر", "number_of_ayahs": 3, "english_name_translation": "The Declining Day"},
  {"number": 104, "english_name": "Al-Humazah", "name": "الهمزة", "number_of_ayahs": 9, "english_name_translation": "The Traducer"},
  {"number": 105, "english_name": "Al-Fil", "name": "الفيل", "number_of_ayahs": 5, "english_name_translation": "The Elephant"},
  {"number": 106, "english_name": "Quraysh", "name": "قريশ", "number_of_ayahs": 4, "english_name_translation": "Quraysh"},
  {"number": 107, "english_name": "Al-Ma'un", "name": "الماعون", "number_of_ayahs": 7, "english_name_translation": "The Small Kindnesses"},
  {"number": 108, "english_name": "Al-Kawthar", "name": "الكوثر", "number_of_ayahs": 3, "english_name_translation": "The Abundance"},
  {"number": 109, "english_name": "Al-Kafirun", "name": "الكافرون", "number_of_ayahs": 6, "english_name_translation": "The Disbelievers"},
  {"number": 110, "english_name": "An-Nasr", "name": "النصر", "number_of_ayahs": 3, "english_name_translation": "The Divine Support"},
  {"number": 111, "english_name": "Al-Masad", "name": "المسদ", "number_of_ayahs": 5, "english_name_translation": "The Palm Fiber"},
  {"number": 112, "english_name": "Al-Ikhlas", "name": "الإخلاص", "number_of_ayahs": 4, "english_name_translation": "The Sincerity"},
  {"number": 113, "english_name": "Al-Falaq", "name": "الفلق", "number_of_ayahs": 5, "english_name_translation": "The Daybreak"},
  {"number": 114, "english_name": "An-Nas", "name": "الناس", "number_of_ayahs": 6, "english_name_translation": "Mankind"}
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
  const templatePath = path.join(process.cwd(), "dist", "app.html");
  try {
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, "utf8");
    }
  } catch (e) {
    console.error("[PRERENDER] Error reading template:", e);
  }
  return `<!DOCTYPE html><html><head><title>{{TITLE}}</title></head><body><div id="root">{{BODY}}</div></body></html>`;
};

export default async function handler(req, res) {
  const { path: routePath = "/" } = req.query;
  console.log("[PRERENDER] Processing Path:", routePath);
  
  let title = "Noor – Prayer Times, Quran & More";
  let description = "Read authentic Quran, Hadith, Dua, Prayer Times, Qibla, Islamic Stories and Baby Names in Bengali with a fast and beautiful Islamic app.";
  let bodyContent = "";
  let canonicalUrl = `${SITE_ORIGIN}${routePath}`;

  try {
    // --- Homepage ---
    if (routePath === "/") {
      bodyContent = `
        <div class="min-h-screen bg-background pb-20 w-full overflow-x-hidden">
          <main class="w-full px-3 py-4">
            <div class="space-y-4">
              <section class="text-center py-8">
                <h1 class="text-4xl font-bold text-primary mb-2">NOOR</h1>
                <p class="text-muted-foreground">Your Islamic Companion</p>
              </section>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <a href="/quran" class="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <span class="font-bold">Quran</span>
                </a>
                <a href="/hadith" class="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <span class="font-bold">Hadith</span>
                </a>
                <a href="/dua" class="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <span class="font-bold">Dua</span>
                </a>
                <a href="/stories" class="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <span class="font-bold">Stories</span>
                </a>
                <a href="/prayer-times" class="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <span class="font-bold">Prayer</span>
                </a>
                <a href="/qibla" class="p-6 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <span class="font-bold">Qibla</span>
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
      description = "Read the Holy Quran with Arabic text, Bengali translation & audio recitation.";
      
      const surahList = FALLBACK_SURAHS.map(s => `
        <a href="/quran/${s.number}" class="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div class="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <span class="font-bold text-[hsl(45,93%,58%)] text-lg">${s.number}</span>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-white">${s.english_name}</p>
            <p class="text-xs text-white/60">${s.english_name_translation}</p>
          </div>
          <div class="text-right">
            <span class="text-xl font-arabic text-[hsl(45,93%,58%)]">${s.name}</span>
            <p class="text-xs text-white/60">${s.number_of_ayahs} আয়াত</p>
          </div>
        </a>
      `).join("");

      bodyContent = `
        <div class="min-h-screen bg-[hsl(158,64%,18%)] text-white">
          <header class="bg-[hsl(158,55%,22%)] border-b border-white/10 p-4 text-center">
            <h1 class="text-4xl font-arabic text-[hsl(45,93%,58%)] mb-2">الْقُرْآن الْكَرِيم</h1>
            <p class="text-white/70 text-sm">পবিত্র কুরআন মাজীদ</p>
          </header>
          <div class="px-3 py-4 space-y-2">
            ${surahList}
          </div>
        </div>
      `;
    }

    // --- Quran Surah Pages (using alquran.cloud API) ---
    else if (routePath.match(/^\/quran\/\d+$/)) {
      const surahNum = parseInt(routePath.split("/")[2]);
      const surah = FALLBACK_SURAHS.find(s => s.number === surahNum);
      
      if (surah) {
        title = `Surah ${surah.english_name} (${surah.name}) - Read Online | Noor`;
        
        try {
          const [arRes, bnRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/ar.alafasy`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/bn.bengali`)
          ]);
          
          const arData = await arRes.json();
          const bnData = await bnRes.json();
          
          if (arData.code === 200 && bnData.code === 200) {
            const ayahsHtml = arData.data.ayahs.map((a, i) => `
              <div class="p-4 border-b border-white/10">
                <p class="text-right text-2xl font-arabic mb-3" dir="rtl">${esc(a.text)}</p>
                <p class="text-white/80">${esc(bnData.data.ayahs[i].text)}</p>
              </div>
            `).join("");
            
            bodyContent = `
              <div class="min-h-screen bg-[hsl(158,64%,18%)] text-white">
                <header class="sticky top-0 bg-[hsl(158,55%,22%)] border-b border-white/10 p-4 flex justify-between items-center">
                  <div>
                    <h1 class="text-lg font-bold">${surah.english_name}</h1>
                    <p class="text-xs text-white/60">${surah.english_name_translation}</p>
                  </div>
                  <span class="text-2xl font-arabic text-[hsl(45,93%,58%)]">${surah.name}</span>
                </header>
                <div class="max-w-3xl mx-auto">
                  ${ayahsHtml}
                </div>
              </div>
            `;
          } else {
            throw new Error("API response not 200");
          }
        } catch (e) {
          bodyContent = `<div class="min-h-screen bg-[hsl(158,64%,18%)] flex items-center justify-center text-white">Loading content...</div>`;
        }
      }
    }

    // --- Hadith Root Page ---
    else if (routePath === "/hadith") {
      title = "Hadith Collections — হাদিস শরীফ | NOOR";
      bodyContent = `
        <div class="min-h-screen bg-background p-4">
          <header class="mb-6 text-center">
            <h1 class="text-2xl font-bold text-primary">Hadith Collections</h1>
            <p class="text-muted-foreground">পবিত্র হাদিস শরীফ</p>
          </header>
          <div class="grid gap-4 max-w-2xl mx-auto">
            <a href="/hadith/sahih-bukhari" class="p-6 bg-card border border-border rounded-2xl flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold">Sahih Al-Bukhari</h3>
                <p class="text-sm text-muted-foreground">সহিহ বুখারী শরীফ</p>
              </div>
              <span class="text-2xl">→</span>
            </a>
          </div>
        </div>
      `;
    }

    // --- Hadith Book Page ---
    else if (routePath === "/hadith/sahih-bukhari") {
      title = "Sahih Al-Bukhari — সহিহ বুখারী | NOOR";
      bodyContent = `
        <div class="min-h-screen bg-background p-4">
          <header class="mb-8 text-center">
            <h1 class="text-2xl font-bold text-primary">Sahih Al-Bukhari</h1>
            <p class="text-muted-foreground">Select Language</p>
          </header>
          <div class="grid gap-4 max-w-md mx-auto">
            <a href="/hadith/sahih-bukhari/bangla" class="p-5 bg-card border border-border rounded-xl text-center font-bold">Bengali (বাংলা)</a>
            <a href="/hadith/sahih-bukhari/english" class="p-5 bg-card border border-border rounded-xl text-center font-bold">English</a>
            <a href="/hadith/sahih-bukhari/urdu" class="p-5 bg-card border border-border rounded-xl text-center font-bold">Urdu (اردو)</a>
          </div>
        </div>
      `;
    }

    // --- Hadith Language Pages ---
    else if (routePath.match(/^\/hadith\/sahih-bukhari\/(bangla|english|urdu)$/)) {
      const lang = routePath.split("/")[3];
      const langLabels = { bangla: "সহিহ বুখারী শরীফ", english: "Sahih Al-Bukhari", urdu: "صحیح البخاری" };
      title = langLabels[lang] || "Sahih Bukhari";
      
      const { data: chapters } = await supabase
        .from("hadith_chapters")
        .select("chapter_number, title, title_bn")
        .eq("book_id", "bukhari")
        .order("chapter_number");

      const chapterList = (chapters || []).map(c => `
        <a href="/hadith/sahih-bukhari/${lang}/chapter-${c.chapter_number}" class="flex items-center justify-between p-4 bg-card border border-border rounded-xl mb-2">
          <span class="font-medium">${c.chapter_number}. ${lang === 'bangla' ? (c.title_bn || c.title) : c.title}</span>
          <span class="text-muted-foreground">→</span>
        </a>
      `).join("");

      bodyContent = `
        <div class="min-h-screen bg-background p-4">
          <header class="mb-6 text-center">
            <h1 class="text-2xl font-bold text-primary">${title}</h1>
            <p class="text-muted-foreground">Chapters List</p>
          </header>
          <div class="max-w-2xl mx-auto">
            ${chapterList || '<p class="text-center text-muted-foreground">No chapters found.</p>'}
          </div>
        </div>
      `;
    }

    // --- Dua Root Page ---
    else if (routePath === "/dua") {
      title = "Daily Duas & Supplications | Noor";
      
      const { data: duas } = await supabase
        .from("admin_content")
        .select("slug, title")
        .eq("content_type", "dua")
        .eq("status", "published");

      const duaList = (duas || []).map(d => `
        <a href="/dua/${d.slug}" class="block p-4 bg-card border border-border rounded-xl mb-2 hover:border-primary transition-colors">
          <h3 class="font-bold">${esc(d.title)}</h3>
        </a>
      `).join("");

      bodyContent = `
        <div class="min-h-screen bg-background p-4">
          <h1 class="text-2xl font-bold mb-6">Daily Duas</h1>
          <div class="grid gap-3 max-w-2xl mx-auto">
            ${duaList || '<p class="text-center text-muted-foreground">No duas found.</p>'}
          </div>
        </div>
      `;
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

    // --- Privacy/Terms/About ---
    else if (["/privacy-policy", "/terms", "/about"].includes(routePath)) {
      title = routePath === "/privacy-policy" ? "Privacy Policy | Noor" : routePath === "/terms" ? "Terms of Service | Noor" : "About Us | Noor";
      bodyContent = `
        <div class="min-h-screen bg-background p-6">
          <div class="max-w-3xl mx-auto prose prose-emerald">
            <h1 class="text-3xl font-bold mb-6">${title}</h1>
            <p class="text-muted-foreground">This content is available in our mobile app and website.</p>
            <p>Noor is dedicated to providing authentic Islamic content including Quran, Hadith, and Duas.</p>
          </div>
        </div>
      `;
    }

    // --- Fallback for other routes ---
    if (!bodyContent) {
      bodyContent = `
        <div class="min-h-screen flex items-center justify-center p-4">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-2">${esc(title)}</h1>
            <p class="text-muted-foreground">Loading the full experience...</p>
          </div>
        </div>
      `;
    }

    // Use actual app.html as base
    const appTemplate = getAppTemplate();
    const finalHtml = appTemplate
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(description)}"`)
      .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${esc(canonicalUrl)}"`)
      .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(title)}"`)
      .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(description)}"`)
      .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${esc(canonicalUrl)}"`)
      .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(title)}"`)
      .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(description)}"`)
      .replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600, max-age=60");
    res.status(200).send(finalHtml);
  } catch (error) {
    console.error("Prerender error:", error);
    res.status(200).send(getAppTemplate());
  }
}
