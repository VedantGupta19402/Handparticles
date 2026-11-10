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
function processFireball(hands) {
    const W = canvas.width;
    const H = canvas.height;
    if (throwCooldown > 0) throwCooldown--;

    let actionText = null;
    let chargeRadius = 0;
    let chargePos = null;
    let isCharging = false;
    let v1 = { vx: 0, vy: 0, speed: 0 };
    let v2 = { vx: 0, vy: 0, speed: 0 };

    // Two palms close together rub a charge into existence
    if (hands.length === 2 && prevHands && prevHands.length === 2) {
        const c1 = palmCenter(hands[0]);
        const c2 = palmCenter(hands[1]);
        if (Math.hypot(c1.x - c2.x, c1.y - c2.y) < 0.4) {
            isCharging = true;
            v1 = getVelocity(c1, palmCenter(prevHands[0]));
            v2 = getVelocity(c2, palmCenter(prevHands[1]));
            pendingFireballPos = { x: (c1.x + c2.x) / 2 * W, y: (c1.y + c2.y) / 2 * H };
        }
    }
