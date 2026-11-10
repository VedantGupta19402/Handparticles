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
    if (isCharging || chargeAmount >= 500) {
        if (isCharging) {
            const rubSpeed = v1.speed + v2.speed;
            chargeAmount += 1.0 + rubSpeed * 30.0;
        }
        chargeRadius = Math.min(500, chargeAmount * 1.5);
        chargePos = pendingFireballPos || { x: W / 2, y: H / 2 };

        if (chargeRadius >= 500) {
            fullGrownFrames++;
            if (fullGrownFrames > 180) { // ~3s at 60fps
                audio.play('fireball');
                const angle = Math.random() * Math.PI * 2;
                fireballs.push(new Fireball(chargePos.x, chargePos.y, Math.cos(angle) * 15, Math.sin(angle) * 15, chargeRadius));
                resetCharge();
                throwCooldown = 30;
                chargeRadius = 0;
                actionText = '🔥 AUTO THROW';
            } else {
                actionText = '🔥 FULLY CHARGED';
            }
        } else {
            fullGrownFrames = 0;
            actionText = '🔥 CHARGING';
        }

        // Flick both palms to hurl the orb
        if (isCharging && chargeAmount > 30 && throwCooldown === 0) {
            if (v1.speed > 0.05 && v2.speed > 0.05) {
                audio.play('fireball');
                let dx = (v1.vx + v2.vx) * W * 0.5;
                let dy = (v1.vy + v2.vy) * H * 0.5;
                if (Math.hypot(dx, dy) < 5) { dx = 0; dy = -15; }
                fireballs.push(new Fireball(chargePos.x, chargePos.y, dx, dy, Math.max(40, chargeRadius)));
                resetCharge();
                throwCooldown = 30;
                chargeRadius = 0;
                actionText = '🔥 MASSIVE FIREBALL';
            }
        }
    } else {
        resetCharge();
    }
    // Quick single-hand throw
    if (chargeAmount === 0 && hands.length === 1 && prevHands && prevHands.length === 1) {
        const c = palmCenter(hands[0]);
        const v = getVelocity(c, palmCenter(prevHands[0]));
        if (v.speed > 0.04 && throwCooldown === 0) {
            audio.play('fireball');
            fireballs.push(new Fireball(c.x * W, c.y * H, v.vx * W, v.vy * H, 60));
            throwCooldown = 20;
            actionText = '🔥 THROW';
        }
    }

    return { actionText, chargeRadius, chargePos };
}
function updateGestureUI(hands, actionText) {
    const gestEl = document.getElementById('gesture');
    gestEl.className = 'stat-value gesture-text';

    if (hands.length === 0) {
        gestEl.textContent = '—';
        return;
    }
    if (actionText) {
        gestEl.textContent = actionText;
        gestEl.classList.add('gesture-fire');
        return;
    }
    const key = detectGesture(hands[0]);
    gestEl.textContent = GESTURE_LABELS[key];
    gestEl.classList.add(`gesture-${key}`);
}
function processHandGestures(hands) {
    let makingHeart = false;

    hands.forEach((hand, i) => {
        drawHand(ctx, hand, i, currentTheme, frameCount);

        if (isFingerHeart(hand)) {
            heartCharges[i] = Math.min(60, (heartCharges[i] || 0) + 2);
            const progress = heartCharges[i] / 60;
            const hx = (hand[4].x + hand[8].x) / 2 * canvas.width;
            const hy = (hand[4].y + hand[8].y) / 2 * canvas.height;
            drawHeartWireframe(ctx, hx, hy, 40, progress);

            if (progress >= 1.0) {
                makingHeart = true;
                if (frameCount >= nextHeartSpawn) {
                    hearts.push(new Heart(hand[8].x * canvas.width, hand[8].y * canvas.height));
                    nextHeartSpawn = frameCount + 30 + Math.random() * 150;
                    audio.play('heart');
                }
            }
        } else {
            heartCharges[i] = Math.max(0, (heartCharges[i] || 0) - 5);
        }

        // Peace sign: sparkle shower from the fingertips
        if (detectGesture(hand) === 'peace' && frameCount >= nextSparkleAt) {
            const tip = hand[8];
            sparkleBurst(tip.x * canvas.width, tip.y * canvas.height);
            nextSparkleAt = frameCount + 45;
        }
    });

    return makingHeart;
}
function detectLoop() {
    if (!handLandmarker || video.readyState < 2 || isPaused) {
        animFrameId = requestAnimationFrame(detectLoop);
        return;
    }

    try {
        frameCount++;
        const now = performance.now();
        updateFps(now);

        const results = handLandmarker.detectForVideo(video, now);

        // Draw the mirrored video feed, then dim it so the neon pops
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const hands = (results.landmarks || []).map(hand => hand.map(lm => ({ ...lm, x: 1 - lm.x })));
        document.getElementById('handCount').textContent = hands.length;

        const fbData = processFireball(hands);

        if (hands.length > 0) {
            const makingHeart = processHandGestures(hands);
            if (hands.length === 2) drawConstellation(ctx, hands[0], hands[1], currentTheme);

            const spread = calcSpread(hands[0]);
            updateGestureUI(hands, makingHeart ? '💕 FINGER HEART' : fbData.actionText);
            document.getElementById('spread').textContent = Math.round(spread) + '%';
            audio.updateSound(spread, hands.length);
            prevHands = hands;
        } else {
            updateGestureUI(hands, null);
            document.getElementById('spread').textContent = '0%';
            audio.updateSound(0, 0);
            prevHands = null;
            if (frameCount >= nextHeartSpawn) nextHeartSpawn = frameCount;
        }

        // Lingering particles, hearts and fireballs always animate
        updateAndDrawEffects(ctx, canvas);

        // The charging orb persists even if the hands drop out
        if (fbData.chargeRadius > 0 && fbData.chargePos) {
            drawChargeOrb(ctx, fbData.chargePos.x, fbData.chargePos.y, fbData.chargeRadius);
        }

        animFrameId = requestAnimationFrame(detectLoop);
    } catch (err) {
        console.error('Error in detectLoop:', err);
        animFrameId = requestAnimationFrame(detectLoop);
    }
}
document.getElementById('startCameraBtn').addEventListener('click', async () => {
    const btn = document.getElementById('startCameraBtn');
    btn.textContent = 'Loading engine...';
    btn.disabled = true;
    try {
        audio.init();

        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        if (animFrameId) cancelAnimationFrame(animFrameId);

        const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm',
        );
        if (handLandmarker) handLandmarker.close();
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            document.getElementById('cameraOverlay').style.display = 'none';
            animFrameId = requestAnimationFrame(detectLoop);
        };
    } catch (err) {
        console.error(err);
        btn.textContent = 'Retry';
        btn.disabled = false;
    }
});
function setTheme(theme) {
    currentTheme = theme;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
}

