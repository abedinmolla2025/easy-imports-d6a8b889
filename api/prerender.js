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
  "Daily": "দৈনন্দিন",
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
};

const getCategoryLabel = (cat) => {
  if (!cat) return "সাধারণ";
  return CATEGORY_MAP[cat] || cat;
};

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
  {"number": 18, "english_name": "Al-Kahf", "name": "الكهফ", "number_of_ayahs": 110, "english_name_translation": "The Cave"},
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
  {"number": 100, "english_name": "Al-Adiyat", "name": "العاديات", "number_of_ayahs": 11, "english_name_translation": "The Courser"},
  {"number": 101, "english_name": "Al-Qari'ah", "name": "القارعة", "number_of_ayahs": 11, "english_name_translation": "The Calamity"},
  {"number": 102, "english_name": "At-Takathur", "name": "التكاثر", "number_of_ayahs": 8, "english_name_translation": "The Rivalry in world increase"},
  {"number": 103, "english_name": "Al-Asr", "name": "العصر", "number_of_ayahs": 3, "english_name_translation": "The Declining Day"},
  {"number": 104, "english_name": "Al-Humazah", "name": "الهمزة", "number_of_ayahs": 9, "english_name_translation": "The Traducer"},
  {"number": 105, "english_name": "Al-Fil", "name": "الفيل", "number_of_ayahs": 5, "english_name_translation": "The Elephant"},
  {"number": 106, "english_name": "Quraysh", "name": "قريش", "number_of_ayahs": 4, "english_name_translation": "Quraysh"},
  {"number": 107, "english_name": "Al-Ma'un", "name": "الماعون", "number_of_ayahs": 7, "english_name_translation": "The Small Kindnesses"},
  {"number": 108, "english_name": "Al-Kawthar", "name": "الكوثر", "number_of_ayahs": 3, "english_name_translation": "The Abundance"},
  {"number": 109, "english_name": "Al-Kafirun", "name": "الكافرون", "number_of_ayahs": 6, "english_name_translation": "The Disbelievers"},
  {"number": 110, "english_name": "An-Nasr", "name": "النصر", "number_of_ayahs": 3, "english_name_translation": "The Divine Support"},
  {"number": 111, "english_name": "Al-Masad", "name": "المسد", "number_of_ayahs": 5, "english_name_translation": "The Palm Fiber"},
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
  return `<!DOCTYPE html><html><head><title>{{TITLE}}</title></head><body><div id="root"></div></body></html>`;
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
              <!-- Original Hero Structure -->
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
                  <div class="bg-white/10 rounded-full px-2 py-1 text-[10px]">Loading location...</div>
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

              <!-- Feature Grid -->
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

              <!-- Content Sections -->
              <div class="space-y-4 mt-6">
                <div class="bg-card p-4 rounded-2xl border border-border">
                  <h3 class="font-bold mb-2">Daily Hadith</h3>
                  <p class="text-sm text-muted-foreground italic">"The best among you is the one who learns the Quran and teaches it."</p>
                </div>
              </div>
            </div>
          </main>
          
          <!-- Bottom Navigation -->
          <nav class="fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-lg border-t border-border flex justify-around py-3 z-50">
            <a href="/" class="flex flex-col items-center gap-1 text-primary">
              <span class="text-xl">🏠</span>
              <span class="text-[10px]">Home</span>
            </a>
            <a href="/quran" class="flex flex-col items-center gap-1 text-muted-foreground">
              <span class="text-xl">📖</span>
              <span class="text-[10px]">Quran</span>
            </a>
            <a href="/hadith" class="flex flex-col items-center gap-1 text-muted-foreground">
              <span class="text-xl">📜</span>
              <span class="text-[10px]">Hadith</span>
            </a>
            <a href="/settings" class="flex flex-col items-center gap-1 text-muted-foreground">
              <span class="text-xl">⚙️</span>
              <span class="text-[10px]">Settings</span>
            </a>
          </nav>
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

    // --- Quran Surah Pages ---
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

    // --- Dua Root Page ---
    else if (routePath === "/dua") {
      title = "Daily Duas & Supplications — দোয়া সমূহ | Noor";
      description = "দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও জিকিরসমূহ অর্থ ও ফজিলতসহ পড়ুন।";
      
      const { data: duas } = await supabase
        .from("admin_content")
        .select("slug, title, category")
        .eq("content_type", "dua")
        .eq("status", "published")
        .limit(50);

      const duaList = (duas || []).map(d => `
        <a href="/dua/${d.slug}" class="flex items-center justify-between p-4 bg-card border border-border rounded-2xl mb-3 hover:shadow-md transition-all group">
          <div class="flex-1">
            <h3 class="font-bold text-lg group-hover:text-primary transition-colors">${esc(d.title)}</h3>
            <p class="text-xs text-muted-foreground uppercase tracking-wider mt-1">${esc(getCategoryLabel(d.category))}</p>
          </div>
          <span class="text-primary opacity-50 group-hover:opacity-100 transition-opacity">→</span>
        </a>
      `).join("");

      bodyContent = `
        <div class="min-h-screen bg-background">
          <header class="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white text-center">
            <h1 class="text-3xl font-bold mb-2">দোয়া সংকলন</h1>
            <p class="text-white/80 max-w-md mx-auto">দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও জিকিরসমূহ</p>
          </header>
          <div class="p-4 max-w-2xl mx-auto -mt-6">
            <div class="bg-card rounded-2xl shadow-xl p-2">
              ${duaList || '<p class="text-center p-8 text-muted-foreground">দোয়া লোড হচ্ছে...</p>'}
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
          <div class="min-h-screen bg-background pb-20">
            <header class="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white sticky top-0 z-30">
              <div class="max-w-3xl mx-auto flex items-center gap-4">
                <a href="/dua" class="p-2 bg-white/10 rounded-full">←</a>
                <h1 class="text-xl font-bold truncate">${esc(dua.title)}</h1>
              </div>
            </header>
            
            <main class="max-w-3xl mx-auto p-4 space-y-6">
              <!-- Arabic Card -->
              <div class="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                <div class="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900">
                  <p class="text-right text-3xl font-arabic leading-relaxed text-emerald-900 dark:text-emerald-100" dir="rtl">
                    ${esc(dua.content_arabic)}
                  </p>
                </div>
                
                <div class="p-6 space-y-6">
                  <!-- Pronunciation -->
                  <div class="space-y-2">
                    <h3 class="text-xs font-bold text-emerald-600 uppercase tracking-widest">উচ্চারণ</h3>
                    <p class="text-lg leading-relaxed">${esc(dua.content_pronunciation)}</p>
                  </div>
                  
                  <!-- Meaning -->
                  <div class="space-y-2">
                    <h3 class="text-xs font-bold text-amber-600 uppercase tracking-widest">অর্থ</h3>
                    <p class="text-lg leading-relaxed text-muted-foreground">${esc(dua.content)}</p>
                  </div>
                </div>
              </div>
              
              <!-- Virtues & Explanation -->
              ${dua.virtue ? `
                <div class="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-3xl p-6">
                  <h3 class="text-amber-700 dark:text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <span>✨</span> ফজিলত
                  </h3>
                  <p class="text-amber-900 dark:text-amber-100 italic leading-relaxed">
                    ${esc(dua.virtue)}
                  </p>
                  ${dua.virtue_reference ? `<p class="mt-4 text-xs text-amber-700/60">[রেফারেন্স: ${esc(dua.virtue_reference)}]</p>` : ''}
                </div>
              ` : ''}
              
              ${dua.explanation_bn ? `
                <div class="bg-card border border-border rounded-3xl p-6">
                  <h3 class="font-bold mb-3 flex items-center gap-2">
                    <span>📚</span> বিস্তারিত ব্যাখ্যা
                  </h3>
                  <div class="prose prose-emerald dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                    ${esc(dua.explanation_bn)}
                  </div>
                </div>
              ` : ''}
              
              <!-- Footer Reference -->
              <div class="text-center py-8 opacity-50 text-xs">
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
