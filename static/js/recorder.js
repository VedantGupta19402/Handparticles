// ─────────────────────────────────────────────────────────────
// HandParticles - canvas recording and screenshot export
// ─────────────────────────────────────────────────────────────

import { RECORD_SECONDS, RECORD_COUNTDOWN } from './config.js';

const pad = (n) => (n < 10 ? '0' + n : n);

export function timestamp() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}
