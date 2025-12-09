# Rate of Speech Assessment Page - Design Document

## 📋 Overview
The Rate of Speech Assessment evaluates how quickly a patient speaks by analyzing audio recordings of:
1. **Rainbow Passage Reading** - Standard passage for consistency
2. **Conversational Speech** - SLP-assigned topic for spontaneous speech

## 🎯 Page Layout & Structure

### Header Section
```
┌─────────────────────────────────────────────────────┐
│ Rate of Speech Assessment                           │
│ Analyze speech rate (words per minute)              │
└─────────────────────────────────────────────────────┘
```

### Main Content (Two Sections)

#### Section 1: Rainbow Passage Reading
```
┌────────────────────────────────────────────────────┐
│ 📖 Rainbow Passage Reading                         │
│ ──────────────────────────────────────────────────│
│                                                    │
│ Instructions:                                      │
│ "Please read the passage below at your normal     │
│  speaking rate."                                  │
│                                                    │
│ ┌────────────────────────────────────────────────┐│
│ │ The Rainbow Passage (Standard Text)             ││
│ │ ─────────────────────────────────────────────  ││
│ │ When the sunlight strikes raindrops in the     ││
│ │ air, they act like tiny prisms. The light      ││
│ │ is refracted, or bent, passing through each    ││
│ │ water droplet at a slightly different angle.   ││
│ │ This results in the rainbow effect we all      ││
│ │ know and love. [... continues ...]             ││
│ │                                                ││
│ │ [Text scrolls for full passage - 327 words]   ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ Recording Controls:                                │
│ ┌──────────────────┐  ┌──────────────────┐       │
│ │ 🎤 Start Record  │  │ ⏹️  Stop Record  │       │
│ │ 00:00 / -- sec   │  │ (disabled)        │       │
│ └──────────────────┘  └──────────────────┘       │
│                                                    │
│ Waveform Visualization:                           │
│ ┌──────────────────────────────────────────────┐ │
│ │ [Waveform Canvas - Real-time during rec]    │ │
│ │ Recording...                                 │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ ┌──────────────────────────────────────────────┐ │
│ │ 🔊 Play Recording │ 🗑️  Clear             │ │
│ │ (disabled until rec) │                      │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ Results Display (After Recording):                │
│ ┌──────────────────────────────────────────────┐ │
│ │ Duration: 45.2 seconds                       │ │
│ │ Total Words: 327                             │ │
│ │ Words Per Minute: 434 WPM                    │ │
│ │ Speaking Rate: ⚠️  FAST (>175 WPM typical)  │ │
│ │                                              │ │
│ │ Accuracy: 98% (if text-matching enabled)    │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ Clinical Notes:                                   │
│ ┌──────────────────────────────────────────────┐ │
│ │ Observations about rate, clarity, pacing:   │ │
│ │                                              │ │
│ │ [Text Area - SLP fills]                     │ │
│ │                                              │ │
│ │                                              │ │
│ └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

---

#### Section 2: Conversational Speech (Topic-Based)
```
┌────────────────────────────────────────────────────┐
│ 💬 Conversational Speech                           │
│ ──────────────────────────────────────────────────│
│                                                    │
│ Topic Assignment:                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ Topic: [Dropdown or text input by SLP]      │ │
│ │ 🔽 Select topic or enter custom...          │ │
│ │                                              │ │
│ │ Suggested Topics:                            │ │
│ │ • Favorite hobby                             │ │
│ │ • Describe a recent trip                     │ │
│ │ • Talk about family                          │ │
│ │ • Explain a favorite recipe                  │ │
│ │ • Share a memorable experience               │ │
│ │                                              │ │
│ │ Custom: [Text input field]                   │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ Instructions:                                      │
│ "Talk about the topic for approximately 1-2      │
│  minutes at your natural speaking rate."         │
│                                                    │
│ Recording Controls:                                │
│ ┌──────────────────┐  ┌──────────────────┐       │
│ │ 🎤 Start Record  │  │ ⏹️  Stop Record  │       │
│ │ 00:00            │  │ (disabled)        │       │
│ └──────────────────┘  └──────────────────┘       │
│                                                    │
│ Waveform Visualization:                           │
│ ┌──────────────────────────────────────────────┐ │
│ │ [Waveform Canvas - Real-time during rec]    │ │
│ │ Recording...                                 │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ ┌──────────────────────────────────────────────┐ │
│ │ 🔊 Play Recording │ 🗑️  Clear             │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ Results Display (After Recording):                │
│ ┌──────────────────────────────────────────────┐ │
│ │ Duration: 92.5 seconds (1:32)               │ │
│ │ Estimated Words: ~185 words                 │ │
│ │ Words Per Minute: 120 WPM                   │ │
│ │ Speaking Rate: ✓ NORMAL (100-150 WPM)      │ │
│ │ Pauses: 4 pauses detected                   │ │
│ │ Pause Duration: 3.2 seconds total           │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ Clinical Notes:                                   │
│ ┌──────────────────────────────────────────────┐ │
│ │ Observations about rate, fluency, pausing:  │ │
│ │                                              │ │
│ │ [Text Area - SLP fills]                     │ │
│ │                                              │ │
│ │                                              │ │
│ └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

