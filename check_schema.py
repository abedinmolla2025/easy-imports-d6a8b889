import requests
import json

url = "https://llicfiepatzgllmjhzbw.supabase.co/rest/v1/"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODA4MDksImV4cCI6MjA4NDA1NjgwOX0.T7xnXRSM2jx92gVH8Of1dePj609C7WKKflv2I_VZpy0",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODA4MDksImV4cCI6MjA4NDA1NjgwOX0.T7xnXRSM2jx92gVH8Of1dePj609C7WKKflv2I_VZpy0"
}

def check_table(table):
    try:
        r = requests.get(url + table + "?limit=1", headers=headers)
        print(f"Table {table}: {r.status_code}")
        if r.status_code == 200:
            print(f"Sample data from {table}: {json.dumps(r.json(), indent=2)}")
        else:
            print(f"Error checking {table}: {r.text}")
    except Exception as e:
        print(f"Exception checking {table}: {e}")

tables = ["quran_surahs", "quran_ayahs", "hadith_books", "hadith_chapters", "hadiths", "duas", "stories"]
for t in tables:
    check_table(t)
