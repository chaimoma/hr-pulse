import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
DB_URL = os.getenv("DB_URL")
if not DB_URL:
    raise ValueError("DB_URL not found in .env file")

#db connection
engine = create_engine(DB_URL)
DATA_PATH = BASE_DIR.parent / "data" / "jobs_with_skills.csv"
def save_jobs_to_db():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"CSV not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} rows from CSV")
    df_to_save = df[["job_title", "skills_extracted"]].copy()
    df_to_save.insert(0, "id", range(1, len(df_to_save) + 1))
    df_to_save.to_sql(
        name="jobs",
        con=engine,
        if_exists="append",   
        index=False
    )
    print("✅ Data successfully saved to database (id, job_title, skills_extracted).")
if __name__ == "__main__":
    save_jobs_to_db()