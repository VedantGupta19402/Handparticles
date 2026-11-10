# Handparticles

Real-time hand-tracked particle playground.
# 🖐 HandParticles

> A browser-based playground that turns your webcam into a particle instrument - track your hands, recognise gestures and paint neon effects in real time, powered by **MediaPipe (WASM) running entirely in your browser**.

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey?logo=flask)](https://flask.palletsprojects.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-0.10-orange)](https://mediapipe.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/VedantGupta19402/Handparticles?style=social)](https://github.com/VedantGupta19402/Handparticles)

---

## Overview

HandParticles streams your webcam through a fully client-side pipeline:

1. **Detects up to 2 hands** with MediaPipe Hand Landmarker (WASM, GPU-accelerated)
2. **Extracts 21 landmarks** per hand and classifies **5 gestures** (pinch, peace, fist, open hand, finger heart)
3. **Renders glowing neon wireframes** and a constellation web between both hands
4. **Spawns interactive effects** - fireballs charged by rubbing your palms, floating hearts, sparkle bursts
5. **Wraps it all in a glassmorphism UI** with live stats, 12 themes and video recording

All inference runs in-browser via WASM - no backend ML load, no video data leaving your device, full privacy.

---

## Features

| Feature | Details |
|---------|---------|
| 🖐 Hand tracking | Up to 2 hands, 21 landmarks each (MediaPipe WASM, GPU-accelerated) |
| 👌 Gesture recognition | Pinch, peace, fist, open hand and finger heart in real time |
| 📊 Hand spread metric | 0-100% spread from palm centre to fingertips, live in the HUD |
| 🌈 12 neon themes | Aurora, Cyberpunk, Rainbow, Lava, Ocean, Galaxy, Matrix, Frostbite, GoldenHour, Synthwave, NeonDemon, Ultraviolet |
| ✨ Constellation web | Lines between matching fingertips of both hands |
| 🔥 Fireballs | Charge via palm friction, auto-throw at full size, flick to hurl |

| 💕 Heart spawner | Hold a finger heart to spawn floating hearts with a particle burst on expiry |
| ✌️ Sparkle bursts | Peace sign showers aurora-coloured sparks from your fingertips |
| 🎙️ Reactive audio | Ambient drone synced to hand spread plus fireball/heart/sparkle SFX (Web Audio API) |
| 🎥 Video recording | Up to 60 seconds, MP4/WebM export with countdown and auto-save |
| 📸 Snapshots | One-click PNG capture of the current frame |
| ⌨️ Keyboard shortcuts | Themes on 1-9, Space to pause, M mute, S snapshot, R record |
| 🎛️ Live stats HUD | FPS, hand count, gesture and spread, updated every frame |
| 📱 Responsive | Mobile and desktop, portrait and landscape, glassmorphism UI |
| ⚡ Client-side only | All inference in-browser - zero backend ML load |
| 🩺 Health endpoint | `/health` liveness probe for containers and uptime checks |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.8+, Flask 3.0 (serves the UI and persists theme choice) |
| **Computer vision** | MediaPipe Hand Landmarker 0.10 (WASM, GPU delegate) |
| **Rendering** | HTML5 Canvas 2D |
| **Audio** | Web Audio API (fully procedural) |
| **Frontend** | HTML5, CSS3 glassmorphism, vanilla ES modules |
| **Security** | Plain HTTP on localhost (secure context), optional adhoc SSL, no external data transmission |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/VedantGupta19402/Handparticles.git
cd Handparticles

# 2. (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate      # Linux/macOS
# venv\Scripts\activate     # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
python app.py
```

Then open **http://localhost:5000** and click *Enable Camera*.

> 💡 The server runs plain HTTP by default - browsers treat `localhost` as a secure context, so camera access works with no certificate warning. To open the app from other devices on your LAN, run with `HANDPARTICLES_SSL=1` for HTTPS and accept the self-signed certificate warning there.

**Requirements:** Python 3.8+, a webcam and a modern browser. GPU is optional but recommended for higher FPS.

---

## Gestures

| Gesture | Trigger | Feedback |
|---------|---------|----------|
| **Pinch** 🤏 | Thumb tip to index tip within 6% of frame width | Pink label + indicator |
| **Peace** ✌️ | Index and middle up and apart, ring and pinky curled | Gold label + sparkle shower |
| **Fist** ✊ | All fingertips within 12% of palm | Orange label + bass tone |
| **Open hand** 🖐 | Default whenever the hand is neither pinched nor closed | Cyan label |
| **Finger heart** 💕 | Thumb and index close, pointing up, other fingers curled | Charge ring, then floating hearts |

Thresholds live in `static/js/config.js` (`PINCH_THRESHOLD`, `FIST_THRESHOLD`, `PEACE_MIN_GAP`) so you can tune them to your hand size and camera distance. The engine receives a fresh landmark frame on every animation tick, so gesture changes register within a single frame.

---

## Effects

| Effect | Activation | Behaviour |
|--------|-----------|-----------|
| **Fireball** 🔥 | Rub two palms together | Orb charges with friction, auto-throws at max size, flick both palms to hurl early |
| **Single-hand throw** 🔥 | Flick one open hand | Instant fireball projectile along the flick vector |
| **Floating hearts** 💕 | Hold the finger heart pose | Hearts drift up, bounce off walls, burst into particles on expiry |
| **Sparkle burst** ✨ | Peace sign | Aurora-coloured sparks spray from the index fingertip |
| **Constellation** 🕸 | Two hands visible | Web of light connects matching fingertips |

---

## Themes

Click any button in the right-hand rail to switch instantly, or press **1-9**. Themes auto-rotate every 15 seconds until you pick one manually.

| Theme | Palette |
|-------|---------|
| 🌠 Aurora | Spring green → cyan → violet (default) |
| 🌃 Cyberpunk | Neon pink + cyan |
| 🌈 Rainbow | Red, green, blue (hue-cycling) |
| 🔥 Lava | Red, orange, yellow |
| 🌊 Ocean | Aqua + sky blue |
| 🌌 Galaxy | Purple, magenta, white |
| 💻 Matrix | Neon green + dark green |
| ❄️ Frostbite | White, light blue, sky blue |
| 🌅 GoldenHour | Orange, gold, pink |
| 🕹️ Synthwave | Magenta, cyan, hot pink |
| 😈 NeonDemon | Deep red, crimson, light red |
| 🌀 Ultraviolet | Violet, lavender, pale lilac |

---

## Project Structure

```
handparticles/
├── app.py                    # Flask backend: UI, theme persistence, health, kill
├── requirements.txt          # Python dependencies
├── templates/
│   └── index.html            # Web UI: overlays, stats HUD, theme rail
├── static/
│   ├── style.css             # Glassmorphism styling and responsive layout
│   └── js/
│       ├── config.js         # Themes, thresholds, recording limits
│       ├── audio.js          # Procedural Web Audio engine
│       ├── gestures.js       # Gesture classification
│       ├── effects.js        # Particles, fireballs, hearts, sparkles
│       ├── render.js         # Neon wireframe rendering
│       ├── recorder.js       # Recording + snapshot export
│       └── main.js           # Engine entrypoint: loop, state, controls
├── .github/workflows/        # CI: python + docs checks
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE                   # MIT
└── README.md
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves `index.html` |
| `/get_theme` | GET | Returns the active theme and the list of available themes |
| `/update_theme` | POST | Persists a theme selection (JSON body: `{"theme": "Matrix"}`) |
| `/health` | GET | Liveness probe returning service status |
| `/kill` | POST | Disconnects the client session and releases the camera |

```bash
# Check the active theme
curl http://localhost:5000/get_theme

# Switch to Matrix
curl -X POST http://localhost:5000/update_theme \
  -H "Content-Type: application/json" \
  -d '{"theme": "Matrix"}'

# Liveness
curl http://localhost:5000/health
```

---

## Configuration

`static/js/config.js` - gesture thresholds and recording limits:

```javascript
export const PINCH_THRESHOLD = 0.06;
export const FIST_THRESHOLD  = 0.12;
export const PEACE_MIN_GAP   = 0.04;
export const RECORD_SECONDS   = 60;
export const RECORD_COUNTDOWN = 5;
```

`app.py` - server behaviour:

```python
app.run(debug=False, threaded=True, host='0.0.0.0', port=5000, ssl_context=None)  # set to 'adhoc' for HTTPS
```

For strict local-only access, change the host from `'0.0.0.0'` to `'127.0.0.1'`.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` - `9` | Switch theme |
| `Space` | Pause / resume |
| `M` | Mute / unmute |
| `S` | Snapshot to PNG |
| `R` | Start recording |

---

## Performance

| Metric | Typical value |
|--------|--------------|
| Target FPS | 30 |
| Achieved FPS | 25-30 (CPU), 30-60 (GPU delegate) |
| End-to-end latency | ~100-150ms |
| Resolution | 1280x720 (adjustable in `main.js`) |
| Browser memory | ~150-250MB (WASM model + runtime) |

Tips for smoother tracking:

- Use Chrome or Edge (best WASM + GPU delegate support)
- Ensure good, front-facing lighting - avoid backlit scenes
- Set `numHands: 1` in `main.js` if you only ever track one hand
- Lower camera resolution if your device struggles

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Camera permission denied | Use `http://localhost:5000` (localhost is a secure context). From other devices, run with `HANDPARTICLES_SSL=1` and accept the certificate warning |
| No hands detected | Improve lighting; lower `minHandDetectionConfidence` in `main.js` from 0.5 to 0.3 |
| Low FPS | Close background tabs; try Chrome; keep GPU acceleration enabled |
| Fireballs never appear | Bring both palms close and rub them; check both hands are detected |
| Audio silent | Click the mute button once - browsers require a gesture before audio starts |
| Recording saves as `.webm` | Your browser lacks an MP4 encoder; the file plays fine, only the extension is advisory |

## Roadmap

- [ ] More gestures (thumbs up, rock horns)
- [ ] Skeleton colour follows finger velocity
- [ ] WebGPU renderer
- [ ] Screenshot gallery in-app

## License

MIT - see [LICENSE](LICENSE).

## Acknowledgements

- [MediaPipe](https://mediapipe.dev/) by Google - hand landmark detection
- [Flask](https://flask.palletsprojects.com/) - the tiny bit of Python this needs
- The original GestEffect demo (MIT) that this project was rebuilt and extended from
