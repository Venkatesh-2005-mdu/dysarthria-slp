from fastapi import FastAPI

# Import routers correctly (NO 'backend.' prefix)
from routes.analyze_general import router as general_router
from routes.analyze_vowel import router as vowel_router
from routes.process_pataka import router as pataka_router
from routes.phonation_test import router as phonation_router
from routes.sz_ratio import router as sz_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Register routes
app.include_router(general_router, prefix="/api/analyze")
app.include_router(vowel_router, prefix="/api/analyze")
app.include_router(pataka_router, prefix="/api/analyze")

# Phonation routes (only once)
app.include_router(phonation_router, prefix="/phonation")

# S/Z routes
app.include_router(sz_router, prefix="/api/sz")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "SLP Backend Running Successfully"}
