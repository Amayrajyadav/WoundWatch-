import React from 'react';
import { NavigationTab } from '@/types';
import { Sun, Moon } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          className="text-white font-extrabold tracking-widest cursor-pointer select-none text-sm"
          onClick={() => onTabChange('dashboard')}
        >
          WOUNDWATCH
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex items-center space-x-4 sm:space-x-8 text-xs sm:text-sm font-medium">
          {['dashboard', 'check', 'timeline', 'report'].map(tab => {
            const label = tab === 'check' ? 'Scan' : tab === 'dashboard' ? 'Overview' : tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab as NavigationTab)}
                className={`transition-colors ${activeTab === tab || (activeTab === 'overview' && tab === 'dashboard') ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* ON DEVICE STATUS & DARK MODE */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>On-device</span>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
