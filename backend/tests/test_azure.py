import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../app/.env"))

AZURE_KEY = os.getenv("api_key")
AZURE_ENDPOINT = os.getenv("endpoint")

def test_azure_key():
    assert AZURE_KEY, "AZURE_KEY is not set"
    assert AZURE_ENDPOINT, "AZURE_ENDPOINT is not set"

    client = TextAnalyticsClient(endpoint=AZURE_ENDPOINT, credential=AzureKeyCredential(AZURE_KEY))

    response = client.analyze_sentiment(documents=["Hello world"])
    assert response is not None
    print("Azure key is valid")