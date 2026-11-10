// ─────────────────────────────────────────────────────────────
// HandParticles - particles, fireballs, hearts and sparkles
// ─────────────────────────────────────────────────────────────

import { audio } from './audio.js';

// Shared effect pools
export const particles = [];
export const fireballs = [];
export const hearts = [];
export class Particle {
    constructor(x, y, vx, vy, color, life, size) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.color = color; this.life = life; this.maxLife = life; this.size = size;
    }

    update(canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.016;
        if (this.y > canvasHeight) this.vy *= -0.6; // gentle floor bounce
    }

    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

export function spawnParticles(x, y, count, colorFunc, speedMultiplier = 1) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 * speedMultiplier;
        particles.push(new Particle(
            x, y,
            Math.cos(angle) * speed, Math.sin(angle) * speed,
            colorFunc(), 1.0 + Math.random(), 2 + Math.random() * 4,
        ));
    }
}
