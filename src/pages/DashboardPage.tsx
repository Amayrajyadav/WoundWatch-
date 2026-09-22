import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getSavedChecks, clearAllChecks } from '../services/storage';
import { RecoveryCheck } from '../types';
import { RadarChart } from '../components/RadarChart';
import { TrajectoryChart } from '../components/TrajectoryChart';
import { Activity, AlertTriangle, CheckCircle, Camera, Upload, ArrowRight, ShieldCheck, Lock, Eye, Play, ScanFace, ChevronRight } from 'lucide-react';

interface Props {
  checks: RecoveryCheck[];
  onNewCheck: () => void;
  onOpenReport: () => void;
  isDemoMode: boolean;
  onLoadDemo?: (scenario: 'improving' | 'change_point' | 'low_confidence' | 'seek_care') => void;
}

export function DashboardPage({ checks: initialChecks, onNewCheck, onOpenReport, isDemoMode, onLoadDemo }: Props) {
  const checks = useMemo(() => {
    return [...initialChecks].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [initialChecks]);

  const current = checks[0];
  const previous = checks[1];
  const oldest = checks[checks.length - 1];

  const toRadarData = (c: RecoveryCheck) => ({
    pain: (c.context.pain / 10) * 100,
    visual: c.visualSignal.regionRedDominance ?? c.visualSignal.redDominance,
    area: c.visualSignal.observableArea ? Math.min(100, (c.visualSignal.observableArea / 1250) * 100) : 50,
    symptoms: Math.min(100, c.context.symptoms.length * 25),
  });

  const radarCurrent = current ? toRadarData(current) : undefined;
  const radarPrev = previous ? toRadarData(previous) : undefined;

  const trajectoryData = useMemo(() => {
    if (checks.length === 0) return [];
    const ascending = [...checks].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const firstTime = new Date(ascending[0].timestamp).getTime();

    return ascending.map((c, i) => {
      const msDiff = new Date(c.timestamp).getTime() - firstTime;
      const days = Math.round(msDiff / (1000 * 60 * 60 * 24)) + 1;
      const painScore = 100 - ((c.context.pain / 10) * 100);
      const visualScore = 100 - (c.visualSignal.regionRedDominance ?? c.visualSignal.redDominance);
      const combined = (painScore * 0.4) + (visualScore * 0.6);
      return { day: days, value: combined, label: i === ascending.length - 1 ? 'Today' : `Day ${days}` };
    });
  }, [checks]);

  // Section animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (checks.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-xl mx-auto space-y-8">
          <Activity className="w-16 h-16 text-blue-500 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Understand how your recovery is changing.
          </h1>
          <p className="text-lg text-slate-400 font-medium">
            WoundWatch turns repeated observations into a private, explainable recovery trajectory — directly on your device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button
              onClick={onNewCheck}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ScanFace className="w-5 h-5" /> Start Recovery Scan
            </button>
            {onLoadDemo && (
              <button
                onClick={() => onLoadDemo('improving')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 text-blue-400" /> Explore Demo
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 font-semibold tracking-wider pt-6">
            100% ON-DEVICE · NO CLOUD UPLOAD · OBSERVATION ONLY
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-200 pb-32">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-24">
        
        {/* HERO SECTION */}
        <section className="pt-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Understand how your recovery is changing.
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed font-medium">
                WoundWatch turns repeated wound observations into a private, explainable recovery trajectory.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={onNewCheck}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ScanFace className="w-5 h-5" /> Scan Recovery
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-500 tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% on-device · No cloud upload
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                <h3 className="text-xs font-bold text-slate-500 tracking-widest mb-6">RECOVERY TRAJECTORY</h3>
                <TrajectoryChart data={trajectoryData} height={300} />
                <div className="mt-6 flex justify-between text-xs font-semibold border-t border-slate-800 pt-4">
                  <div className="text-slate-400">
                    <span className="text-white text-lg block">{current.context.pain} <span className="text-slate-500 text-sm">→ {previous?.context.pain || current.context.pain}</span></span>
                    PAIN SCORE
                  </div>
                  <div className="text-slate-400 text-right">
                    <span className="text-white text-lg block">{Math.round(radarCurrent?.visual || 0)}%</span>
                    VISUAL SIGNAL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE STATUS STRIP */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            {current.changePoint?.detected ? (
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            ) : (
              <div className="relative">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute inset-0 opacity-50" />
                <div className="w-4 h-4 bg-emerald-500 rounded-full relative z-10" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xs font-bold text-slate-500 tracking-widest mb-1">RECOVERY STATUS</h3>
            <h2 className="text-2xl font-bold text-white mb-2">
              {current.changePoint?.detected ? 'Trajectory Shift Detected' : 'Improving'}
            </h2>
            <p className="text-slate-400 text-sm">
              {current.changePoint?.detected 
                ? 'Your recent observations show a deviation from your established baseline. Review the evidence below.'
                : 'Your recent observations remain consistent with your personal recovery trajectory.'}
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6">
            Last scan<br/>
            <span className="text-slate-300 font-semibold">{new Date(current.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </motion.section>

        {/* BIG CTA */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-3xl p-8 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">＋ Scan Recovery</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Capture today's wound image to update your trajectory and check for anomalies.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onNewCheck} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors">
                <Camera className="w-5 h-5 text-blue-400" /> Take Photo
              </button>
              <button onClick={onNewCheck} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors">
                <Upload className="w-5 h-5 text-blue-400" /> Upload Image
              </button>
            </div>
          </div>
        </motion.section>

        {/* FINGERPRINT & WHAT CHANGED */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Your Recovery Fingerprint</h2>
              <p className="text-slate-400 mb-10">A multidimensional view of your latest observation against your previous baseline.</p>
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center">
                {radarCurrent && <RadarChart data={radarCurrent} previousData={radarPrev} size={280} />}
                <div className="flex gap-6 mt-8 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-blue-400">
                    <div className="w-3 h-3 rounded-full bg-blue-400/30 border border-blue-400" /> Today
                  </div>
                  {radarPrev && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-3 h-3 rounded-full bg-slate-500/20 border border-slate-500" /> Previous
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* What Changed */}
            {previous && (
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-extrabold text-white mb-2">What changed?</h2>
                <p className="text-slate-400 mb-8">Since your last scan.</p>
                
                <div className="space-y-4">
                  {current.anomalyEvidence?.map((ev, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-1">{ev.metric}</div>
                        <div className="text-xl font-bold text-white flex items-center gap-3">
                          <span className="text-slate-400">{ev.previousValue}</span> 
                          <ArrowRight className="w-4 h-4 text-slate-600" /> 
                          {ev.currentValue}
                        </div>
                      </div>
                      <div className={`font-mono font-bold text-sm px-3 py-1.5 rounded-lg ${ev.delta.includes('-') || ev.delta.includes('↓') || ev.delta === 'None' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {ev.delta}
                      </div>
                    </div>
                  ))}
                  {(!current.anomalyEvidence || current.anomalyEvidence.length === 0) && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold">Stable Trajectory</div>
                        <div className="text-slate-400 text-sm">No significant multi-metric deviations detected.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* TIMELINE */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <h2 className="text-3xl font-extrabold text-white mb-8">Your Journey</h2>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
            <div className="flex overflow-x-auto pb-8 pt-4 gap-4 px-4 snap-x z-10 relative hide-scrollbar">
              {[...checks].reverse().map((check, i) => (
                <div key={check.id} className="snap-center shrink-0 w-32 flex flex-col items-center">
                  <div className="text-xs font-bold text-slate-500 mb-4 tracking-widest">
                    DAY {i + 1}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-4 mb-4 ${i === checks.length - 1 ? 'bg-blue-400 border-slate-950 ring-2 ring-blue-400/50' : 'bg-slate-700 border-slate-950'}`} />
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 w-full">
                    {check.imageUrl && (
                      <img src={check.imageUrl} alt="Wound scan" className="w-full h-16 object-cover rounded-lg mb-2 opacity-80" />
                    )}
                    <div className="text-xs text-center font-medium text-slate-400">
                      Pain {check.context.pain}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* BEFORE & AFTER + VISUAL SIGNAL */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">See the change</h2>
              <p className="text-slate-400 mb-8">{checks.length} observations • {Math.round((new Date(current.timestamp).getTime() - new Date(oldest.timestamp).getTime()) / 86400000) + 1} days apart</p>
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-bold text-slate-500 text-center">DAY 1</div>
                  <img src={oldest.imageUrl!} alt="Day 1" className="w-full aspect-square object-cover rounded-2xl grayscale opacity-50" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-bold text-blue-400 text-center">TODAY</div>
                  <img src={current.imageUrl!} alt="Today" className="w-full aspect-square object-cover rounded-2xl" />
                </div>
              </div>
              <div className="mt-4 text-center font-mono text-sm text-slate-300">
                Visual signal: <span className="text-slate-500">{Math.round(oldest.visualSignal.redDominance)}%</span> → <span className="text-white font-bold">{Math.round(current.visualSignal.redDominance)}%</span>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">What WoundWatch sees</h2>
              <p className="text-slate-400 mb-8">Observable color signal extracted from the selected region.</p>
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative aspect-[4/3] flex items-center justify-center group">
                <img src={current.imageUrl!} alt="Wound map" className="w-full h-full object-cover opacity-30" />
                
                {/* Simulated CV Overlay Grid */}
                <div className="absolute inset-4 grid grid-cols-8 grid-rows-6 gap-1 opacity-60">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className={`rounded-sm transition-opacity duration-1000 ${
                      [19, 20, 27, 28, 29, 35].includes(i) ? 'bg-red-500/80 animate-pulse' : 
                      [18, 21, 26, 30, 34, 36].includes(i) ? 'bg-amber-500/40' : 
                      'bg-slate-800/20 border border-slate-700/20'
                    }`} />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="text-xs font-medium text-slate-500">Lower signal</div>
                <div className="flex-1 h-2 bg-gradient-to-r from-slate-800 via-amber-500 to-red-500 rounded-full" />
                <div className="text-xs font-medium text-slate-500">Higher signal</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FORECAST */}
        {current.expectedRange && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl font-extrabold text-white mb-2">What should we expect next?</h2>
              <p className="text-slate-400 mb-10">Based on your established trajectory. Not a medical prediction.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
                  <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">PAIN RANGE</div>
                  <div className="flex items-end gap-2 text-white font-mono text-2xl font-bold">
                    {Math.max(0, current.context.pain - 1)} <span className="text-slate-600 text-sm mb-1">TO</span> {Math.min(10, current.context.pain + 1)}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
                  <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">VISUAL SIGNAL</div>
                  <div className="flex items-end gap-2 text-white font-mono text-2xl font-bold">
                    {Math.max(0, Math.round(current.visualSignal.redDominance - 5))}% <span className="text-slate-600 text-sm mb-1">TO</span> {Math.round(current.visualSignal.redDominance + 2)}%
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
                  <div className="text-xs font-bold text-slate-500 tracking-widest mb-4">OBSERVABLE AREA</div>
                  <div className="flex items-end gap-2 text-white font-bold text-lg leading-tight">
                    85–95% of<br/>recent baseline
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* HOW IT WORKS / PRIVACY */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-8">How it works</h2>
              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-slate-800">
                {[
                  { step: '01', title: 'Capture', desc: 'Photo or upload' },
                  { step: '02', title: 'Standardize', desc: 'Quality & region mapping' },
                  { step: '03', title: 'Analyze', desc: 'Visual signal extraction' },
                  { step: '04', title: 'Track', desc: 'Personal trajectory update' }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center font-mono text-sm font-bold text-slate-400">
                      {s.step}
                    </div>
                    <div className="pt-2">
                      <div className="text-white font-bold text-lg">{s.title}</div>
                      <div className="text-slate-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-extrabold text-white mb-2">Your data stays here.</h2>
              <p className="text-slate-400 mb-8">Private by design. No cloud processing required.</p>
              
              <ul className="space-y-4 font-medium text-slate-300">
                <li className="flex items-center gap-3"><Lock className="w-5 h-5 text-emerald-400" /> Image processing happens locally</li>
                <li className="flex items-center gap-3"><Lock className="w-5 h-5 text-emerald-400" /> Recovery history stays on-device</li>
                <li className="flex items-center gap-3"><Lock className="w-5 h-5 text-emerald-400" /> No wound images uploaded</li>
                <li className="flex items-center gap-3"><Lock className="w-5 h-5 text-emerald-400" /> Works completely offline</li>
              </ul>
              
              <div className="mt-10 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-widest text-emerald-500">SYSTEM READY</span>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
