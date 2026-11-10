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
