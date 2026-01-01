from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Import routers correctly (NO 'backend.' prefix)
from routes.analyze_general import router as general_router
from routes.analyze_vowel import router as vowel_router
from routes.process_pataka import router as pataka_router
from routes.phonation_test import router as phonation_router
from routes.sz_ratio import router as sz_router
from routes.rate_of_speech import router as rate_of_speech_router
from routes.articulation_screener import router as articulation_screener_router


app = FastAPI()

# Add CORS middleware FIRST (before route registration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(general_router, prefix="/api/analyze")
app.include_router(vowel_router, prefix="/api/analyze")
app.include_router(pataka_router, prefix="/api/analyze")
app.include_router(phonation_router, prefix="/phonation")
app.include_router(sz_router, prefix="/api/sz")
app.include_router(rate_of_speech_router, prefix="/api/analyze")
app.include_router(articulation_screener_router, prefix="/api/analyze")


@app.get("/")
def home():
    return {"message": "SLP Backend Running Successfully"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
