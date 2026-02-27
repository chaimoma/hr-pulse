import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
#paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(BASE_DIR, "data", "data_cleaned.csv")
model_dir = os.path.join(BASE_DIR, "ml", "models")
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, "salary_model.pkl")
#load data
df = pd.read_csv(data_path)
#combine text features
df["text"] = df["job_title"] + " " + df["job_description"]
#features / target
X = df[["text", "rating", "location", "size", "industry", "sector", "founded"]]
y = df["salary_avg"]
#preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ("text", TfidfVectorizer(max_features=10000, ngram_range=(1, 2)), "text"),
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["location", "size", "industry", "sector"]),
        ("num", StandardScaler(), ["rating", "founded"])
    ]
)
#model pipeline
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(
        n_estimators=200,
        max_depth=20,
        random_state=42
    ))
])
#train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
#train model
model.fit(X_train, y_train)
#evaluate
y_pred = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, y_pred))
print("MSE:", mean_squared_error(y_test, y_pred))
print("R²:", r2_score(y_test, y_pred))
#save model
joblib.dump(model, model_path)
print(f"Model saved at: {model_path}")