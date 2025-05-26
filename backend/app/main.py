from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import convert, predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://cavity-catcher.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(convert.router)
app.include_router(predict.router)