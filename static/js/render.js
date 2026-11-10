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
export function drawNeonLine(ctx, x1, y1, x2, y2, color, core) {
    ctx.save();
    // Glow pass
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Bright core pass
    ctx.shadowBlur = 4;
    ctx.shadowColor = core;
    ctx.strokeStyle = core;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();

    // Occasional sparkle along the segment
    if (Math.random() > 0.65) {
        const t = Math.random();
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x1 + t * (x2 - x1), y1 + t * (y2 - y1), 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
export function drawHand(ctx, lm, handIdx, theme, time) {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const color = getNeonColor(time, handIdx, theme);
    const core = THEMES[theme].core;
    for (const [a, b] of CONNECTIONS) {
        drawNeonLine(ctx, lm[a].x * W, lm[a].y * H, lm[b].x * W, lm[b].y * H, color, core);
    }
}
// Web of light between matching fingertips of both hands
export function drawConstellation(ctx, hand1, hand2, theme) {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const color = THEMES[theme].colors[0];
    for (const tip of FINGER_TIPS) {
        drawNeonLine(
            ctx,
            hand1[tip].x * W, hand1[tip].y * H,
            hand2[tip].x * W, hand2[tip].y * H,
            color, '#ffffff',
        );
    }
}
