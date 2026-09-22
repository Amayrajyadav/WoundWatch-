import React, { useState, useEffect } from 'react';
import { NavigationTab, RecoveryCheck } from '@/types';
import { getSavedChecks } from '@/services/storage';
import { Navigation } from '@/components/Navigation';
import { Home } from '@/pages/Home';
import { RecoveryCheckPage } from '@/pages/RecoveryCheck';
import { TimelinePage } from '@/pages/TimelinePage';
import { CareGuidePage } from '@/pages/CareGuidePage';
import { ReportPage } from '@/pages/ReportPage';
import { DEMO_CHECKS } from '@/data/demoCase';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('woundwatch_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [checks, setChecks] = useState<RecoveryCheck[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('woundwatch_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('woundwatch_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    setChecks(getSavedChecks());
  }, []);

  const refreshChecks = () => {
    setChecks(getSavedChecks());
  };

  const handleCompleteCheck = () => {
    // Completing a real check always exits demo mode and reloads real data
    setIsDemoMode(false);
    setChecks(getSavedChecks());
    setActiveTab('timeline');
  };

  const loadDemo = () => {
    setIsDemoMode(true);
    setChecks(DEMO_CHECKS);
    setActiveTab('timeline');
  };

  const clearDemo = () => {
    setIsDemoMode(false);
    setChecks(getSavedChecks());
  };

  return (
    <div className="min-h-screen bg-surface-soft dark:bg-surface-dark text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Demo mode banner */}
      {isDemoMode && (
        <div className="bg-accent-400 text-brand-900 text-xs font-bold flex items-center justify-between px-4 py-2">
          <span>▶ Demo Mode — synthetic example data. Not real clinical observations.</span>
          <button
            onClick={clearDemo}
            className="ml-4 underline underline-offset-2 hover:no-underline transition-all"
          >
            Clear demo
          </button>
        </div>
      )}

      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <Home
            checks={checks}
            isDemoMode={isDemoMode}
            onStartCheck={() => setActiveTab('check')}
            onLoadDemo={loadDemo}
            onNavigateTimeline={() => setActiveTab('timeline')}
            onNavigateCareGuide={() => setActiveTab('careguide')}
          />
        )}

        {activeTab === 'check' && (
          <RecoveryCheckPage
            onComplete={handleCompleteCheck}
            onCancel={() => setActiveTab('overview')}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelinePage
            checks={checks}
            isDemoMode={isDemoMode}
            onRefreshTimeline={refreshChecks}
            onStartNewCheck={() => setActiveTab('check')}
            onOpenReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'careguide' && <CareGuidePage />}

        {activeTab === 'report' && (
          <ReportPage
            checks={checks}
            onBack={() => setActiveTab('timeline')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
