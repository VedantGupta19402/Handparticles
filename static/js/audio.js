// ─────────────────────────────────────────────────────────────
// HandParticles - procedural audio engine (Web Audio API)
// ─────────────────────────────────────────────────────────────

export class AudioEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0; // starts muted
        this.master.connect(this.ctx.destination);
        this.isMuted = true;
        this.osc = null;
        this.gain = null;
    }
