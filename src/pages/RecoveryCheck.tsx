import React, { useState } from 'react';
import { SymptomContext, ObservationResult, RecoveryCheck as RecoveryCheckType } from '@/types';
import { CameraCapture } from '@/components/CameraCapture';
import { SymptomSelector } from '@/components/SymptomSelector';
import { RecoverySnapshot } from '@/components/RecoverySnapshot';
import { observationEngine } from '@/services/observationEngine';
import { saveCheck, getSavedChecks } from '@/services/storage';
import { Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecoveryCheckProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const RecoveryCheckPage: React.FC<RecoveryCheckProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [symptomContext, setSymptomContext] = useState<SymptomContext>({
    pain: 0,
    symptoms: [],
    voiceNote: '',
  });
  const [observationResult, setObservationResult] = useState<ObservationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleNextToContext = () => {
    if (imageSrc) {
      setStep(2);
    }
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;
    setStep(3);
    setIsAnalyzing(true);

    try {
      const existingChecks = getSavedChecks();
      const result = await observationEngine.analyze(imageSrc, symptomContext, existingChecks.length);
      setObservationResult(result);
    } catch (err) {
      console.error('Error during analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveObservation = () => {
    if (!observationResult || !imageSrc) return;

    const newEntry: RecoveryCheckType = {
      id: `check-${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageUrl: imageSrc,
      visualSignal: observationResult.visualSignal,
      context: symptomContext,
      trend: observationResult.trend,
      explanation: observationResult.explanation,
      safetyPrompt: observationResult.safetyPrompt,
    };

    saveCheck(newEntry);
    onComplete();
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header & Step Indicator */}
      <div className="flex items-center justify-between border-b border-surface-border dark:border-surface-darkBorder pb-4">
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Check</span>
        </button>

        {/* Wizard Step Pills */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNumber) => {
            const isCurrent = step === stepNumber;
            const isCompleted = step > stepNumber;

            return (
              <div
                key={stepNumber}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-brand-500 text-white shadow-subtle ring-4 ring-brand-100 dark:ring-brand-950'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </div>
            );
          })}
        </div>

        <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
          Step {step} of 3
        </span>
      </div>

      {/* Step Title Header */}
      <div className="text-center max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {step === 1 && 'Capture Recovery Photo'}
          {step === 2 && 'Report Symptoms & Context'}
          {step === 3 && 'Recovery Snapshot'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {step === 1 && 'Use your phone camera or synthetic demo image to log visual progress.'}
          {step === 2 && 'Record pain score, observable symptoms, and optional voice notes.'}
          {step === 3 && 'Observable visual signals and safe recovery trend assessment.'}
        </p>
      </div>

      {/* Step Content Components with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && (
            <CameraCapture
              capturedImage={imageSrc}
              onImageCaptured={(img) => setImageSrc(img)}
              onNextStep={handleNextToContext}
            />
          )}

          {step === 2 && (
            <SymptomSelector
              context={symptomContext}
              onChange={(updated) => setSymptomContext(updated)}
              onNextStep={handleAnalyze}
              onPrevStep={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <RecoverySnapshot
              imageSrc={imageSrc}
              context={symptomContext}
              result={observationResult}
              isAnalyzing={isAnalyzing}
              onSave={handleSaveObservation}
              onPrevStep={() => setStep(2)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
