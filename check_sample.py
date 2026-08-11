import requests

url = "https://llicfiepatzgllmjhzbw.supabase.co/rest/v1/hadiths"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODA4MDksImV4cCI6MjA4NDA1NjgwOX0.T7xnXRSM2jx92gVH8Of1dePj609C7WKKflv2I_VZpy0",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODA4MDksImV4cCI6MjA4NDA1NjgwOX0.T7xnXRSM2jx92gVH8Of1dePj609C7WKKflv2I_VZpy0"
}
params = {
    "book_key": "eq.bukhari",
    "bengali": "not.is.null",
    "select": "hadith_number,arabic,bengali",
    "limit": 5
}
r = requests.get(url, headers=headers, params=params)
print(f"Status: {r.status_code}")
print(f"Data: {r.json()}")
