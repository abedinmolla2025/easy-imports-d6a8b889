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
    tables = ['hadiths', 'hadith_chapters', 'hadith_books', 'admin_content']
    for table in tables:
        cur.execute(f"SELECT relrowsecurity FROM pg_class WHERE relname = '{table}';")
        res = cur.fetchone()
        rls = res[0] if res else "Unknown"
        
        cur.execute(f"SELECT policyname FROM pg_policies WHERE tablename = '{table}';")
        policies = cur.fetchall()
        
        print(f"Table: {table}, RLS: {rls}, Policies: {[p[0] for p in policies]}")
    
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
