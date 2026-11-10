// ─────────────────────────────────────────────────────────────
// HandParticles - gesture classification from hand landmarks
// ─────────────────────────────────────────────────────────────

import { PINCH_THRESHOLD, FIST_THRESHOLD, PEACE_MIN_GAP, FINGER_TIPS, PALM_INDEX } from './config.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const fingerExtended = (lm, tip, pip) => lm[tip].y < lm[pip].y;
export function isPinch(lm) {
    return dist(lm[4], lm[8]) < PINCH_THRESHOLD;
}

export function isFist(lm) {
    const palm = lm[PALM_INDEX];
    const maxReach = Math.max(...FINGER_TIPS.map(i => dist(palm, lm[i])));
    return maxReach < FIST_THRESHOLD;
}

export function detectGesture(lm) {
    if (isPinch(lm)) return 'pinch';
    if (isPeace(lm)) return 'peace';
    if (isFist(lm)) return 'fist';
    return 'open';
}
export function isPeace(lm) {
    // Index and middle extended and apart, ring and pinky curled
    const indexUp  = fingerExtended(lm, 8, 6);
    const middleUp = fingerExtended(lm, 12, 10);
    const ringDown  = !fingerExtended(lm, 16, 14);
    const pinkyDown = !fingerExtended(lm, 20, 18);
    const gap = dist(lm[8], lm[12]);
    return indexUp && middleUp && ringDown && pinkyDown && gap > PEACE_MIN_GAP;
}
export function calcSpread(lm) {
    const palm = lm[PALM_INDEX];
    const reaches = FINGER_TIPS.map(i => dist(palm, lm[i]));
    const max = Math.max(...reaches);
    const min = Math.min(...reaches);
    const spread = ((max - min) / Math.max(max, 0.001)) * 100;
    return Math.max(0, Math.min(100, spread));
}
export function isFingerHeart(lm) {
    // Thumb and index tips close together
    if (dist(lm[4], lm[8]) > 0.08) return false;
    // Both pointing upwards (y grows downward in image space)
    if (lm[8].y > lm[9].y || lm[4].y > lm[9].y) return false;
    // Middle and ring curled (tips below their PIP joints)
    if (lm[12].y < lm[10].y && lm[16].y < lm[14].y) return false;
    return true;
}

export const palmCenter = (lm) => lm[PALM_INDEX];

export function getVelocity(cur, prev) {
    if (!prev) return { vx: 0, vy: 0, speed: 0 };
    const vx = cur.x - prev.x;
    const vy = cur.y - prev.y;
    return { vx, vy, speed: Math.hypot(vx, vy) };
}
