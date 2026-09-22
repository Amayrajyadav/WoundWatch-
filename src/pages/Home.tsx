import React from 'react';
import { RecoveryCheck } from '@/types';
import { PlusCircle, Activity, History, ArrowRight, ShieldCheck, Camera, Volume2, Calendar, Sparkles, BookOpen, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeProps {
  checks: RecoveryCheck[];
  onStartCheck: () => void;
  onNavigateTimeline: () => void;
  onNavigateCareGuide: () => void;
}

export const Home: React.FC<HomeProps> = ({
  checks,
  onStartCheck,
  onNavigateTimeline,
  onNavigateCareGuide,
}) => {
  const latestCheck = checks.length > 0 ? checks[0] : null;
  const count = checks.length;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-950 to-surface-dark p-6 sm:p-8 text-white shadow-xl border border-brand-800/40">
        {/* Background glow decoration */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Observation • Not diagnosis</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              WoundWatch <span className="text-brand-400">AI</span>
            </h1>
            <p className="text-base sm:text-lg text-brand-100/90 font-medium mt-1">
              "Your recovery, tracked over time."
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
            Track how a minor wound changes over time using your phone camera, symptoms, and voice — turning observations into a longitudinal recovery timeline.
          </p>

          {/* 3-Step Core Workflow Bar */}
          <div className="pt-1 pb-1 grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-semibold text-brand-200">
            <div className="bg-brand-950/60 p-2 rounded-xl border border-brand-800/50 flex flex-col items-center">
              <Camera className="w-4 h-4 mb-1 text-brand-400" />
              <span>1. Camera</span>
            </div>
            <div className="bg-brand-950/60 p-2 rounded-xl border border-brand-800/50 flex flex-col items-center">
              <Volume2 className="w-4 h-4 mb-1 text-brand-400" />
              <span>2. Context</span>
            </div>
            <div className="bg-brand-950/60 p-2 rounded-xl border border-brand-800/50 flex flex-col items-center">
              <History className="w-4 h-4 mb-1 text-brand-400" />
              <span>3. Timeline</span>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              onClick={onStartCheck}
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-400 text-white font-extrabold px-8 py-4 rounded-2xl shadow-glow flex items-center justify-center space-x-2 transition-all text-base tracking-wide"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Start Recovery Check</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Current Status Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Total Checks */}
        <div className="bg-white dark:bg-surface-darkSoft p-4 rounded-2xl border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Total Checks</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {count}
          </p>
          <span className="text-[11px] text-slate-500">Saved in timeline</span>
        </div>

        {/* Card 2: Latest Pain Score */}
        <div className="bg-white dark:bg-surface-darkSoft p-4 rounded-2xl border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Latest Pain Score</span>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
            {latestCheck ? `${latestCheck.context.pain}/10` : '—'}
          </p>
          <span className="text-[11px] text-slate-500">
            {latestCheck ? 'User reported' : 'Awaiting check'}
          </span>
        </div>

        {/* Card 3: Observable Visual Signal */}
        <div className="bg-white dark:bg-surface-darkSoft p-4 rounded-2xl border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Visual Signal</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {latestCheck ? `${latestCheck.visualSignal.redDominance}%` : '—'}
          </p>
          <span className="text-[11px] text-slate-500">
            {latestCheck ? 'Observable signal' : 'Awaiting image'}
          </span>
        </div>

        {/* Card 4: Current Trend */}
        <div className="bg-white dark:bg-surface-darkSoft p-4 rounded-2xl border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Current Trend</span>
          <div className="pt-0.5">
            {latestCheck ? (
              <span
                className={`inline-flex items-center text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  latestCheck.trend === 'Improving'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : latestCheck.trend === 'Needs attention'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : latestCheck.trend === 'Baseline'
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                }`}
              >
                {latestCheck.trend}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400">Not available</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {count >= 2 ? 'Progression signal' : count === 1 ? 'Baseline set' : 'No data'}
          </span>
        </div>
      </div>

      {/* Recent Observation / Empty State Card */}
      {latestCheck ? (
        <div className="bg-white dark:bg-surface-darkSoft rounded-3xl border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Recent Observation
              </h3>
            </div>
            <button
              onClick={onNavigateTimeline}
              className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center space-x-1"
            >
              <span>View Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-start space-x-4">
            {latestCheck.imageUrl && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                <img
                  src={latestCheck.imageUrl}
                  alt="Recent Observation"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(latestCheck.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
                <span className="font-bold text-brand-500">{latestCheck.trend}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 line-clamp-2 text-xs leading-relaxed">
                {latestCheck.explanation}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* STATE A — CLEAN POLISHED EMPTY STATE CARD */
        <div className="bg-white dark:bg-surface-darkSoft rounded-3xl border border-surface-border dark:border-surface-darkBorder p-6 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-500 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No Recovery Observations Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Complete your first recovery check to record baseline photo features, pain score, and symptoms.
            </p>
          </div>
          <div className="pt-1">
            <button
              onClick={onStartCheck}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Recovery Check</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Timeline Quick Action */}
        <div
          onClick={onNavigateTimeline}
          className="bg-white dark:bg-surface-darkSoft p-5 rounded-3xl border border-surface-border dark:border-surface-darkBorder hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer transition-all shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-500 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                Longitudinal Timeline
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare progression & observations over time
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
        </div>

        {/* CareGuide Quick Action */}
        <div
          onClick={onNavigateCareGuide}
          className="bg-white dark:bg-surface-darkSoft p-5 rounded-3xl border border-surface-border dark:border-surface-darkBorder hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer transition-all shadow-sm flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                Educational CareGuide
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safety boundaries, photo guidance & FAQs
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
