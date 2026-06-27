from fastapi import APIRouter, UploadFile, File
import os
import shutil
import zipfile
from app.services.analysis_service import analyze_repository

router = APIRouter()


@router.post("/upload")
async def upload_project(file: UploadFile = File(...)):

    upload_dir = "uploads"
    extract_dir = "uploads/extracted"

    os.makedirs(upload_dir, exist_ok=True)
    os.makedirs(extract_dir, exist_ok=True)

    zip_path = os.path.join(upload_dir, file.filename)

    with open(zip_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    project_name = file.filename.replace(".zip", "")

    project_extract_path = os.path.join(
        extract_dir,
        project_name
    )

    os.makedirs(project_extract_path, exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(project_extract_path)

    analysis_result = analyze_repository(
    project_extract_path
    )

    return {
        "message": "Analysis completed successfully",
        "project_name": project_name,
        "analysis": analysis_result
    }