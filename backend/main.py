# backend.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import pandas as pd

app = FastAPI()

# Allowing CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/data")
async def get_data():
    df = pd.read_csv("data/arima_3_month_window.csv")
    return {"values": list(df["Units_Consumed"]),"months":list(df["Month"])}
