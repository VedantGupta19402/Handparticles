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
| **Security** | HTTPS with adhoc SSL, no external data transmission |

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

Then open **https://localhost:5000** and click *Enable Camera*.

> ⚠️ Camera access requires a secure context, so the app serves itself over HTTPS with a self-signed certificate - accept the browser warning on first load.

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

Thresholds live in `static/js/config.js` (`PINCH_THRESHOLD`, `FIST_THRESHOLD`, `PEACE_MIN_GAP`) so you can tune them to your hand size and camera distance. The engine recieves a fresh landmark frame on every animation tick, so gesture changes register within a single frame.

---

