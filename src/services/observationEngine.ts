import { SymptomContext, VisualSignal, Trend, ObservationResult, ObservationEngine } from '@/types';
import { extractImageFeatures } from './imageFeatures';

export class PrototypeObservationEngine implements ObservationEngine {
  async analyze(imageSrc: string, context: SymptomContext, checkHistoryCount: number = 0): Promise<ObservationResult> {
    // 1. Extract visual features locally via browser Canvas API
    const visualSignal: VisualSignal = await extractImageFeatures(imageSrc);

    // 2. Evaluate trend using transparent heuristic rules
    const hasConcerningSymptom = context.symptoms.some((s) =>
      ['Fever', 'Discharge', 'Warmth', 'More pain'].includes(s)
    );

    let trend: Trend = 'Baseline';

    if (checkHistoryCount === 0) {
      trend = 'Baseline';
    } else if (hasConcerningSymptom || context.pain >= 7) {
      trend = 'Needs attention';
    } else if (context.pain <= 4 && (context.symptoms.length === 0 || context.symptoms.includes('No new symptoms'))) {
      trend = 'Improving';
    } else {
      trend = 'Stable';
    }

    // 3. Generate non-diagnostic observation summary & safety guidance
    const explanation = this.generateExplanation(trend, visualSignal, context, checkHistoryCount);
    const safetyPrompt = this.generateSafetyPrompt(trend);

    return {
      visualSignal,
      trend,
      explanation,
      safetyPrompt,
    };
  }

  private generateExplanation(trend: Trend, visual: VisualSignal, context: SymptomContext, historyCount: number): string {
    const symptomText = context.symptoms.length > 0 && !context.symptoms.includes('No new symptoms')
      ? `Reported symptoms include ${context.symptoms.join(', ').toLowerCase()}.`
      : 'No concerning secondary symptoms reported.';

    const voiceNoteSummary = context.voiceNote ? ` User noted: "${context.voiceNote}".` : '';

    if (trend === 'Baseline' || historyCount === 0) {
      return `Baseline recovery check recorded with pain score ${context.pain}/10 and observable visual signal intensity ${visual.redDominance}%. ${symptomText}${voiceNoteSummary} Perform a second check over time to establish longitudinal tracking.`;
    }

    if (trend === 'Needs attention') {
      return `Reported pain score is ${context.pain}/10 with observable visual signal intensity ${visual.redDominance}%. ${symptomText}${voiceNoteSummary} These combined observations indicate noticeable change that benefits from careful tracking.`;
    }

    if (trend === 'Improving') {
      return `Reported pain score is low (${context.pain}/10) with steady visual features (${visual.redDominance}% visual signal). ${symptomText}${voiceNoteSummary} Overall observations reflect positive progression over time.`;
    }

    return `Reported pain score is moderate (${context.pain}/10) with consistent visual features (${visual.redDominance}% visual signal). ${symptomText}${voiceNoteSummary} Observations remain stable compared to baseline.`;
  }

  private generateSafetyPrompt(trend: Trend): string {
    if (trend === 'Needs attention') {
      return 'These observations may warrant attention. If symptoms are worsening or you are concerned, consider seeking qualified medical care.';
    }

    return 'Observation only — not a diagnosis. Continue standard recovery hygiene and observe for changes over time.';
  }
}

// Export singleton instance
export const observationEngine = new PrototypeObservationEngine();
