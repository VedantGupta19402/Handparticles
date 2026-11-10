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
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Freeze the current frame to a PNG
export function captureScreenshot(canvas) {
    canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `handparticles_${timestamp()}.png`);
    }, 'image/png');
}
// Wires the record button: countdown, capture, auto-stop, status pill.
export function setupRecorder({ recordBtn, statusPill, statusText, canvas }) {
    let recorder = null;
    let countdownTimer = null;
    let recTimer = null;

    const setDot = (color, animate) => {
        const dot = statusPill.querySelector('.status-dot');
        dot.style.background = color;
        dot.style.animation = animate ? 'blink 1s infinite alternate' : 'none';
    };

    recordBtn.addEventListener('click', () => {
        if (recorder || countdownTimer) return;
        recordBtn.disabled = true;
        recordBtn.style.opacity = '0.5';

        statusPill.style.display = 'flex';
        setDot('#ffa500', false);

        let count = RECORD_COUNTDOWN;
        statusText.textContent = `Starting in ${count}...`;
        countdownTimer = setInterval(() => {
            count--;
            if (count > 0) {
                statusText.textContent = `Starting in ${count}...`;
                return;
            }
            clearInterval(countdownTimer);
            countdownTimer = null;
            begin();
        }, 1000);
    });

    function begin() {
        recorder = startRecording(canvas, () => {
            statusPill.style.display = 'none';
            recordBtn.disabled = false;
            recordBtn.style.opacity = '1';
            recordBtn.classList.remove('recording');
            recordBtn.querySelector('.record-text').textContent = 'Record';
            recorder = null;
            clearInterval(recTimer);
        });

        recordBtn.classList.add('recording');
        recordBtn.querySelector('.record-text').textContent = 'Recording';
        setDot('#ff0000', true);

        let remaining = RECORD_SECONDS;
        statusText.textContent = `● Recording ${remaining}s`;
        recTimer = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                statusText.textContent = `● Recording ${remaining}s`;
            } else {
                clearInterval(recTimer);
                if (recorder && recorder.state !== 'inactive') recorder.stop();
            }
        }, 1000);
    }
}
