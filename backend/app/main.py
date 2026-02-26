from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pathlib import Path
import joblib
import pandas as pd
from .database import Base, engine, get_db
from .models import User
from .schemas import UserCreate, UserLogin, JobInput
from .auth import hash_password,verify_password,create_access_token,verify_token

app = FastAPI(title="HR Pulse API")
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
DbDep = Depends(get_db)
#ML MODEL
BASE_DIR = Path(__file__).resolve().parents[2]
model_path = BASE_DIR / "ml" / "models" / "salary_model.pkl"
model = joblib.load(model_path)
#AUTH
@app.post("/register")
def register(user: UserCreate, db: Session = DbDep):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(400, "Username exists")
    new_user = User(
        username=user.username,
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    return {"message": "registered"}
@app.post("/login")
def login(user: UserLogin, db: Session = DbDep):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(
        user.password, db_user.password_hash
    ):
        raise HTTPException(400, "Invalid credentials")
    token = create_access_token({"sub": db_user.username})
    return {"access_token": token}
#PREDICT
@app.post("/predict")
def predict(job: JobInput, payload=Depends(verify_token)):
    text_value = f"{job.job_title} {job.job_description}"
    features = pd.DataFrame([{
        "text": text_value,
        "rating": job.rating,
        "location": job.location,
        "size": job.size,
        "industry": job.industry,
        "sector": job.sector,
        "founded": job.founded
    }])
    pred = model.predict(features)
    return {"predicted_salary": f"${pred[0]:,.2f}"}
#JOBS
@app.get("/jobs")
def get_jobs(db: Session = DbDep, payload=Depends(verify_token)):
    result = db.execute(
        text("SELECT id, job_title, skills_extracted FROM dbo.jobs")
    ).fetchall()
    return [
        {
            "id": row.id,
            "job_title": row.job_title,
            "skills_extracted": row.skills_extracted,
        }
        for row in result
    ]
@app.get("/jobs/search")
def search_jobs(skill: str,db: Session = DbDep,payload=Depends(verify_token)):
    result = db.execute(
        text(
            """
            SELECT id, job_title, skills_extracted
            FROM dbo.jobs
            WHERE skills_extracted LIKE :skill
            """
        ),
        {"skill": f"%{skill}%"},
    ).fetchall()
    return [
        {
            "id": row.id,
            "job_title": row.job_title,
            "skills_extracted": row.skills_extracted,
        }
        for row in result
    ]