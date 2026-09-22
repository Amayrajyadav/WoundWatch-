export type Trend = 'baseline' | 'improving' | 'stable' | 'monitor' | 'seek-care';

export type ChangeDirection = 'increased' | 'decreased' | 'unchanged' | 'insufficient-data';

export type SafetyLevel = 'normal' | 'monitor' | 'seek-care';

export interface ObservationComparison {
  comparisonConfidence: 'high' | 'medium' | 'low';

  previousPain: number | null;
  currentPain: number;
  painDelta: number | null;

  previousVisualSignal: number | null;
  currentVisualSignal: number;
  visualSignalDelta: number | null;

  baselinePain: number | null;
  baselineVisualSignal: number | null;
}

export interface SymptomContext {
  pain: number; // 0 to 10
  symptoms: string[];
  voiceNote?: string;
}

export interface WoundRegion {
  x: number;      // 0-1 normalized
  y: number;      // 0-1 normalized
  width: number;  // 0-1 normalized
  height: number; // 0-1 normalized
}

export interface ImageFeatures {
  redDominance: number;       // full image
  avgBrightness: number;      // full image
  brightnessVariance: number; // full image variance
  sharpness: number;          // full image sharpness

  woundRegion: WoundRegion | null;

  regionRedDominance: number; // region specific
  regionBrightness: number;   // region specific

  imageQuality: 'good' | 'low';
}

export interface ObservationResult {
  visualSignal: ImageFeatures;
  trend: Trend;
  safetyLevel: SafetyLevel;
  comparison: ObservationComparison;
  reasoning: string[];
  explanation: string;
  safetyPrompt: string;
}

export interface RecoveryCheck {
  id: string;
  timestamp: string; // ISO date string
  visualSignal: ImageFeatures;
  context: SymptomContext;
  trend: Trend | 'Baseline' | 'Improving' | 'Stable' | 'Needs attention'; // Keep legacy trends for backwards compatibility in localStorage during dev
  safetyLevel: SafetyLevel;
  comparison: ObservationComparison;
  reasoning: string[];
  explanation: string;
  safetyPrompt: string;
  imageUrl?: string;
}

export interface ObservationEngine {
  analyze(image: Blob | string, context: SymptomContext, fullHistory: RecoveryCheck[]): Promise<ObservationResult>;
}

export type NavigationTab = 'overview' | 'check' | 'timeline' | 'careguide' | 'report';
