import requests
import json

# Fetch from API
print("Fetching surahs from API...")
r = requests.get("https://api.alquran.cloud/v1/surah")
if r.status_code != 200:
    print("Failed to fetch surahs")
    exit(1)
surahs = r.json()["data"]

# Prepare for Supabase
supabase_url = "https://llicfiepatzgllmjhzbw.supabase.co/rest/v1/quran_surahs"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ4MDgwOSwiZXhwIjoyMDg0MDU2ODA5fQ.23xidHUnJI60yovN5nh9-H7E40fm1aQqmgiSQOM4twE",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ4MDgwOSwiZXhwIjoyMDg0MDU2ODA5fQ.23xidHUnJI60yovN5nh9-H7E40fm1aQqmgiSQOM4twE",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

payload = []
for s in surahs:
    payload.append({
        "number": s["number"],
        "name": s["name"],
        "english_name": s["englishName"],
        "english_name_translation": s["englishNameTranslation"],
        "number_of_ayahs": s["numberOfAyahs"],
        "revelation_type": s["revelationType"]
    })

print(f"Inserting {len(payload)} surahs into Supabase...")
r = requests.post(supabase_url, headers=headers, data=json.dumps(payload))
print(f"Status: {r.status_code}")
if r.status_code not in [200, 201]:
    print(r.text)
