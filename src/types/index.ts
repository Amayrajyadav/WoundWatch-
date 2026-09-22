export type Trend = 'Baseline' | 'Improving' | 'Stable' | 'Needs attention';

export interface SymptomContext {
  pain: number; // 0 to 10
  symptoms: string[];
  voiceNote?: string;
}

export interface VisualSignal {
  redDominance: number; // percentage 0-100
  brightness: number; // 0-255 average
  imageQuality: 'good' | 'low';
}

export interface RecoveryCheck {
  id: string;
  timestamp: string; // ISO date string
  visualSignal: VisualSignal;
  context: SymptomContext;
  trend: Trend;
  explanation: string;
  safetyPrompt: string;
  imageUrl?: string;
}

export interface ObservationResult {
  visualSignal: VisualSignal;
  trend: Trend;
  explanation: string;
  safetyPrompt: string;
}

export interface ObservationEngine {
  analyze(image: Blob | string, context: SymptomContext, checkHistoryCount?: number): Promise<ObservationResult>;
}

export type NavigationTab = 'overview' | 'check' | 'timeline' | 'careguide';
