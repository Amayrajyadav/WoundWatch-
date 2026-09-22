import { RecoveryCheck } from '@/types';

/**
 * Generate a clean SVG data URL for synthetic demo images with explicit clinical safety watermark.
 */
export function generateSyntheticDemoSvg(dayLabel: string, intensity: 'high' | 'medium' | 'low'): string {
  const color = intensity === 'high' ? '#EF4444' : intensity === 'medium' ? '#F59E0B' : '#10B981';
  const radius = intensity === 'high' ? '42' : intensity === 'medium' ? '30' : '18';
  const opacity = intensity === 'high' ? '0.35' : intensity === 'medium' ? '0.25' : '0.15';

  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="#F8FAFC"/>
  <!-- Grid overlay -->
  <defs>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="450" fill="url(#grid)" />

  <!-- Simulated skin patch background -->
  <rect x="120" y="80" width="360" height="270" rx="30" fill="#FED7AA" opacity="0.4" />
  <circle cx="300" cy="215" r="70" fill="#FDBA74" opacity="0.5" />

  <!-- Simulated recovery area marker -->
  <circle cx="300" cy="215" r="${radius}" fill="${color}" opacity="${opacity}" />
  <circle cx="300" cy="215" r="${Number(radius) * 0.5}" fill="${color}" opacity="0.6" />

  <!-- Target reticle frame -->
  <circle cx="300" cy="215" r="90" stroke="#055FFA" stroke-width="2" stroke-dasharray="6 6" fill="none" opacity="0.6"/>

  <!-- Timestamp badge -->
  <rect x="30" y="25" width="140" height="32" rx="8" fill="#011332" opacity="0.9"/>
  <text x="100" y="46" font-family="sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">${dayLabel}</text>

  <!-- MANDATORY WATERMARK BADGE -->
  <rect x="50" y="385" width="500" height="40" rx="10" fill="#00091A" opacity="0.92"/>
  <text x="300" y="410" font-family="sans-serif" font-size="13" font-weight="700" fill="#699FFC" text-anchor="middle" letter-spacing="1">
    SYNTHETIC DEMO IMAGE — NOT A REAL CLINICAL PHOTO
  </text>
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const DEMO_IMAGES = {
  day1: generateSyntheticDemoSvg('Day 1 Check', 'high'),
  day3: generateSyntheticDemoSvg('Day 3 Check', 'medium'),
  day5: generateSyntheticDemoSvg('Day 5 Check', 'low'),
};

export const INITIAL_DEMO_TIMELINE: RecoveryCheck[] = [
  {
    id: 'check-demo-3',
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    imageUrl: DEMO_IMAGES.day1,
    visualSignal: {
      redDominance: 48,
      brightness: 125,
      imageQuality: 'good',
    },
    context: {
      pain: 6,
      symptoms: ['Swelling', 'Warmth', 'More pain'],
      voiceNote: 'Felt quite warm and tight after yesterday afternoon walk.',
    },
    trend: 'Needs attention',
    explanation: 'Reported pain score was elevated (6/10) with 48% visual red dominance signal and reported warmth/swelling context. Highlighted for careful observation.',
    safetyPrompt: 'These observations may warrant attention. If symptoms are worsening or you are concerned, consider seeking qualified medical care.',
  },
  {
    id: 'check-demo-2',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    imageUrl: DEMO_IMAGES.day3,
    visualSignal: {
      redDominance: 32,
      brightness: 135,
      imageQuality: 'good',
    },
    context: {
      pain: 4,
      symptoms: ['Swelling'],
      voiceNote: 'Pain feels milder today, swelling starting to reduce.',
    },
    trend: 'Stable',
    explanation: 'Reported pain score decreased to 4/10 with reduced observable red signal (32%). Observations remain stable compared to initial check.',
    safetyPrompt: 'Observation only — not a diagnosis. Continue standard recovery hygiene and observe for changes over time.',
  },
  {
    id: 'check-demo-1',
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
    imageUrl: DEMO_IMAGES.day5,
    visualSignal: {
      redDominance: 18,
      brightness: 142,
      imageQuality: 'good',
    },
    context: {
      pain: 2,
      symptoms: ['No new symptoms'],
      voiceNote: 'Feeling much better today, almost no discomfort.',
    },
    trend: 'Improving',
    explanation: 'Current pain score is low (2/10) with pale steady visual features (18% red dominance). Overall observations reflect positive progression.',
    safetyPrompt: 'Observation only — not a diagnosis. Continue standard recovery hygiene and observe for changes over time.',
  },
];
