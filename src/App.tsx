import React, { useState, useEffect } from 'react';
import { NavigationTab, RecoveryCheck } from '@/types';
import { getSavedChecks } from '@/services/storage';
import { Navigation } from '@/components/Navigation';
import { Home } from '@/pages/Home';
import { RecoveryCheckPage } from '@/pages/RecoveryCheck';
import { TimelinePage } from '@/pages/TimelinePage';
import { CareGuidePage } from '@/pages/CareGuidePage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
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
    // Sync dark mode class on HTML document
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
    // Load initial timeline checks
    setChecks(getSavedChecks());
  }, []);

  const refreshChecks = () => {
    setChecks(getSavedChecks());
  };

  const handleCompleteCheck = () => {
    refreshChecks();
    setActiveTab('timeline');
  };

  return (
    <div className="min-h-screen bg-surface-soft dark:bg-surface-dark text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Navigation Top Header & Bottom Mobile Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <Home
            checks={checks}
            onStartCheck={() => setActiveTab('check')}
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
            onRefreshTimeline={refreshChecks}
            onStartNewCheck={() => setActiveTab('check')}
          />
        )}

        {activeTab === 'careguide' && <CareGuidePage />}
      </main>
    </div>
  );
};

export default App;
