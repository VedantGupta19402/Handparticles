// ─────────────────────────────────────────────────────────────
// HandParticles - neon wireframe rendering
// ─────────────────────────────────────────────────────────────

import { CONNECTIONS, THEMES, FINGER_TIPS } from './config.js';

export function getNeonColor(time, handIdx, theme) {
    if (theme === 'Rainbow') {
        return `hsl(${(time * 0.05 + handIdx * 180) % 360}, 100%, 50%)`;
    }
    const palette = THEMES[theme].colors;
    return palette[(Math.floor(time * 0.05) + handIdx * 3) % palette.length];
}
