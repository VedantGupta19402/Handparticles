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
export class Fireball {
    constructor(x, y, vx, vy, radius) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.radius = radius; this.life = 1.0; this.age = 0; this.trail = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.015;
        this.age++;
        for (let i = 0; i < 3; i++) {
            this.trail.push({
                x: this.x + (Math.random() - 0.5) * this.radius,
                y: this.y + (Math.random() - 0.5) * this.radius,
                vx: -this.vx * 0.1 + (Math.random() - 0.5) * 2,
                vy: -this.vy * 0.1 + (Math.random() - 0.5) * 2,
                life: 1.0,
                r: this.radius * (0.2 + Math.random() * 0.3),
                hue: 10 + Math.random() * 30,
            });
        }
        this.trail = this.trail.filter(e => e.life > 0);
        this.trail.forEach(e => { e.x += e.vx; e.y += e.vy; e.life -= 0.05; e.r *= 0.95; });
    }

    draw(ctx) {
        for (const e of this.trail) {
            ctx.globalAlpha = e.life;
            ctx.fillStyle = `hsl(${e.hue}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = this.life;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.2, '#ffaa00');
        g.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}
export class Heart {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = -Math.random() * 5 - 2; // drift upward
        this.size = 10 + Math.random() * 30;
        this.life = 5 + Math.random() * 5; // seconds
        this.maxLife = this.life;
        this.hue = 300 + Math.random() * 50; // pink-magenta range
    }

    update(canvas) {
        this.x += this.vx;
        this.y += this.vy;
        // Bounce off walls and floor
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0) this.vy *= -1;
        if (this.y > canvas.height) {
            this.y = canvas.height;
            this.vy *= -0.8;
        }
        this.life -= 1 / 60;
        if (this.life <= 0) {
            spawnParticles(this.x, this.y, 30, () => `hsl(${this.hue}, 100%, 60%)`, 3);
            audio.play('heart');
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.min(1.0, this.life * 2); // fade near the end
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
        ctx.translate(this.x, this.y);
        const s = this.size / 15;
        ctx.scale(s, s);
        drawHeartPath(ctx);
        ctx.fill();
        ctx.restore();
    }
}
function drawHeartPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-5, 0, -10, -5, -10, -10);
    ctx.bezierCurveTo(-10, -15, -5, -20, 0, -15);
    ctx.bezierCurveTo(5, -20, 10, -15, 10, -10);
    ctx.bezierCurveTo(10, -5, 5, 0, 0, 5);
}

// Charge ring that fills while the finger-heart pose is held
export function drawHeartWireframe(ctx, x, y, size, progress) {
    ctx.save();
    ctx.translate(x, y);
    const s = size / 15;
    ctx.scale(s, s);
    ctx.lineWidth = 3 / s;
    ctx.strokeStyle = '#ff0077';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0077';
    drawHeartPath(ctx);
    const pathLength = 80;
    ctx.setLineDash([pathLength]);
    ctx.lineDashOffset = pathLength * (1 - progress);
    ctx.stroke();
    if (progress >= 1.0) {
        ctx.fillStyle = 'rgba(255, 0, 119, 0.3)';
        ctx.fill();
    }
    ctx.restore();
}
