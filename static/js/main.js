// ─────────────────────────────────────────────────────────────
// HandParticles - engine entrypoint
// ─────────────────────────────────────────────────────────────

import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs";

import { THEME_KEYS, DEFAULT_THEME } from './config.js';
import { audio } from './audio.js';
import { detectGesture, calcSpread, isFingerHeart, palmCenter, getVelocity } from './gestures.js';
import { fireballs, hearts, updateAndDrawEffects, sparkleBurst, drawHeartWireframe, Heart, Fireball } from './effects.js';
import { drawHand, drawConstellation, drawChargeOrb } from './render.js';
import { setupRecorder, captureScreenshot } from './recorder.js';

// --- Engine state ---
const video = document.getElementById('videoElement');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

let handLandmarker = null;
let currentTheme = DEFAULT_THEME;
let themeAutoRotate = true;
let frameCount = 0;
let framesThisSecond = 0;
let lastFpsTime = performance.now();
let isPaused = false;
let animFrameId = null;

// Fireball charge state
let prevHands = null;
let chargeAmount = 0;
let fullGrownFrames = 0;
let pendingFireballPos = null;
let throwCooldown = 0;

// Heart and peace state
let nextHeartSpawn = 0;
let heartCharges = [0, 0];
let nextSparkleAt = 0;

// Gesture display labels
const GESTURE_LABELS = {
    pinch: '🤏 Pinch',
    peace: '✌️ Peace',
    fist: '✊ Fist',
    open: '🖐 Open Hand',
};
function updateFps(now) {
    framesThisSecond++;
    if (now - lastFpsTime >= 1000) {
        const fps = Math.round(framesThisSecond / ((now - lastFpsTime) / 1000));
        document.getElementById('fps').textContent = fps;
        lastFpsTime = now;
        framesThisSecond = 0;
    }
}