let themeIdx = THEME_KEYS.indexOf(currentTheme);
setInterval(() => {
    if (!themeAutoRotate) return;
    themeIdx = (themeIdx + 1) % THEME_KEYS.length;
    setTheme(THEME_KEYS[themeIdx]);
}, 15000);

document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        themeAutoRotate = false;
        setTheme(btn.dataset.theme);
    });
});
const controlsContainer = document.createElement('div');
controlsContainer.className = 'controls-container';
document.body.appendChild(controlsContainer);

const recordBtn = document.getElementById('recordBtn');
controlsContainer.insertBefore(recordBtn, controlsContainer.firstChild);

const pauseBtn = document.createElement('button');
pauseBtn.className = 'control-btn';
pauseBtn.innerHTML = '⏸ Pause';
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused ? '▶️ Resume' : '⏸ Pause';
    pauseBtn.classList.toggle('active-pause', isPaused);
});
controlsContainer.appendChild(pauseBtn);

const muteBtn = document.createElement('button');
muteBtn.className = 'control-btn';
muteBtn.innerHTML = '🔇 Muted';
muteBtn.addEventListener('click', () => {
    const audible = audio.toggleMute();
    muteBtn.innerHTML = audible ? '🔊 Audio On' : '🔇 Muted';
    muteBtn.classList.toggle('active-audio', audible);
});
controlsContainer.appendChild(muteBtn);

const shotBtn = document.createElement('button');
shotBtn.className = 'control-btn';
shotBtn.innerHTML = '📸 Snapshot';
shotBtn.addEventListener('click', () => captureScreenshot(canvas));
controlsContainer.appendChild(shotBtn);

const killBtn = document.createElement('button');
killBtn.className = 'control-btn kill-btn';
killBtn.innerHTML = '🛑 Kill Server';
killBtn.addEventListener('click', () => {
    fetch('/kill', { method: 'POST' }).catch(() => {});
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    isPaused = true;
    document.getElementById('terminatedOverlay').style.display = 'flex';
});
controlsContainer.appendChild(killBtn);

setupRecorder({
    recordBtn,
    statusPill: document.getElementById('recordingStatusPill'),
    statusText: document.getElementById('recordingStatusText'),
    canvas,
});
// Keyboard shortcuts
window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();

    if (key === ' ') {
        event.preventDefault();
        pauseBtn.click();
    } else if (key === 'm') {
        muteBtn.click();
    } else if (key === 'r') {
        recordBtn.click();
    } else if (key === 's') {
        captureScreenshot(canvas);
    } else if (/^[0-9]$/.test(key)) {
        const idx = Number(key) - 1;
        if (idx >= 0 && idx < THEME_KEYS.length) {
            themeAutoRotate = false;
            setTheme(THEME_KEYS[idx]);
        }
    }
});

function resetCharge() {
    chargeAmount = 0;
    fullGrownFrames = 0;
    pendingFireballPos = null;
}
