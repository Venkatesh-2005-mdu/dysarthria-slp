# AI Coding Agent Instructions for SLP Assessment Frontend

## Project Overview
A full-stack Speech-Language Pathology (SLP) assessment platform combining React frontend with Python FastAPI backend. The system enables clinicians to conduct audio-based speech assessments (phonation, respiratory, consonant patterns) with analysis pipelines for extracting clinical metrics.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with React Router v7 for navigation
- **Build Tool**: Vite (dev: `npm run dev`, build: `npm run build`)
- **Key Structure**: 
  - `src/pages/` contains assessment workflows (PhonationAssessment, RespiratoryAssessment)
  - `src/components/` holds reusable UI components (Button, Card, Input, Navbar)
  - Routing defined in `src/App.jsx` with routes: `/dashboard`, `/assessmenthome`, `/assess/respiratory`, `/assess/phonation`, etc.
- **Audio Handling**: 
  - Recording via `navigator.mediaDevices.getUserMedia()` (WebM format)
  - Direct fetch API calls to backend (no axios/http client library)
  - API Base: `http://localhost:8000`

### Backend (Python FastAPI)
- **Framework**: FastAPI with CORS middleware enabled (all origins allowed)
- **Port**: 8000
- **Route Organization**: `backend/routes/` split by feature:
  - `phonation_test.py`: `POST /phonation/upload/{vowel}` - phonation analysis
  - `analyze_vowel.py`: vowel analysis endpoints
  - `analyze_general.py`: general speech analysis
  - `process_pataka.py`: pataka consonant test
  - `sz_ratio.py`: S/Z duration ratio test
- **Prefix System**: Routes registered with prefixes:
  - `/api/analyze` → general, vowel, pataka analysis
  - `/phonation` → phonation-specific endpoints
  - `/api/sz` → S/Z ratio analysis
- **Audio Processing**: `backend/core/` modules handle:
  - `audio_utils.py`: file I/O, waveform extraction
  - `phonation_utils.py`: duration, waveform parsing
  - `pitch_utils.py`: F0 analysis
  - `vad.py`: voice activity detection
  - `speech_rate.py`: speech rate calculation

## Critical Patterns & Conventions

### Data Flow: Audio Assessment
1. **Frontend Records**: React component uses `MediaRecorder` to capture WebM blob
2. **Frontend Uploads**: FormData POST to `${API_BASE}/phonation/upload/{vowel}` or equivalent
3. **Backend Analyzes**: Route handler saves file to `uploads/` directory, extracts metrics via core modules
4. **Response Format**: Returns `{ vowel, duration_sec, sampling_rate, waveform: [...] }` JSON
5. **Frontend Displays**: Results state stored (e.g., `stateMap[itemId]`) with metrics and waveform rendering

### Frontend Component Patterns
- **State Management**: Local component state with `useState`, refs for MediaRecorder/stream
- **No Global State**: Each assessment page is self-contained (PhonationAssessment.jsx handles its own UI state)
- **Navigation**: `useNavigate()` hook for routing (e.g., `navigate("/dashboard")`)
- **Form Handling**: Controlled inputs with `handleChange` pattern + `handleSubmit`

### Backend Route Pattern
```python
from fastapi import APIRouter, UploadFile, File
router = APIRouter()
@router.post("/endpoint_path")
async def handler(vowel: str, audio: UploadFile = File(...)):
    # Save: save_audio(audio.file, path)
    # Analyze: extract_duration(path), get_waveform(path)
    return {...metrics...}
```

## Developer Workflows

### Setup
1. **Frontend**: `npm install` → `npm run dev` (runs on localhost:5173 via Vite)
2. **Backend**: Install requirements: `pip install -r backend/requirements.txt`
3. **Run Backend**: `python backend/app.py` or `uvicorn backend.app:app --reload` (port 8000)
4. Both must run simultaneously for full integration

### Linting & Formatting
- ESLint configured via `eslint.config.js` (uses @eslint/js, react plugin)
- Prettier integration via `package.json` lint-staged hooks
- Command: `npm run lint` (lints all JS/JSX files)

### Common Debugging
- **CORS Issues**: Backend has `CORSMiddleware` with `allow_origins=["*"]` - if frontend can't reach backend, verify both servers are running
- **Audio Upload Failures**: Check `backend/uploads/` directory exists; verify Content-Type headers in fetch payload
- **State Not Updating**: React components use `setStateMap(prev => ({ ...prev, [key]: val }))` pattern for nested state

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main routing configuration |
| `src/pages/Assessments/PhonationAssessment.jsx` | Vowel recording, upload, waveform display |
| `src/pages/Assessments/RespiratoryAssessment.jsx` | Form-based respiratory metrics (not audio-based) |
| `src/pages/Dashboard/Dashboard.jsx` | Clinician hub for patient/assessment navigation |
| `backend/app.py` | FastAPI app initialization, route registration, CORS setup |
| `backend/core/phonation_utils.py` | Audio metric extraction (duration, waveform) |
| `package.json` | Frontend deps + build scripts |
| `backend/requirements.txt` | Python deps (FastAPI, librosa, scipy, soundfile, etc.) |

## Important Quirks & Gotchas

1. **No Global Error Boundaries**: Error handling is minimal; audio permission denial not gracefully handled beyond state flag
2. **Upload Directory Auto-Creation**: `backend/routes/` assume `uploads/` dir exists - may fail silently if missing
3. **Frontend API Base**: Hardcoded to `http://localhost:8000` in PhonationAssessment.jsx; requires backend running locally
4. **Respiratory Assessment Incomplete**: RespiratoryAssessment.jsx currently only collects form input; no backend integration yet
5. **React Compiler Disabled**: Template comment notes React Compiler not enabled for perf reasons

## Testing & Validation
- No test suites present in workspace
- Manual browser testing via `npm run dev` + browser DevTools network tab
- Backend responses logged to console during PhonationAssessment recording

## Next Steps for Contributors
- Implement error handling for audio permission failures
- Add input validation on assessment forms before backend submission
- Create reusable API client utility (currently duplicated fetch patterns)
- Add unit tests for audio processing (Python) and form logic (React)
