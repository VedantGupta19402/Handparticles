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
    toggleMute() {
        this.init();
        this.isMuted = !this.isMuted;
        const target = this.isMuted ? 0 : 0.8;
        this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
        return !this.isMuted;
    }
    updateSound(spreadPercent, handCount) {
        if (!this.osc || this.isMuted) return;
        if (handCount === 0) {
            this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
            return;
        }
        const level = 0.05 + (spreadPercent / 100) * 0.1;
        this.gain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.1);
        const freq = 50 + spreadPercent * 1.5 + (handCount === 2 ? 100 : 0);
        this.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }
    play(type) {
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.master);

        if (type === 'fireball') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
            return;
        }
