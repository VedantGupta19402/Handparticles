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

