import { RecoveryCheck } from '@/types';

/**
 * Generate synthetic demo SVG images that clearly communicate they are not real clinical photos.
 * Redness decreases from Day 1 → Day 5.
 */
function makeSyntheticSvg(day: number, redSignal: number): string {
  // redSignal: 0–100 — maps to visual redness intensity
  const r = Math.round(180 + (redSignal / 100) * 60); // 180–240
  const g = Math.round(120 - (redSignal / 100) * 80);  // 40–120
  const b = Math.round(100 - (redSignal / 100) * 60);  // 40–100
  const coreColor = `rgb(${r},${g},${b})`;
  const haloOpacity = (redSignal / 100) * 0.5 + 0.1;
  const coreRadius = 30 + (redSignal / 100) * 18;
  const haloRadius = coreRadius + 22;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="380" viewBox="0 0 500 380">
  <!-- Background: neutral skin tone -->
  <rect width="500" height="380" fill="#f5deb3"/>
  <!-- Subtle texture lines -->
  <line x1="0" y1="95" x2="500" y2="85" stroke="#e8cfa0" stroke-width="1.5" opacity="0.5"/>
  <line x1="0" y1="185" x2="500" y2="178" stroke="#e8cfa0" stroke-width="1.5" opacity="0.5"/>
  <line x1="0" y1="275" x2="500" y2="268" stroke="#e8cfa0" stroke-width="1.5" opacity="0.5"/>
  <!-- Wound halo -->
  <circle cx="250" cy="185" r="${haloRadius}" fill="${coreColor}" opacity="${haloOpacity.toFixed(2)}"/>
  <!-- Wound core -->
  <circle cx="250" cy="185" r="${coreRadius.toFixed(0)}" fill="${coreColor}" opacity="0.85"/>
  <!-- Region selection dashed box -->
  <rect x="175" y="115" width="150" height="140" rx="6" stroke="#00598e" stroke-width="2" stroke-dasharray="6 4" fill="none" opacity="0.8"/>
  <!-- Day label -->
  <rect x="14" y="14" width="80" height="28" rx="6" fill="#001a2a" opacity="0.9"/>
  <text x="54" y="32" font-family="sans-serif" font-size="12" font-weight="700" fill="#85c8f2" text-anchor="middle">Day ${day}</text>
  <!-- Signal readout -->
  <rect x="14" y="50" width="120" height="26" rx="6" fill="#001a2a" opacity="0.9"/>
  <text x="74" y="67" font-family="sans-serif" font-size="11" font-weight="600" fill="#fcd54d" text-anchor="middle">Signal: ${redSignal}%</text>
  <!-- Mandatory demo watermark -->
  <rect x="0" y="346" width="500" height="34" fill="#001a2a" opacity="0.92"/>
  <text x="250" y="368" font-family="sans-serif" font-size="10" font-weight="700" fill="#85c8f2" text-anchor="middle" letter-spacing="1">SYNTHETIC DEMO DATA — NOT A CLINICAL PHOTOGRAPH</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 5-day recovery story — pain 8→3, visual signal 31%→15%
const now = Date.now();
const d = (daysAgo: number) => new Date(now - daysAgo * 86400000).toISOString();

export const DEMO_CHECKS: RecoveryCheck[] = [
  // ─── Day 5 (most recent, shown first) ───────────────────────────────────
  {
    id: 'demo-day5',
    timestamp: d(0),
    imageUrl: makeSyntheticSvg(5, 15),
    visualSignal: {
      redDominance: 15,
      avgBrightness: 148,
      brightnessVariance: 38,
      sharpness: 18,
      woundRegion: { x: 0.35, y: 0.30, width: 0.30, height: 0.37 },
      regionRedDominance: 15,
      regionBrightness: 148,
      imageQuality: 'good',
    },
    context: { pain: 3, symptoms: [] },
    trend: 'improving',
    safetyLevel: 'normal',
    comparison: {
      comparisonConfidence: 'high',
      previousPain: 4,
      currentPain: 3,
      painDelta: -1,
      previousVisualSignal: 19,
      currentVisualSignal: 15,
      visualSignalDelta: -4,
      baselinePain: 8,
      baselineVisualSignal: 31,
    },
    reasoning: [
      'Reported pain decreased by 1 point (4 → 3).',
      'Visual signal decreased by 4 percentage points (19% → 15%).',
      'No new symptoms were reported.',
      'Image comparison confidence is high.',
      'Both pain and visual signal are well below the personal baseline (pain: 8, signal: 31%).',
    ],
    explanation: 'Pain and visual signal have both continued to decrease and are now significantly below baseline. Trajectory is improving.',
    safetyPrompt: 'Observation only — not a diagnosis. Continue standard wound care.',
  },
  // ─── Day 4 ───────────────────────────────────────────────────────────────
  {
    id: 'demo-day4',
    timestamp: d(1),
    imageUrl: makeSyntheticSvg(4, 19),
    visualSignal: {
      redDominance: 19,
      avgBrightness: 143,
      brightnessVariance: 40,
      sharpness: 17,
      woundRegion: { x: 0.35, y: 0.30, width: 0.30, height: 0.37 },
      regionRedDominance: 19,
      regionBrightness: 143,
      imageQuality: 'good',
    },
    context: { pain: 4, symptoms: [] },
    trend: 'improving',
    safetyLevel: 'normal',
    comparison: {
      comparisonConfidence: 'high',
      previousPain: 5,
      currentPain: 4,
      painDelta: -1,
      previousVisualSignal: 23,
      currentVisualSignal: 19,
      visualSignalDelta: -4,
      baselinePain: 8,
      baselineVisualSignal: 31,
    },
    reasoning: [
      'Reported pain decreased by 1 point (5 → 4).',
      'Visual signal decreased by 4 percentage points (23% → 19%).',
      'No symptoms reported.',
      'Image comparison confidence is high.',
      'Consistent downward trend across both signals.',
    ],
    explanation: 'Pain and visual signal both continue to decrease steadily. Trajectory is improving.',
    safetyPrompt: 'Observation only — not a diagnosis. Continue standard wound care.',
  },
  // ─── Day 3 ───────────────────────────────────────────────────────────────
  {
    id: 'demo-day3',
    timestamp: d(2),
    imageUrl: makeSyntheticSvg(3, 23),
    visualSignal: {
      redDominance: 23,
      avgBrightness: 138,
      brightnessVariance: 43,
      sharpness: 16,
      woundRegion: { x: 0.35, y: 0.30, width: 0.30, height: 0.37 },
      regionRedDominance: 23,
      regionBrightness: 138,
      imageQuality: 'good',
    },
    context: { pain: 5, symptoms: ['Mild itch'] },
    trend: 'improving',
    safetyLevel: 'normal',
    comparison: {
      comparisonConfidence: 'high',
      previousPain: 7,
      currentPain: 5,
      painDelta: -2,
      previousVisualSignal: 27,
      currentVisualSignal: 23,
      visualSignalDelta: -4,
      baselinePain: 8,
      baselineVisualSignal: 31,
    },
    reasoning: [
      'Reported pain decreased by 2 points (7 → 5).',
      'Visual signal decreased by 4 percentage points (27% → 23%).',
      'Mild itch reported — consistent with early healing.',
      'No red-flag symptoms detected.',
      'Both signals trending below baseline.',
    ],
    explanation: 'A significant pain drop with continued visual signal decrease. Mild itching is common during early healing. Trajectory is improving.',
    safetyPrompt: 'Observation only — not a diagnosis. Itching during healing is common; monitor for changes.',
  },
  // ─── Day 2 ───────────────────────────────────────────────────────────────
  {
    id: 'demo-day2',
    timestamp: d(3),
    imageUrl: makeSyntheticSvg(2, 27),
    visualSignal: {
      redDominance: 27,
      avgBrightness: 132,
      brightnessVariance: 46,
      sharpness: 15,
      woundRegion: { x: 0.35, y: 0.30, width: 0.30, height: 0.37 },
      regionRedDominance: 27,
      regionBrightness: 132,
      imageQuality: 'good',
    },
    context: { pain: 7, symptoms: ['Swelling'] },
    trend: 'stable',
    safetyLevel: 'normal',
    comparison: {
      comparisonConfidence: 'high',
      previousPain: 8,
      currentPain: 7,
      painDelta: -1,
      previousVisualSignal: 31,
      currentVisualSignal: 27,
      visualSignalDelta: -4,
      baselinePain: 8,
      baselineVisualSignal: 31,
    },
    reasoning: [
      'Reported pain decreased by 1 point (8 → 7).',
      'Visual signal decreased by 4 percentage points (31% → 27%).',
      'Swelling reported — consistent with Day 2 post-injury.',
      'No fever or discharge reported.',
      'Changes are within expected early post-injury range.',
    ],
    explanation: 'Slight improvements from baseline. Pain and visual signal have both marginally decreased. Trajectory is stable.',
    safetyPrompt: 'Observation only — not a diagnosis. Continue monitoring.',
  },
  // ─── Day 1 (baseline, oldest, shown last) ────────────────────────────────
  {
    id: 'demo-day1',
    timestamp: d(4),
    imageUrl: makeSyntheticSvg(1, 31),
    visualSignal: {
      redDominance: 31,
      avgBrightness: 125,
      brightnessVariance: 52,
      sharpness: 14,
      woundRegion: { x: 0.35, y: 0.30, width: 0.30, height: 0.37 },
      regionRedDominance: 31,
      regionBrightness: 125,
      imageQuality: 'good',
    },
    context: { pain: 8, symptoms: ['Swelling', 'Warmth'] },
    trend: 'baseline',
    safetyLevel: 'normal',
    comparison: {
      comparisonConfidence: 'high',
      previousPain: null,
      currentPain: 8,
      painDelta: null,
      previousVisualSignal: null,
      currentVisualSignal: 31,
      visualSignalDelta: null,
      baselinePain: null,
      baselineVisualSignal: null,
    },
    reasoning: [
      'First observation — personal baseline established.',
      'Pain score: 8/10.',
      'Visual red-channel signal: 31%.',
      'Symptoms: swelling and warmth — consistent with acute post-injury presentation.',
    ],
    explanation: 'Baseline established. Pain is 8/10 with 31% observed red-channel signal. Subsequent observations will be compared against this baseline.',
    safetyPrompt: 'Observation only — not a diagnosis. Monitor for worsening symptoms.',
  },
];
