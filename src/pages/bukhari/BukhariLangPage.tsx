import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Search, ChevronRight, Loader2, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import BottomNavigation from "@/components/BottomNavigation";

// ── Types ────────────────────────────────────────────────────
type LangSlug = "bangla" | "english" | "urdu";

interface RawHadith {
  id: string;
  chapter_id: number;
  hadith_number: number;
  arabic: string;
  bengali?: string;
  english?: string;
  urdu?: string;
  slug?: string | null;
}

interface Hadith {
  id: string;
  chapterId: number;
  number: number;
  arabic: string;
  translation: string;
  slug?: string | null;
}

interface Chapter {
  id: number;
  count: number;
}

// ── UI strings ───────────────────────────────────────────────
const uiStrings = {
  bangla: {
    title: "সহিহ বুখারী শরীফ",
    subtitle: "আরবি + বাংলা অনুবাদ",
    searchPlaceholder: "হাদিস খুঁজুন...",
    chapters: "কিতাবসমূহ",
    allHadiths: "সকল হাদিস",
    hadithNo: "হাদিস নং",
    chapter: "কিতাব",
    hadiths: "টি হাদিস",
    loading: "হাদিস লোড হচ্ছে...",
    error: "ডাটা লোড করতে সমস্যা হয়েছে",
    noResults: "কোনো হাদিস পাওয়া যায়নি",
    loadMore: "আরও দেখুন",
    readDetails: "📖 বিস্তারিত পড়ুন",
  },
  english: {
    title: "Sahih Al-Bukhari",
    subtitle: "Arabic + English Translation",
    searchPlaceholder: "Search hadiths...",
    chapters: "Books (Kitab)",
    allHadiths: "All Hadiths",
    hadithNo: "Hadith No",
    chapter: "Book",
    hadiths: "Hadiths",
    loading: "Loading hadiths...",
    error: "Failed to load data",
    noResults: "No hadiths found",
    loadMore: "Load More",
    readDetails: "📖 Read full details",
  },
  urdu: {
    title: "صحیح البخاری",
    subtitle: "عربی + اردو ترجمہ",
    searchPlaceholder: "حدیث تلاش کریں...",
    chapters: "کتب",
    allHadiths: "تمام احادیث",
    hadithNo: "حدیث نمبر",
    chapter: "کتاب",
    hadiths: "احادیث",
    loading: "...احادیث لوڈ ہو رہی ہیں",
    error: "ڈیٹا لوڈ نہیں ہو سکا",
    noResults: "کوئی حدیث نہیں ملی",
    loadMore: "مزید لوڈ کریں",
    readDetails: "📖 تفصیل پڑھیں",
  },
} as const;

// ── Language config ──────────────────────────────────────────
interface LangCfg {
  source: "json" | "db";
  file?: string;
  dbField?: string;
  field: string;
  label: string;
  rtl: boolean;
}

const langMeta: Record<LangSlug, LangCfg> = {
  bangla: {
    source: "db",
    dbField: "bengali",
    field: "bengali",
    label: "বাংলা",
    rtl: false,
  },
  english: {
    source: "json",
    file: "/data/sahih_bukhari_en.json",
    field: "english",
    label: "English",
    rtl: false,
  },
  urdu: {
    source: "json",
    file: "/data/sahih_bukhari_ur.json",
    field: "urdu",
    label: "اردو",
    rtl: true,
  },
};

// ── DB chapter (Kitab) names type ────────────────────────────
interface KitabInfo {
  chapter_number: number;
  title: string;
  title_bn: string | null;
  title_ar: string | null;
  hadith_count: number;
}

function getChapterName(chapterId: number, lang: LangSlug, kitabMap: Map<number, KitabInfo>): string {
  const kitab = kitabMap.get(chapterId);
  if (kitab) {
    if (lang === "bangla") return kitab.title_bn || kitab.title;
    if (lang === "urdu") return kitab.title_ar || kitab.title;
    return kitab.title;
  }
  const fallback = { bangla: "কিতাব", english: "Book", urdu: "کتاب" };
  return `${fallback[lang]} ${chapterId}`;
}

