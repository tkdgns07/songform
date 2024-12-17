import pandas as pd
import psycopg2

# PostgreSQL 연결 정보
DATABASE_URL = "postgres://default:ENotkm0bP4dg@ep-frosty-unit-a1kzromj-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require"

# CSV 파일 경로
csv_file_path = "students-info.csv"

try:
    # PostgreSQL 연결
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("Connected to the database.")

    # 데이터베이스의 모든 테이블 가져오기
    print("\nAvailable tables in the database:")
    cursor.execute("""
        SELECT schemaname, tablename 
        FROM pg_catalog.pg_tables 
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
    """)
    tables = cursor.fetchall()
    for schema, table in tables:
        print(f"- {schema}.{table}")

    # 테이블의 모든 데이터 삭제
    cursor.execute('DELETE FROM "Students";')  # 대소문자 구분
    conn.commit()  # 변경 사항 저장
    print("\nAll records deleted from the Students table.")

    # CSV 파일 읽기
    df = pd.read_csv(csv_file_path)

    # 데이터 삽입 쿼리
    insert_query = """
    INSERT INTO "Students" (id, name, grade, birthday)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (id) DO NOTHING; -- 중복 ID는 무시
    """

    # 데이터 삽입
    for index, row in df.iterrows():
        cursor.execute(insert_query, (row['id'], row['name'], row['grade'], row['birthday']))
    
    # 변경 사항 저장
    conn.commit()
    print("CSV data inserted into the Students table successfully.")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # 연결 종료
    if cursor:
        cursor.close()
    if conn:
        conn.close()
