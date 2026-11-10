// ─────────────────────────────────────────────────────────────
// HandParticles - canvas recording and screenshot export
// ─────────────────────────────────────────────────────────────

import { RECORD_SECONDS, RECORD_COUNTDOWN } from './config.js';

const pad = (n) => (n < 10 ? '0' + n : n);

export function timestamp() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}
export function startRecording(canvas, onState) {
    const stream = canvas.captureStream(30);

    // Prefer MP4, fall back through WebM codecs
    const candidates = [
        'video/mp4; codecs="avc1.424028, mp4a.40.2"',
        'video/mp4',
        'video/webm; codecs=vp9',
        'video/webm; codecs=vp8',
        'video/webm',
    ];
    const mimeType = candidates.find(t => MediaRecorder.isTypeSupported(t)) || '';

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks = [];
    recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType });
        downloadBlob(blob, `handparticles_${timestamp()}.mp4`);
        onState('idle');
    };
    recorder.start();
    return recorder;
}
