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
// Extended palettes
THEMES.Galaxy      = { colors: ['#cc00ff', '#ff00ff', '#ffffff'], core: '#ffffff' };
THEMES.Matrix      = { colors: ['#00ff00', '#00bb00'],            core: '#ccffcc' };
THEMES.Frostbite   = { colors: ['#ffffff', '#aaddff', '#4499ff'], core: '#ffffff' };
THEMES.GoldenHour  = { colors: ['#ff9900', '#ffdd00', '#ff6688'], core: '#fff0cc' };
THEMES.Synthwave   = { colors: ['#ff00ff', '#00ffff', '#ff0077'], core: '#ffccff' };
THEMES.NeonDemon   = { colors: ['#ff0000', '#cc0000', '#ff4444'], core: '#ff9999' };
THEMES.Ultraviolet = { colors: ['#7b2fff', '#b26bff', '#e0c3ff'], core: '#f3e6ff' };

export const DEFAULT_THEME = 'Aurora';
export const THEME_KEYS = Object.keys(THEMES);
// Gesture thresholds, normalised to frame width
export const PINCH_THRESHOLD = 0.06; // thumb-index distance for a pinch
export const FIST_THRESHOLD  = 0.12; // max palm-to-fingertip distance for a fist
export const PEACE_MIN_GAP   = 0.04; // index-middle separation for a peace sign

// Recording limits
export const RECORD_SECONDS   = 60;
export const RECORD_COUNTDOWN = 5;

// Landmark indices for fingertips and palm reference
export const FINGER_TIPS = [4, 8, 12, 16, 20];
export const PALM_INDEX  = 9;
