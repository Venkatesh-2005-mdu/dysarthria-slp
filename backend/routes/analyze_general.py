from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/general")
async def analyze_general(file: UploadFile = File(...)):
    return {"status": "general analysis done"}
