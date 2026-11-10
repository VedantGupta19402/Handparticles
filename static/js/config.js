// ─────────────────────────────────────────────────────────────
// HandParticles - shared configuration and constants
// ─────────────────────────────────────────────────────────────

// MediaPipe hand skeleton topology (21 landmarks)
export const CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],        // thumb
    [0, 5], [5, 6], [6, 7], [7, 8],        // index
    [5, 9], [9, 10], [10, 11], [11, 12],   // middle
    [9, 13], [13, 14], [14, 15], [15, 16], // ring
    [13, 17], [0, 17], [17, 18], [18, 19], [19, 20], // pinky
];
// Colour palettes - each theme cycles through its palette per hand
export const THEMES = {
    Aurora:     { colors: ['#00ffa3', '#00c8ff', '#7b2fff'], core: '#eafffa' },
    Cyberpunk:  { colors: ['#ff14a3', '#00ffff'],            core: '#ffffff' },
    Rainbow:    { colors: ['#ff0000', '#00ff00', '#0000ff'], core: '#ffffff' },
    Lava:       { colors: ['#ff2200', '#ff8800', '#ffff00'], core: '#ffffff' },
    Ocean:      { colors: ['#00e5ff', '#0088ff'],            core: '#ffffff' },
};
