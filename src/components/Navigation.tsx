import React from 'react';
import { NavigationTab } from '@/types';
import { Activity, PlusCircle, History, BookOpen, Sun, Moon, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <>
      {/* Desktop Header Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-surface-dark/80 border-b border-surface-border dark:border-surface-darkBorder transition-colors">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => onTabChange('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  WoundWatch <span className="text-accent-500 font-extrabold">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  <ShieldCheck className="w-3 h-3 mr-1 text-brand-500" />
                  Observation • Not diagnosis
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Your recovery, tracked over time
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 bg-surface-soft dark:bg-surface-darkSoft p-1 rounded-full border border-surface-border dark:border-surface-darkBorder">
            <button
              onClick={() => onTabChange('overview')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-500'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onTabChange('timeline')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'timeline'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-500'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => onTabChange('careguide')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'careguide'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-500'
              }`}
            >
              CareGuide
            </button>
            <button
              onClick={() => onTabChange('report')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-500'
              }`}
            >
              Report
            </button>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTabChange('check')}
              className="hidden sm:inline-flex items-center justify-center space-x-1.5 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Check</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-xl bg-surface-soft dark:bg-surface-darkSoft border border-surface-border dark:border-surface-darkBorder flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-lg border-t border-surface-border dark:border-surface-darkBorder px-4 py-2 pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Overview */}
          <button
            onClick={() => onTabChange('overview')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'text-brand-500 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Overview</span>
          </button>

          {/* Start Recovery Check (Dominant Center CTA) */}
          <button
            onClick={() => onTabChange('check')}
            className="flex flex-col items-center -mt-5"
          >
            <motion.div
              whileTap={{ scale: 0.92 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                activeTab === 'check'
                  ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900'
                  : 'bg-brand-500 text-white shadow-brand-500/30'
              }`}
            >
              <PlusCircle className="w-7 h-7" />
            </motion.div>
            <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-1">
              New Check
            </span>
          </button>

          {/* Timeline */}
          <button
            onClick={() => onTabChange('timeline')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'timeline'
                ? 'text-brand-500 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Timeline</span>
          </button>

          {/* CareGuide */}
          <button
            onClick={() => onTabChange('careguide')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'careguide'
                ? 'text-brand-500 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">CareGuide</span>
          </button>
        </div>
      </nav>
    </>
  );
};
