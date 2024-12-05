import json
import psycopg2
from keybert import KeyBERT
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": os.getenv("POSTGRES_HOST"),
    "port": os.getenv("POSTGRES_PORT")
}

kw_model = KeyBERT()

def extract_keywords(text, top_n=5):
    if text:
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=top_n)
        return [kw[0] for kw in keywords]
    return []


def load_json_lines(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = []
        for line_number, line in enumerate(file, 1):
            try:
                line = line.strip()
                if line: 
                    json_object = json.loads(line) 
                    data.append(json_object)
            except json.JSONDecodeError as e:
                print(f"Помилка при розборі рядка {line_number}: {e}")
        return data


def insert_into_postgres(data, conn):
    query = """
    INSERT INTO "Publications" (source, id_from_source, title, doi, abstract, keywords, authors, journal_ref, year)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    with conn.cursor() as cursor:
        for record in data:
            cursor.execute(query, (
                record["source"],
                record["id_from_source"],
                record["title"],
                record["doi"],
                record["abstract"],
                record["keywords"],
                record["authors"],
                record["journal_ref"],
                record["year"]
            ))
        conn.commit()

def process_data(json_data, source_name):
    processed_data = []
    for record in json_data:

        abstract = record.get("abstract", "").strip()
        if not record.get("id") or not record.get("title") or not abstract:
            print(f"Пропущено запис через відсутність id, title або abstract: {record}")
            continue
        
        keywords = extract_keywords(abstract) if abstract else []
        
        update_date = record.get("update_date")
        year = None
        if update_date:
            try:
                year = datetime.strptime(update_date, '%Y-%m-%d').year
            except ValueError:
                print(f"Невірний формат дати: {update_date} для id: {record.get('id')}")
                continue

        authors = ", ".join(author[1] + " " + author[0] for author in record.get("authors_parsed", [])) if record.get("authors_parsed") else ""
        
        processed_data.append({
            "source": source_name,
            "id_from_source": record.get("id"),
            "title": record.get("title"),
            "doi": record.get("doi"),
            "abstract": abstract,
            "keywords": keywords,
            "authors": authors,
            "journal_ref": record.get("journal-ref"),
            "year": year
        })
    
    return processed_data

def main():
    json_file_path = r"D:\example_path\part1_arxiv.json"
    
    json_data = load_json_lines(json_file_path)
    
    processed_data = process_data(json_data, source_name="arXiv")
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        insert_into_postgres(processed_data, conn) 
        print("Дані успішно вставлені в базу даних!")
    except Exception as e:
        print(f"Помилка під час вставки даних: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
