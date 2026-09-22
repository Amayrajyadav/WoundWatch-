import { SymptomContext, ImageFeatures, Trend, ObservationResult, ObservationEngine, RecoveryCheck, SafetyLevel, ObservationComparison } from '@/types';
import { extractImageFeatures } from './imageFeatures';

export class PrototypeObservationEngine implements ObservationEngine {
  async analyze(imageSrc: string, context: SymptomContext, fullHistory: RecoveryCheck[] = []): Promise<ObservationResult> {
    // 1. Extract visual features locally
    const visualSignal: ImageFeatures = await extractImageFeatures(imageSrc);

    // 2. Compute comparisons against baseline and previous
    const comparison = this.computeComparison(visualSignal, context, fullHistory);

    // 3. Determine Safety Level
    const safetyLevel = this.determineSafetyLevel(context, comparison);

    // 4. Determine Trend
    const trend = this.determineTrend(fullHistory.length, safetyLevel, comparison);

    // 5. Generate Reasoning and Explanation
    const reasoning = this.generateReasoning(comparison, context, safetyLevel);
    const explanation = this.generateExplanation(trend, safetyLevel, reasoning);
    const safetyPrompt = this.generateSafetyPrompt(safetyLevel);

    return {
      visualSignal,
      trend,
      safetyLevel,
      comparison,
      reasoning,
      explanation,
      safetyPrompt,
    };
  }

  private computeComparison(currentVisual: ImageFeatures, currentContext: SymptomContext, fullHistory: RecoveryCheck[]): ObservationComparison {
    let comparisonConfidence: 'high' | 'medium' | 'low' = currentVisual.imageQuality === 'good' ? 'high' : 'low';
    
    let previousPain: number | null = null;
    let previousVisualSignal: number | null = null;
    let painDelta: number | null = null;
    let visualSignalDelta: number | null = null;

    let baselinePain: number | null = null;
    let baselineVisualSignal: number | null = null;

    if (fullHistory.length > 0) {
      const previous = fullHistory[0];
      if (previous.visualSignal.imageQuality === 'low') {
        comparisonConfidence = 'low';
      }
      
      previousPain = previous.context.pain;
      previousVisualSignal = previous.visualSignal.regionRedDominance ?? previous.visualSignal.redDominance;
      painDelta = currentContext.pain - previousPain;
      visualSignalDelta = currentVisual.regionRedDominance - previousVisualSignal;
    }

    if (fullHistory.length > 0) {
      const recentChecks = fullHistory.slice(0, 3);
      const sumPain = recentChecks.reduce((acc, check) => acc + check.context.pain, 0);
      const sumVisual = recentChecks.reduce((acc, check) => acc + (check.visualSignal.regionRedDominance ?? check.visualSignal.redDominance), 0);
      baselinePain = Number((sumPain / recentChecks.length).toFixed(1));
      baselineVisualSignal = Number((sumVisual / recentChecks.length).toFixed(1));
    }

    return {
      comparisonConfidence,
      previousPain,
      currentPain: currentContext.pain,
      painDelta,
      previousVisualSignal,
      currentVisualSignal: currentVisual.regionRedDominance,
      visualSignalDelta,
      baselinePain,
      baselineVisualSignal,
    };
  }

  private determineSafetyLevel(context: SymptomContext, comparison: ObservationComparison): SafetyLevel {
    const hasRedFlagSymptom = context.symptoms.some(s => 
      ['Fever', 'Discharge'].includes(s)
    );
    const hasRapidPainIncrease = (comparison.painDelta !== null && comparison.painDelta >= 3);
    const hasSeverePain = context.pain >= 8;

    if (hasRedFlagSymptom || hasRapidPainIncrease || hasSeverePain) {
      return 'seek-care';
    }

    const hasMonitorSymptom = context.symptoms.some(s => 
      ['Swelling', 'Warmth', 'More pain'].includes(s)
    );
    const hasVisualSpike = (comparison.visualSignalDelta !== null && comparison.visualSignalDelta >= 10);
    const hasPainSpike = (comparison.painDelta !== null && comparison.painDelta >= 2);

    if (hasMonitorSymptom || hasVisualSpike || hasPainSpike) {
      return 'monitor';
    }

    return 'normal';
  }

