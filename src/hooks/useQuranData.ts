import { useState, useEffect, useCallback } from "react";
import fallbackSurahs from "@/data/quran_surahs.json";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

const EDITIONS = {
  arabic: "ar.alafasy", // Arabic with audio
  bengali: "bn.bengali",
  english: "en.sahih",
  urdu: "ur.ahmedali",
  hindi: "hi.hindi",
  indonesian: "id.indonesian",
};

export type Language = keyof typeof EDITIONS;

export const LANGUAGE_LABELS: Record<Language, string> = {
  arabic: "العربية",
  bengali: "বাংলা",
  english: "English",
  urdu: "اردو",
  hindi: "हिंदी",
  indonesian: "Bahasa",
};

// Timeout helper with AbortController
async function fetchWithTimeout(url: string, options: any = {}, timeoutMs: number = 10000, retries: number = 1) {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (err: any) {
      clearTimeout(id);
      lastError = err;
      if (i < retries) {
        console.warn(`Retrying ${url} (${i + 1}/${retries}) due to error:`, err);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  throw lastError;
}

export const useQuranData = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithTimeout("https://api.alquran.cloud/v1/surah", {}, 10000, 1);
      const data = await response.json();
      if (data.code === 200) {
        setSurahs(data.data);
      } else {
        console.warn("API failed, using fallback surahs");
        setSurahs(fallbackSurahs as Surah[]);
      }
    } catch (err: any) {
      console.error("Fetch surahs failed, using fallback:", err);
      setSurahs(fallbackSurahs as Surah[]);
      // Don't set error state if we have fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  return { surahs, loading, error, retry: fetchSurahs };
};

export const useSurahDetail = (surahNumber: number, language: Language = "bengali") => {
  const [arabicData, setArabicData] = useState<SurahData | null>(null);
  const [translationData, setTranslationData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahData = useCallback(async () => {
    if (!surahNumber) return;
    setLoading(true);
    setError(null);
    
    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetchWithTimeout(`https://api.alquran.cloud/v1/surah/${surahNumber}/${EDITIONS.arabic}`, {}, 15000, 1),
        fetchWithTimeout(`https://api.alquran.cloud/v1/surah/${surahNumber}/${EDITIONS[language]}`, {}, 15000, 1),
      ]);

      const arabicJson = await arabicRes.json();
      const translationJson = await translationRes.json();

      if (arabicJson.code === 200) {
        setArabicData(arabicJson.data);
      }
      if (translationJson.code === 200) {
        setTranslationData(translationJson.data);
      }
      
      if (arabicJson.code !== 200 && translationJson.code !== 200) {
        setError("Failed to load surah content");
      }
    } catch (err: any) {
      setError(`Failed to load surah: ${err.message || 'Connection timeout'}`);
      console.error("Fetch surah detail failed:", err);
    } finally {
      setLoading(false);
    }
  }, [surahNumber, language]);

  useEffect(() => {
    fetchSurahData();
  }, [fetchSurahData]);

  return { arabicData, translationData, loading, error, retry: fetchSurahData };
};
