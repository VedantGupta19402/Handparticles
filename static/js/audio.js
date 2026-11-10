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
    init() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        if (!this.osc) {
            // Ambient drone that reacts to hand spread
            this.osc = this.ctx.createOscillator();
            this.gain = this.ctx.createGain();
            this.osc.type = 'sine';
            this.osc.frequency.value = 50;
            this.gain.gain.value = 0.05;
            this.osc.connect(this.gain);
            this.gain.connect(this.master);
            this.osc.start();
        }
    }