// ── Lang-specific SEO helpers ────────────────────────────────
const langSeoMeta: Record<LangSlug, { rootTitle: string; rootDesc: string; titleLang: string; descLang: string }> = {
  bangla: {
    rootTitle: "Sahih Bukhari Bangla Hadith – সহীহ বুখারী বাংলা হাদিস | Noor App",
    rootDesc: "Read Sahih Bukhari Bangla Hadith with Arabic text and authentic Bangla translation.",
    titleLang: "Bangla",
    descLang: "Bangla",
  },
  english: {
    rootTitle: "Sahih Bukhari English Hadith Collection | Noor App",
    rootDesc: "Read authentic Sahih Bukhari hadith collection with Arabic and English translation.",
    titleLang: "English",
    descLang: "English",
  },
  urdu: {
    rootTitle: "Sahih Bukhari Urdu Hadith – صحیح بخاری اردو | Noor App",
    rootDesc: "صحیح بخاری احادیث اردو ترجمہ کے সাথে پڑھیں۔",
    titleLang: "Urdu",
    descLang: "Urdu",
  },
};

function buildSeoTitle(slug: LangSlug, chapterId?: number, hadithNumber?: number): string {
  const l = langSeoMeta[slug] || langSeoMeta.bangla;
  if (hadithNumber != null) {
    return `Sahih Bukhari Hadith ${hadithNumber} – ${l.titleLang} Translation – Noor App`;
  }
  if (chapterId != null) {
    return `Sahih Bukhari Book ${chapterId} – ${l.titleLang} – Noor App`;
  }
  return l.rootTitle;
}

function buildSeoDesc(slug: LangSlug, chapterId?: number, hadithNumber?: number): string {
  const l = langSeoMeta[slug] || langSeoMeta.bangla;
  if (hadithNumber != null) {
    return `Read Sahih Bukhari Hadith ${hadithNumber} with Arabic text and ${l.descLang} translation on Noor App.`;
  }
  if (chapterId != null) {
    return `Browse all hadiths in Book ${chapterId} of Sahih Bukhari with Arabic text and ${l.descLang} translation.`;
  }
  return l.rootDesc;
}

function buildCanonical(slug: string, chapterId?: number, hadithNumber?: number): string {
  const base = `https://noorapp.in/hadith/sahih-bukhari/${slug}`;
  if (hadithNumber != null && chapterId != null) {
    return `${base}/${chapterId}/${hadithNumber}`;
  }
  if (chapterId != null) {
    return `${base}/chapter-${chapterId}`;
  }
  return base;
}

function buildArticleJsonLd(slug: LangSlug, hadithNumber?: number) {
  const l = langSeoMeta[slug] || langSeoMeta.bangla;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: hadithNumber
      ? `Sahih Bukhari Hadith ${hadithNumber} – ${l.titleLang}`
      : `Sahih Bukhari ${l.titleLang} Hadith Collection`,
    author: {
      "@type": "Person",
      name: "Imam Bukhari",
    },
    publisher: {
      "@type": "Organization",
      name: "Noor App",
      url: "https://noorapp.in",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildCanonical(slug, undefined, hadithNumber),
    },
  };
}

// ── Flatten book_1, book_2 … into a single array ─────────────
function flattenBooks(json: Record<string, RawHadith[]>): RawHadith[] {
  const all: RawHadith[] = [];
  const keys = Object.keys(json).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
  });
  for (const key of keys) {
    if (Array.isArray(json[key])) all.push(...json[key]);
  }
  return all;
}

