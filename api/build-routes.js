/**
 * Build dynamic routes for static site generation
 * Queries Supabase to enumerate all surahs, hadiths, duas, and stories
 * Outputs a JSON file with all routes that need prerendering
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function buildRoutes() {
  const routes = [
    // Static routes
    "/",
    "/quran",
    "/hadith",
    "/dua",
    "/stories",
    "/prayer-times",
    "/prayer-guide",
    "/qibla",
    "/tasbih",
    "/99-names",
    "/baby-names",
    "/calendar",
    "/quiz",
    "/about",
    "/contact",
    "/sources",
    "/data-sources",
    "/privacy-policy",
    "/terms",
    "/download",
    "/islamic-app",
  ];

  try {
    // Fetch all Quran surahs
    console.log("Fetching Quran surahs...");
    const { data: surahs, error: surahError } = await supabase
      .from("quran_surahs")
      .select("number")
      .order("number");
    
    if (surahError) throw surahError;
    
    if (surahs && surahs.length > 0) {
      surahs.forEach(s => {
        routes.push(`/quran/${s.number}`);
      });
      console.log(`✓ Added ${surahs.length} Quran surahs`);
    }

    // Fetch all Hadith chapters for each language
    console.log("Fetching Hadith chapters...");
    const { data: chapters, error: chapterError } = await supabase
      .from("hadith_chapters")
      .select("chapter_number")
      .eq("book_id", "bukhari")
      .order("chapter_number");
    
    if (chapterError) throw chapterError;
    
    if (chapters && chapters.length > 0) {
      const languages = ["bangla", "english", "urdu"];
      chapters.forEach(c => {
        languages.forEach(lang => {
          routes.push(`/hadith/sahih-bukhari/${lang}/chapter-${c.chapter_number}`);
        });
      });
      console.log(`✓ Added ${chapters.length * languages.length} Hadith chapter routes`);
    }

    // Fetch all Duas
    console.log("Fetching Duas...");
    const { data: duas, error: duaError } = await supabase
      .from("duas")
      .select("slug")
      .not("slug", "is", null);
    
    if (duaError) throw duaError;
    
    if (duas && duas.length > 0) {
      duas.forEach(d => {
        if (d.slug) routes.push(`/dua/${d.slug}`);
      });
      console.log(`✓ Added ${duas.length} Dua routes`);
    }

    // Fetch all Stories
    console.log("Fetching Stories...");
    const { data: stories, error: storyError } = await supabase
      .from("stories")
      .select("slug")
      .not("slug", "is", null);
    
    if (storyError) throw storyError;
    
    if (stories && stories.length > 0) {
      stories.forEach(s => {
        if (s.slug) routes.push(`/stories/${s.slug}`);
      });
      console.log(`✓ Added ${stories.length} Story routes`);
    }

    // Write routes to file
    const outputPath = path.join(process.cwd(), "dist", "routes.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
    
    console.log(`\n✅ Generated ${routes.length} total routes`);
    console.log(`📝 Routes written to: ${outputPath}`);
    
    return routes;
  } catch (error) {
    console.error("Error building routes:", error);
    process.exit(1);
  }
}

buildRoutes();