---

### Footer/Action Section
```
┌────────────────────────────────────────────────────┐
│ ┌──────────────────┐      ┌──────────────────────┐│
│ │ ← Back           │      │ Save & Continue → │ ││
│ └──────────────────┘      └──────────────────────┘│
└────────────────────────────────────────────────────┘
```

---

## 📊 Data Structure

### State Management
```javascript
const [rainbowPassageRecording, setRainbowPassageRecording] = useState({
  recording: false,
  audioUrl: null,
  blob: null,
  duration: 0,
  waveform: [],
  samplingRate: 16000,
  metrics: {
    wordsPerMinute: null,
    totalWords: 327, // Fixed for rainbow passage
    speakingRate: null, // "SLOW", "NORMAL", "FAST"
    accuracy: null, // % of correct words
  }
});

const [conversationalSpeechRecording, setConversationalSpeechRecording] = useState({
  recording: false,
  audioUrl: null,
  blob: null,
  duration: 0,
  waveform: [],
  samplingRate: 16000,
  topic: "", // Selected or custom topic
  metrics: {
    wordsPerMinute: null,
    estimatedWords: null,
    speakingRate: null, // "SLOW", "NORMAL", "FAST"
    pauseCount: null,
    pauseDuration: null, // Total pause time
  }
});

const [impressions, setImpressions] = useState({
  rainbowPassageNotes: "",
  conversationalNotes: "",
});
```

---

## 🧮 WPM Calculation Logic

### Algorithm
```javascript
wordsPerMinute = (totalWords / durationInSeconds) * 60

// Rainbow Passage (Fixed 327 words)
// Example: 45 seconds = (327 / 45) * 60 = 436 WPM

// Conversational (Estimated via speech recognition or manual count)
// Example: 92.5 seconds, ~185 words = (185 / 92.5) * 60 = 120 WPM
```

### Speaking Rate Classification
```
SLOW:    < 100 WPM
NORMAL:  100-150 WPM
FAST:    > 150 WPM

(Can be customized per SLP preferences)
```

---

## 🔧 Backend Requirements

### POST `/api/analyze/rate-of-speech`
**Request:**
```json
{
  "type": "rainbow_passage" | "conversational",
  "audio_data": [float array],
  "sample_rate": 16000,
  "topic": "optional for conversational",
  "reference_word_count": 327 // for rainbow passage
}
```

**Response:**
```json
{
  "type": "rainbow_passage",
  "duration_sec": 45.2,
  "words_per_minute": 436,
  "speaking_rate": "FAST",
  "total_words": 327,
  "accuracy": 0.98,
  "sampling_rate": 16000,
  "waveform": [...]
}
```

---

## 🌈 The Rainbow Passage (327 words)

> When the sunlight strikes raindrops in the air, they act like tiny prisms. The light is refracted, or bent, passing through each water droplet at a slightly different angle. This results in the rainbow effect we all know and love.
>
> Rainbows appear in the sky only when the sun is behind the viewer and the rain is in front. They are also at an angle of 42 degrees from the vertical by definition of the rainbow's characteristics. Rainbow formation requires only sunshine and rain, along with the right angle of line of sight, so rainbows are usually also short-lived. They disappear once the sun gets too high or the rain ends.
>
> In some cases, a double rainbow can occur. This happens when light is reflected twice on the inside of the water droplet. If this occurs and the second arch's colors appear reversed from the original, the effect is called a secondary rainbow.
>
> Unless extremely rare circumstances allow for a third order rainbow to form, the secondary rainbow will have the most color of the two natural rainbow types. Rainbows have been a source of wonder for ages. In the Middle Ages, some scientists had already begun to study rainbows. Isaac Newton famously studied the light and learned to use a prism.

---

## 🎨 Color Scheme & Styling
- **Primary Blue:** #3b82f6 (buttons, accents)
- **Success Green:** #10b981 (normal/good rate)
- **Warning Amber:** #f59e0b (fast/slow rate)
- **Error Red:** #ef4444 (concerns)
- **Background:** Linear gradient #f3f8ff → #ffffff
- **Cards:** White with shadow, 16px border-radius

---

## ✨ Key Features

1. **Dual Recording Modes**
   - Rainbow Passage (structured, fixed text)
   - Conversational (flexible, topic-based)

2. **Real-time Metrics**
   - Duration tracking
   - Waveform visualization
   - Speech rate classification

3. **Clinical Notes**
   - Impression boxes for SLP feedback
   - Assessment of rate, fluency, pausing patterns

4. **Data-Driven Analysis**
   - WPM calculation from duration
   - Pause detection (for conversational)
   - Accuracy comparison (if text-to-speech available)

---

## 📱 Responsive Behavior
- **Desktop:** Two-column layout for both sections side-by-side
- **Tablet:** Single column, full-width sections
- **Mobile:** Stacked sections with smaller recording controls

---

## 🚀 Future Enhancements
- [ ] Automatic speech recognition (ASR) for word count
- [ ] Pause detection algorithm
- [ ] Pitch/intonation overlay on waveform
- [ ] Comparison with normative data by age/gender
- [ ] Export PDF report with graphs

