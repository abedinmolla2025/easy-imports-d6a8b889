import psycopg2
try:
    conn = psycopg2.connect(
        host="aws-0-ap-southeast-1.pooler.supabase.com",
        port=6543,
        user="postgres.llicfiepatzgllmjhzbw",
        password="Noorappa@1254914",
        dbname="postgres",
        options="-c search_path=public"
    )
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS quran_surahs (
            number INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            english_name TEXT NOT NULL,
            english_name_translation TEXT NOT NULL,
            number_of_ayahs INTEGER NOT NULL,
            revelation_type TEXT NOT NULL
        );
    """)
    cur.execute("ALTER TABLE quran_surahs ENABLE ROW LEVEL SECURITY;")
    cur.execute("DROP POLICY IF EXISTS \"Allow public read access\" ON quran_surahs;")
    cur.execute("CREATE POLICY \"Allow public read access\" ON quran_surahs FOR SELECT USING (true);")
    conn.commit()
    print("Table created successfully")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
