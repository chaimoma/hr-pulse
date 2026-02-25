import os
import time
import pandas as pd
from dotenv import load_dotenv
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
from tqdm import tqdm

load_dotenv()
ENDPOINT = os.getenv("endpoint")
KEY = os.getenv("api_key")
if not ENDPOINT or not KEY:
    raise ValueError("Azure credentials not found in .env")
def authenticate_client():
    return TextAnalyticsClient(
        endpoint=ENDPOINT,
        credential=AzureKeyCredential(KEY)
    )

def run_ner_extraction(data_path, output_path, limit=100):
    client = authenticate_client()
    df = pd.read_csv(data_path)

    df_subset = df.head(limit).copy()

    all_skills = []

    print(f"Extracting skills for {len(df_subset)} jobs using Azure NER...")

    for i, row in tqdm(df_subset.iterrows(), total=len(df_subset)):

        description = str(row["job_description"])[:1000]

        try:
            response = client.recognize_entities([description])
            doc = response[0]

            if not doc.is_error:
                skills = [
                    entity.text
                    for entity in doc.entities
                    if entity.category in ["Skill", "Product"]
                ]
                all_skills.append(", ".join(list(set(skills))))
            else:
                all_skills.append("")

        except Exception as e:
            print(f"\nError at row {i}: {e}")
            all_skills.append("")

        time.sleep(1.0) 
    df_subset["skills_extracted"] = all_skills
    df_subset.to_csv(output_path, index=False)

    print(f"\nExtraction complete → {output_path}")

if __name__ == "__main__":

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    data_path = os.path.join(BASE_DIR, "data", "data_cleaned.csv")
    output_path = os.path.join(BASE_DIR, "data", "jobs_with_skills.csv")

    run_ner_extraction(data_path, output_path, limit=100)