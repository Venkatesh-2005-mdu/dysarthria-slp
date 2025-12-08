from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/vowel")
async def analyze_vowel(file: UploadFile = File(...)):
    return {"status": "vowel analysis done"}
