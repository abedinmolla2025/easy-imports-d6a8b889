import requests
import json

url = "https://llicfiepatzgllmjhzbw.supabase.co/rest/v1/hadiths"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODA4MDksImV4cCI6MjA4NDA1NjgwOX0.T7xnXRSM2jx92gVH8Of1dePj609C7WKKflv2I_VZpy0",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaWNmaWVwYXR6Z2xsbWpoemJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODA4MDksImV4cCI6MjA4NDA1NjgwOX0.T7xnXRSM2jx92gVH8Of1dePj609C7WKKflv2I_VZpy0",
    "Prefer": "count=exact"
}

# Query 1: bengali is not null
params1 = {
    "book_key": "eq.bukhari",
    "bengali": "not.is.null",
    "select": "count"
}
r1 = requests.get(url, headers=headers, params=params1)
count1 = r1.headers.get("Content-Range", "0-0/0").split("/")[-1]

# Query 2: bengali is null
params2 = {
    "book_key": "eq.bukhari",
    "bengali": "is.null",
    "select": "count"
}
r2 = requests.get(url, headers=headers, params=params2)
count2 = r2.headers.get("Content-Range", "0-0/0").split("/")[-1]

print(f"Bengali not null: {count1}")
print(f"Bengali is null: {count2}")
