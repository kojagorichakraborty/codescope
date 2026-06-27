from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter()


@router.post("/upload")
async def upload_project(file: UploadFile = File(...)):

    upload_dir = "uploads"

    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Project uploaded successfully",
        "filename": file.filename
    }