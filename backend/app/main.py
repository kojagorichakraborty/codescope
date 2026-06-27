from fastapi import FastAPI

from app.routers.analysis import router as analysis_router

app = FastAPI()

app.include_router(analysis_router)


@app.get("/")
def home():
    return {"message": "Welcome to CodeScope"}