  private determineTrend(historyCount: number, safetyLevel: SafetyLevel, comparison: ObservationComparison): Trend {
    if (historyCount === 0) return 'baseline';
    
    if (safetyLevel === 'seek-care') return 'seek-care';
    if (safetyLevel === 'monitor') return 'monitor';

    if (comparison.painDelta !== null && comparison.visualSignalDelta !== null) {
      if (comparison.comparisonConfidence === 'low') {
        if (comparison.painDelta < 0) {
          return 'improving';
        }
        if (comparison.painDelta === 0) {
          return 'stable';
        }
      } else {
        if (comparison.painDelta < 0 && comparison.visualSignalDelta <= 0) {
          return 'improving';
        }
        if (comparison.visualSignalDelta < -5 && comparison.painDelta <= 0) {
          return 'improving';
        }
        if (comparison.painDelta === 0 && Math.abs(comparison.visualSignalDelta) <= 5) {
          return 'stable';
        }
      }
    }

    return 'stable';
  }

  private generateReasoning(comparison: ObservationComparison, context: SymptomContext, safetyLevel: SafetyLevel): string[] {
    const reasoning: string[] = [];

    if (comparison.painDelta !== null) {
      if (comparison.painDelta > 0) reasoning.push(`Reported pain increased by ${comparison.painDelta} point(s).`);
      else if (comparison.painDelta < 0) reasoning.push(`Reported pain decreased by ${Math.abs(comparison.painDelta)} point(s).`);
      else reasoning.push(`Reported pain remained stable at ${comparison.currentPain}.`);
    }

    if (comparison.visualSignalDelta !== null) {
      if (comparison.comparisonConfidence === 'low') {
        reasoning.push(`Insufficient image quality for a meaningful visual comparison.`);
      } else {
        if (comparison.visualSignalDelta > 0) reasoning.push(`Visual signal increased by ${comparison.visualSignalDelta} percentage points.`);
        else if (comparison.visualSignalDelta < 0) reasoning.push(`Visual signal decreased by ${Math.abs(comparison.visualSignalDelta)} percentage points.`);
        else reasoning.push(`Visual signal remained stable.`);
      }
    }

    if (context.symptoms.length > 0 && !context.symptoms.includes('No new symptoms')) {
      reasoning.push(`Symptoms reported: ${context.symptoms.join(', ')}.`);
    }

    if (comparison.baselinePain !== null && comparison.baselineVisualSignal !== null) {
      const painAboveBaseline = comparison.currentPain > comparison.baselinePain + 1;
      const visualAboveBaseline = comparison.currentVisualSignal > comparison.baselineVisualSignal + 5;
      
      if (painAboveBaseline && visualAboveBaseline) {
        reasoning.push('Both pain and visual signal are elevated compared to your recent rolling baseline.');
      } else if (painAboveBaseline) {
        reasoning.push('Pain is elevated compared to your recent rolling baseline.');
      } else if (visualAboveBaseline) {
        reasoning.push('Visual signal is elevated compared to your recent rolling baseline.');
      }
    }

    return reasoning;
  }

  private generateExplanation(trend: Trend, safetyLevel: SafetyLevel, reasoning: string[]): string {
    if (trend === 'baseline') {
      return "Initial observation recorded. Perform another check tomorrow to establish a baseline.";
    }
    
    if (safetyLevel === 'seek-care') {
      return "Today's observation flags potential red-flag symptoms or significant negative changes.";
    }
    
    if (safetyLevel === 'monitor') {
      return "Today's observation shows some increased symptoms or visual signals compared to recent checks.";
    }

    if (trend === 'improving') {
      return "Today's observation shows decreasing pain or visual signals, suggesting positive progression.";
    }

    return "Today's observation remains stable compared with recent observations.";
  }

  private generateSafetyPrompt(safetyLevel: SafetyLevel): string {
    if (safetyLevel === 'seek-care') {
      return 'Consider contacting a healthcare professional promptly. These observations include potential red flags.';
    }
    if (safetyLevel === 'monitor') {
      return 'A change was observed. Consider taking another standardized photo tomorrow and monitoring your symptoms closely.';
    }
    return 'Continue tracking. Observation only — not a diagnosis.';
  }
}

export const observationEngine = new PrototypeObservationEngine();
