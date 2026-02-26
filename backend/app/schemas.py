from pydantic import BaseModel

class JobInput(BaseModel):
    job_title: str
    job_description: str
    rating: float
    location: str
    size: str
    industry: str
    sector: str
    founded: int

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str