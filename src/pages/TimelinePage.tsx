import React, { useState } from 'react';
import { RecoveryCheck, Trend } from '@/types';
import { deleteCheck } from '@/services/storage';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { History, Calendar, Trash2, TrendingDown, TrendingUp, Minus, ShieldAlert, Activity, Sparkles, ArrowDownRight, PlusCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelinePageProps {
  checks: RecoveryCheck[];
  onRefreshTimeline: () => void;
  onStartNewCheck: () => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  checks,
  onRefreshTimeline,
  onStartNewCheck,
}) => {
  const [filterTrend, setFilterTrend] = useState<string>('all');

  const filteredChecks = checks.filter((item) => {
    if (filterTrend === 'all') return true;
    return item.trend.toLowerCase().replace(/\s+/g, '') === filterTrend;
  });

  const handleDeleteItem = (id: string) => {
    deleteCheck(id);
    onRefreshTimeline();
  };

  const getTrendBadge = (trend: Trend) => {
    switch (trend) {
      case 'Improving':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Improving</span>
          </span>
        );
      case 'Needs attention':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Needs attention</span>
          </span>
        );
      case 'Baseline':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Baseline</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-bold text-xs">
            <Minus className="w-3.5 h-3.5" />
            <span>Stable</span>
          </span>
        );
    }
  };

  // Progression metrics calculation ONLY between actual saved observations
  const oldestCheck = checks.length > 1 ? checks[checks.length - 1] : null;
  const newestCheck = checks.length > 1 ? checks[0] : null;

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-surface-darkSoft p-6 rounded-3xl border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-1">
        <div className="flex items-center space-x-2">
          <History className="w-6 h-6 text-brand-500" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {checks.length === 0 ? 'Your Recovery Timeline Starts Here' : 'Longitudinal Recovery Timeline'}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
          {checks.length === 0
            ? 'Complete your first recovery check to begin tracking observable changes over time.'
            : 'Observe changes over time rather than interpreting one image in isolation.'}
        </p>
      </div>

      {/* Progression Summary Highlight Card — ONLY shown when at least 2 actual checks exist */}
      {oldestCheck && newestCheck && checks.length >= 2 && (
        <div className="bg-gradient-to-r from-brand-900 to-indigo-950 p-5 rounded-3xl text-white shadow-md border border-brand-800/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider block">
              Longitudinal Change Over Time
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              Pain score change: <span className="font-extrabold text-amber-300">{oldestCheck.context.pain}/10</span> → <span className="font-extrabold text-emerald-300">{newestCheck.context.pain}/10</span>
            </p>
            <p className="text-[11px] text-slate-300">
              Observable visual signal: {oldestCheck.visualSignal.redDominance}% → {newestCheck.visualSignal.redDominance}%
            </p>
          </div>
          <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center space-x-1 shrink-0">
            <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            <span>{newestCheck.trend}</span>
          </div>
        </div>
      )}

      {/* Baseline Callout Banner — Shown when exactly 1 check exists */}
      {checks.length === 1 && (
        <div className="bg-brand-50 dark:bg-brand-950/60 p-4 rounded-2xl border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-200 text-xs font-semibold flex items-center justify-between">
          <span>Baseline observation recorded. Complete a second check to begin tracking progression.</span>
          <button
            onClick={onStartNewCheck}
            className="ml-3 px-3 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs shrink-0"
          >
            + Add Check
          </button>
        </div>
      )}

      {/* Filter Tabs using AnimatedBackground (Shown if checks exist) */}
      {checks.length > 0 && (
        <div className="bg-white dark:bg-surface-darkSoft p-1.5 rounded-2xl border border-surface-border dark:border-surface-darkBorder inline-flex w-full justify-around">
          <AnimatedBackground
            defaultValue="all"
            value={filterTrend}
            onValueChange={(val) => setFilterTrend(val || 'all')}
            className="rounded-xl bg-brand-500 text-white shadow-sm"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
          >
            <button
              data-id="all"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterTrend === 'all' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({checks.length})
            </button>
            <button
              data-id="improving"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterTrend === 'improving' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Improving
            </button>
            <button
              data-id="needsattention"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterTrend === 'needsattention' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Needs Attention
            </button>
          </AnimatedBackground>
        </div>
      )}

      {/* Timeline Entries List */}
      {checks.length === 0 ? (
        <div className="bg-white dark:bg-surface-darkSoft p-10 rounded-3xl border border-surface-border dark:border-surface-darkBorder text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-500 flex items-center justify-center mx-auto">
            <History className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              No Saved Observations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your recovery timeline starts here. Perform your first recovery check using your camera or demo image.
            </p>
          </div>
          <button
            onClick={onStartNewCheck}
            className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-glow inline-flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start First Recovery Check</span>
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-brand-200 dark:before:bg-brand-900">
          <AnimatePresence>
            {filteredChecks.map((item, index) => {
              const dateObj = new Date(item.timestamp);
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  {/* Timeline node icon on vertical line */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-7 h-7 rounded-full bg-white dark:bg-surface-dark border-2 border-brand-500 flex items-center justify-center text-brand-500 shadow-sm z-10">
                    <Activity className="w-3.5 h-3.5" />
                  </div>

                  {/* Card content */}
                  <div className="bg-white dark:bg-surface-darkSoft rounded-3xl p-5 border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-3.5 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-brand-500" />
                        <span>{formattedDate} • {formattedTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendBadge(item.trend)}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Image & Key Metrics */}
                    <div className="flex items-start space-x-4">
                      {item.imageUrl && (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800 relative">
                          <img
                            src={item.imageUrl}
                            alt="Observation check"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2 flex-1 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-surface-soft dark:bg-surface-dark p-2 rounded-xl">
                            <span className="text-slate-400 block text-[10px]">Pain Score</span>
                            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                              {item.context.pain} / 10
                            </span>
                          </div>
                          <div className="bg-surface-soft dark:bg-surface-dark p-2 rounded-xl">
                            <span className="text-slate-400 block text-[10px]">Observable Signal</span>
                            <span className="font-extrabold text-brand-600 dark:text-brand-400 text-sm">
                              {item.visualSignal.redDominance}%
                            </span>
                          </div>
                        </div>

                        {/* Symptoms tags */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.context.symptoms.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 font-semibold text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-surface-dark p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {item.explanation}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
