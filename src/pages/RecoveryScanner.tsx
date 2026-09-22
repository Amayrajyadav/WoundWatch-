import React, { useState, useEffect } from 'react';
import { CameraCapture, ImageSource } from '@/components/CameraCapture';
import { SymptomSelector } from '@/components/SymptomSelector';
import { observationEngine } from '@/services/observationEngine';
import { saveCheck, getSavedChecks } from '@/services/storage';
import { RecoveryCheck, SymptomContext, ObservationResult } from '@/types';
import { ArrowLeft, Loader2, CheckCircle2, ScanFace, Activity, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

type ScanStage = 'capture' | 'scanning' | 'symptoms' | 'result';

export function RecoveryScanner({ onComplete, onCancel }: Props) {
  const [stage, setStage] = useState<ScanStage>('capture');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Scanning animation steps
  const [scanProgress, setScanProgress] = useState(0);
  const scanTasks = [
    'IMAGE QUALITY CHECK',
    'WOUND REGION ISOLATION',
    'VISUAL FEATURE EXTRACTION',
    'TEMPORAL ALIGNMENT',
    'BASELINE COMPARISON',
    'MULTIVARIATE ANOMALY DETECTION'
  ];

  const [symptomContext, setSymptomContext] = useState<SymptomContext>({
    pain: 0,
    symptoms: [],
    voiceNote: '',
  });

  const [result, setResult] = useState<ObservationResult | null>(null);

  const handleCapture = (img: string, source: ImageSource) => {
    setImageSrc(img);
  };

  const startScan = () => {
    if (!imageSrc) return;
    setStage('scanning');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setScanProgress(progress);
      if (progress >= scanTasks.length) {
        clearInterval(interval);
        setTimeout(() => setStage('symptoms'), 600);
      }
    }, 400); // Faster iteration for the checklist
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;
    
    // Fake a quick loader for the final crunch
    const existingChecks = getSavedChecks();
    const analysis = await observationEngine.analyze(imageSrc, symptomContext, existingChecks);
    setResult(analysis);
    setStage('result');
  };

  const handleSave = () => {
    if (!result || !imageSrc) return;
    
    const newEntry: RecoveryCheck = {
      id: `check-${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageUrl: imageSrc,
      visualSignal: result.visualSignal,
      context: symptomContext,
      trend: result.trend,
      safetyLevel: result.safetyLevel,
      comparison: result.comparison,
      reasoning: result.reasoning,
      explanation: result.explanation,
      safetyPrompt: result.safetyPrompt,
      expectedRange: result.expectedRange,
      anomalies: result.anomalies,
    };

    saveCheck(newEntry);
    onComplete();
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto pb-24">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 flex justify-between items-center">
        <button onClick={onCancel} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Cancel Scan</span>
        </button>
        {stage !== 'result' && (
          <div className="flex items-center gap-2 text-blue-400">
            <ScanFace className="w-5 h-5" />
            <span className="font-bold tracking-wider text-sm">RECOVERY SCANNER</span>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          
          {/* STAGE 1: CAPTURE */}
          {stage === 'capture' && (
            <motion.div 
              key="capture"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 p-4"
            >
              <CameraCapture 
                capturedImage={imageSrc}
                imageSource="camera"
                onImageCaptured={handleCapture}
                onNextStep={startScan}
              />
            </motion.div>
          )}

          {/* STAGE 2: SCANNING */}
          {stage === 'scanning' && imageSrc && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-400 mb-6 pb-4 border-b border-slate-800">
                  <Activity className="w-4 h-4" />
                  <span>INTELLIGENCE ENGINE RUNNING</span>
                </div>
                
                <div className="space-y-4">
                  {scanTasks.map((task, index) => {
                    const isComplete = scanProgress > index;
                    const isActive = scanProgress === index;
                    const isPending = scanProgress < index;
                    
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className={`${isComplete ? 'text-slate-300' : isActive ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
                          {task}
                        </span>
                        {isComplete && <span className="text-emerald-400">✓</span>}
                        {isActive && <span className="text-blue-400 animate-pulse">...</span>}
                        {isPending && <span className="text-slate-700">WAIT</span>}
                      </div>
                    );
                  })}
                </div>
                
                {scanProgress >= scanTasks.length && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 pt-4 border-t border-slate-800 text-emerald-400 font-bold text-center"
                  >
                    ANALYSIS COMPLETE
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* STAGE 3: SYMPTOMS */}
          {stage === 'symptoms' && (
            <motion.div 
              key="symptoms"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex-1 p-4 flex flex-col"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white">How does it feel today?</h2>
                  <p className="text-slate-400">Complete the intelligence profile.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <SymptomSelector 
                    context={symptomContext}
                    onChange={setSymptomContext}
                    onNextStep={handleAnalyze}
                    onPrevStep={() => {}} // Disabled to keep flow forward
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 4: RESULT */}
          {stage === 'result' && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 p-4 flex flex-col items-center justify-center text-center"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
                {/* Background glow based on safety */}
                <div className={`absolute -inset-10 blur-3xl opacity-20 ${
                  result.safetyLevel === 'seek-care' ? 'bg-red-500' : 
                  result.safetyLevel === 'monitor' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                <div className="relative z-10">
                  {result.safetyLevel === 'normal' ? (
                    <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
                  ) : result.safetyLevel === 'monitor' ? (
                    <Activity className="w-20 h-20 text-amber-400 mx-auto mb-4" />
                  ) : (
                    <ShieldAlert className="w-20 h-20 text-red-400 mx-auto mb-4" />
                  )}

                  <h2 className="text-3xl font-extrabold text-white mb-2">Scan Complete</h2>
                  
                  <div className="bg-slate-950 rounded-xl p-4 my-6 text-left border border-slate-800">
                    <p className="text-sm text-slate-300 font-medium mb-2">{result.explanation}</p>
                    {result.anomalies && result.anomalies.length > 0 && (
                      <ul className="text-xs text-amber-400 list-disc list-inside mt-3 space-y-1">
                        {result.anomalies.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    )}
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/50 transition-transform active:scale-95"
                  >
                    Save to Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
