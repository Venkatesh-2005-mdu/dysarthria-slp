from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/pataka")
async def process_pataka(file: UploadFile = File(...)):
    return {"status": "pataka analysis done"}
