const SITE = "https://noorapp.in";

export default function handler(req, res) {
  const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NOOR - Prayer Times, Quran & More</title><meta name="description" content="Read authentic Quran, Hadith, Dua, prayer times, Qibla and Islamic stories in Bengali with Noor."><link rel="canonical" href="${SITE}/"><meta property="og:title" content="NOOR - Prayer Times, Quran & More"><meta property="og:description" content="Your Islamic Companion"><meta property="og:url" content="${SITE}/"></head><body><main><h1>NOOR</h1><p>Your Islamic Companion</p><nav><a href="/quran">Quran</a> <a href="/hadith">Hadith</a> <a href="/dua">Dua</a> <a href="/stories">Stories</a> <a href="/contact">Contact</a></nav></main></body></html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=300");
  return res.status(200).send(html);
}