// ── Load from database (Bangla) ──────────────────────────────
// Load hadiths by chapter for faster initial rendering
async function loadChapterFromDb(dbField: string, chapterId: number): Promise<Hadith[]> {
  const { data, error } = await (supabase as any)
    .from("hadiths")
    .select("id, chapter_id, hadith_number, arabic, slug, " + dbField)
    .eq("book_key", "bukhari")
    .eq("chapter_id", chapterId)
    .not(dbField, "is", null)
    .order("hadith_number", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((row: any) => ({
    id: row.id,
    chapterId: row.chapter_id,
    number: row.hadith_number,
    arabic: row.arabic,
    translation: row[dbField],
    slug: row.slug ?? null,
  }));
}

// Load all hadiths from DB using pagination to avoid the 1000 row limit
async function loadFromDb(dbField: string, search: string = ""): Promise<Hadith[]> {
  let allRows: any[] = [];
  let from = 0;
  const step = 1000;
  
  while (true) {
    let query = (supabase as any)
      .from("hadiths")
      .select("id, chapter_id, hadith_number, arabic, slug, " + dbField)
      .eq("book_key", "bukhari")
      .not(dbField, "is", null)
      .order("chapter_id", { ascending: true })
      .order("hadith_number", { ascending: true })
      .range(from, from + step - 1);

    if (search) {
      query = query.ilike(dbField, `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) break;

    allRows = [...allRows, ...data];
    if (data.length < step) break;
    from += step;
  }

  return allRows.map((row: any) => ({
    id: row.id,
    chapterId: row.chapter_id,
    number: row.hadith_number,
    arabic: row.arabic,
    translation: row[dbField],
    slug: row.slug ?? null,
  }));
}

// ── Pagination ───────────────────────────────────────────────
const PAGE_SIZE = 40;

// ── Component ───────────────────────────────────────────────
export default function BukhariLangPage() {
  const { lang, chapterSlug, chapterId: chapterParam, hadithNumber: hadithParam } = useParams<{
    lang: string;
    chapterSlug: string;
    chapterId: string;
    hadithNumber: string;
  }>();
  // chapterSlug is used for /hadith/sahih-bukhari/:lang/:chapterSlug (e.g. "chapter-5")
  // chapterId is used for /hadith/sahih-bukhari/:lang/:chapterId/:hadithNumber
  const effectiveChapterParam = chapterSlug || chapterParam;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"chapters" | "hadiths">(
    effectiveChapterParam ? "hadiths" : "chapters"
  );
  const [page, setPage] = useState(1);

  const [allHadiths, setAllHadiths] = useState<Hadith[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = (lang as LangSlug) || "bangla";
  const cfg = langMeta[slug] ?? langMeta.bangla;
  const t = uiStrings[slug] ?? uiStrings.bangla;
  const isRtl = cfg.rtl;

  // ── Fetch Kitab names from DB ──────────────────────────────
  const { data: kitabData } = useQuery({
    queryKey: ["bukhari-kitabs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hadith_chapters")
        .select("chapter_number, title, title_bn, title_ar, hadith_count")
        .eq("book_id", "bukhari")
        .order("chapter_number");
      if (error) throw error;
      return data as KitabInfo[];
    },
    staleTime: Infinity,
  });

  const kitabMap = useMemo(() => {
    const m = new Map<number, KitabInfo>();
    if (kitabData) {
      for (const k of kitabData) {
        // Manual fix for Chapter 97 title if it's wrong in DB
        if (k.chapter_number === 97 && (!k.title_bn || k.title_bn.includes("হারানো"))) {
          m.set(97, { ...k, title: "Tawheed", title_bn: "তাওহীদ (আল্লাহর একত্ববাদ)", hadith_count: 188 });
        } else {
          m.set(k.chapter_number, k);
        }
      }
    }
    return m;
  }, [kitabData]);

  // ── Load data ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    setError(null);

    const processHadiths = (mapped: Hadith[]) => {
      if (cancelled) return;
      setAllHadiths(mapped);
      
      // Derive chapters from kitabData if available, otherwise from hadiths
      let chapArr: Chapter[] = [];
      if (kitabData && kitabData.length > 0) {
        chapArr = kitabData.map(k => ({ id: k.chapter_number, count: k.hadith_count }));
      } else {
        const chapMap = new Map<number, number>();
        for (const h of mapped) chapMap.set(h.chapterId, (chapMap.get(h.chapterId) || 0) + 1);
        chapArr = Array.from(chapMap.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([id, count]) => ({ id, count }));
      }
      
      setChapters(prev => prev.length > 0 ? prev : chapArr);
      setLoading(false);
    };

    // Debounced search logic
    const timer = setTimeout(() => {
      if (cfg.source === "db") {
        if (selectedChapter) {
          loadChapterFromDb(cfg.dbField || "bengali", selectedChapter)
            .then(processHadiths)
            .catch((err) => {
              if (cancelled) return;
              console.error("Chapter load failed:", err);
              setError(t.error);
              setLoading(false);
            });
        } else {
          loadFromDb(cfg.dbField || "bengali", searchQuery)
            .then(processHadiths)
            .catch((err) => {
              if (cancelled) return;
              console.error("DB load failed:", err);
              setError(t.error);
              setLoading(false);
            });
        }
      } else {
        // JSON source (English/Urdu)
        fetch(cfg.file!)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then((json: Record<string, RawHadith[]>) => {
            const raw = flattenBooks(json);
            const field = cfg.field;
            const mapped: Hadith[] = raw
              .filter((h) => h.arabic && (h as any)[field])
              .map((h) => ({
                id: h.id,
                chapterId: h.chapter_id,
                number: h.hadith_number,
                arabic: h.arabic,
                translation: (h as any)[field],
                slug: h.slug ?? null,
              }));
            processHadiths(mapped);
          })
          .catch((err) => {
            if (cancelled) return;
            console.error("Fetch failed:", err);
            setError(t.error);
            setLoading(false);
          });
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cfg, selectedChapter, searchQuery, kitabData]);

  // ── Sync from URL ──────────────────────────────────────────
  useEffect(() => {
    if (effectiveChapterParam) {
      const match = effectiveChapterParam.match(/chapter-(\d+)/);
      if (match) {
        setSelectedChapter(parseInt(match[1], 10));
        setActiveTab("hadiths");
      } else if (!isNaN(parseInt(effectiveChapterParam, 10))) {
        setSelectedChapter(parseInt(effectiveChapterParam, 10));
        setActiveTab("hadiths");
      }
    } else {
      setSelectedChapter(null);
      setActiveTab("chapters");
    }

    if (hadithParam) {
      const num = parseInt(hadithParam, 10);
      const h = allHadiths.find((x) => x.number === num);
      if (h) setSelectedHadith(h);
    } else {
      setSelectedHadith(null);
    }
  }, [effectiveChapterParam, hadithParam, allHadiths]);

  // ── Derived state ──────────────────────────────────────────
  const filteredHadiths = useMemo(() => {
    let list = allHadiths;
    if (selectedChapter) {
      list = list.filter((h) => h.chapterId === selectedChapter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.number.toString().includes(q) ||
          h.translation.toLowerCase().includes(q) ||
          h.arabic.includes(q)
      );
    }
    return list;
  }, [allHadiths, selectedChapter, searchQuery]);

  const pagedHadiths = useMemo(() => {
    return filteredHadiths.slice(0, page * PAGE_SIZE);
  }, [filteredHadiths, page]);

  const totalCount = filteredHadiths.length;

  // ── Handlers ───────────────────────────────────────────────
  const handleChapterClick = (id: number) => {
    setSelectedChapter(id);
    setActiveTab("hadiths");
    setPage(1);
    navigate(`/hadith/sahih-bukhari/${slug}/chapter-${id}`);
  };

  const handleBack = () => {
    if (selectedHadith) {
      setSelectedHadith(null);
      navigate(`/hadith/sahih-bukhari/${slug}/chapter-${selectedChapter}`);
    } else if (selectedChapter) {
      setSelectedChapter(null);
      setActiveTab("chapters");
      navigate(`/hadith/sahih-bukhari/${slug}`);
    } else {
      navigate("/hadith");
    }
  };

  const handleReadDetails = (h: Hadith) => {
    if (h.slug) {
      navigate(`/hadith/h/${h.slug}`);
    } else {
      navigate(`/hadith/sahih-bukhari/${slug}/${h.chapterId}/${h.number}`);
    }
  };

  // ── Render Helpers ──────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1a1a] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#10b981] rounded-full text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1a1a] text-white pb-24">
      <Helmet>
        <title>{buildSeoTitle(slug, selectedChapter || undefined, selectedHadith?.number)}</title>
        <meta name="description" content={buildSeoDesc(slug, selectedChapter || undefined, selectedHadith?.number)} />
        <link rel="canonical" href={buildCanonical(slug, selectedChapter || undefined, selectedHadith?.number)} />
        {/* JSON-LD for Hadith Article */}
        <script type="application/ld+json">
          {JSON.stringify(buildArticleJsonLd(slug, selectedHadith?.number))}
        </script>
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a1a1a]/80 backdrop-blur-md border-b border-white/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">
              {selectedChapter ? getChapterName(selectedChapter, slug, kitabMap) : t.title}
            </h1>
            <p className="text-xs text-[#10b981] font-medium">{t.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search & Tabs */}
        {!selectedHadith && (
          <div className="space-y-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="bg-white/5 border-white/10 pl-10 h-12 rounded-xl focus:ring-[#10b981] transition-all"
              />
            </div>

            <div className="flex p-1 bg-white/5 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab("chapters");
                  setSelectedChapter(null);
                  navigate(`/hadith/sahih-bukhari/${slug}`);
                }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "chapters" ? "bg-[#10b981] text-white shadow-lg" : "text-white/60 hover:text-white"
                }`}
              >
                {t.chapters}
              </button>
              <button
                onClick={() => setActiveTab("hadiths")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "hadiths" ? "bg-[#10b981] text-white shadow-lg" : "text-white/60 hover:text-white"
                }`}
              >
                {t.allHadiths} ({totalCount})
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#10b981] animate-spin" />
            <p className="text-white/60 animate-pulse">{t.loading}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {selectedHadith ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="px-4 py-1.5 bg-[#10b981]/20 text-[#10b981] rounded-full text-sm font-bold border border-[#10b981]/30">
                      {t.hadithNo} {selectedHadith.number}
                    </span>
                    <span className="text-white/40 text-sm font-medium">
                      {t.chapter} {selectedHadith.chapterId}
                    </span>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <p
                        className="text-3xl md:text-4xl leading-[1.8] text-right font-arabic"
                        dir="rtl"
                      >
                        {selectedHadith.arabic}
                      </p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="space-y-4">
                      <p
                        className={`text-lg md:text-xl leading-relaxed text-white/90 ${
                          isRtl ? "text-right font-arabic" : ""
                        }`}
                        dir={isRtl ? "rtl" : "ltr"}
                      >
                        {selectedHadith.translation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === "chapters" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {chapters.map((chap) => (
                  <button
                    key={chap.id}
                    onClick={() => handleChapterClick(chap.id)}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] font-bold group-hover:bg-[#10b981] group-hover:text-white transition-colors">
                      {chap.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate group-hover:text-[#10b981] transition-colors">
                        {getChapterName(chap.id, slug, kitabMap)}
                      </h3>
                      <p className="text-xs text-white/40">
                        {chap.count} {t.hadiths}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#10b981] transition-colors" />
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {pagedHadiths.length > 0 ? (
                  <>
                    {pagedHadiths.map((h) => (
                      <div
                        key={h.id}
                        className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-[#10b981]/50 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-[#10b981] px-2 py-1 bg-[#10b981]/10 rounded-lg">
                            {t.hadithNo} {h.number}
                          </span>
                          <span className="text-[10px] text-white/30 uppercase tracking-wider">
                            {getChapterName(h.chapterId, slug, kitabMap)}
                          </span>
                        </div>
                        <p
                          className="text-xl leading-[1.8] text-right mb-4 font-arabic line-clamp-2 text-white/60"
                          dir="rtl"
                        >
                          {h.arabic}
                        </p>
                        <p
                          className={`text-sm leading-relaxed line-clamp-3 text-white/80 mb-4 ${
                            isRtl ? "text-right font-arabic" : ""
                          }`}
                          dir={isRtl ? "rtl" : "ltr"}
                        >
                          {h.translation}
                        </p>
                        <button
                          onClick={() => handleReadDetails(h)}
                          className="w-full py-2.5 bg-white/5 hover:bg-[#10b981] text-white/60 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          {t.readDetails}
                        </button>
                      </div>
                    ))}
                    {totalCount > pagedHadiths.length && (
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        className="w-full py-4 bg-[#10b981]/10 hover:bg-[#10b981] text-[#10b981] hover:text-white rounded-2xl font-bold transition-all border border-[#10b981]/20"
                      >
                        {t.loadMore}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40">{t.noResults}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
