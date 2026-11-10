// ─────────────────────────────────────────────────────────────
// HandParticles - gesture classification from hand landmarks
// ─────────────────────────────────────────────────────────────

import { PINCH_THRESHOLD, FIST_THRESHOLD, PEACE_MIN_GAP, FINGER_TIPS, PALM_INDEX } from './config.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const fingerExtended = (lm, tip, pip) => lm[tip].y < lm[pip].y;
