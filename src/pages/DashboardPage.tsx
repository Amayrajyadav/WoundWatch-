import React, { useMemo } from 'react';
import { getSavedChecks, clearAllChecks, deleteCheck } from '../services/storage';
import { RecoveryCheck } from '../types';
import { RadarChart } from '../components/RadarChart';
import { TrajectoryChart } from '../components/TrajectoryChart';
import { Activity, AlertTriangle, CheckCircle, Clock, FileText, Trash2 } from 'lucide-react';

interface Props {
  checks: RecoveryCheck[];
  onNewCheck: () => void;
  onOpenReport: () => void;
  isDemoMode: boolean;
  onLoadDemo?: (scenario: 'improving' | 'change_point' | 'low_confidence' | 'seek_care') => void;
}

export function DashboardPage({ checks: initialChecks, onNewCheck, onOpenReport, isDemoMode, onLoadDemo }: Props) {
  // Sort checks descending by timestamp (newest first)
  const checks = useMemo(() => {
    return [...initialChecks].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [initialChecks]);

  const handleClear = () => {
    if (confirm('Clear all recovery data?')) {
      clearAllChecks();
      window.location.reload();
    }
  };

  const current = checks[0];
  const previous = checks[1];

  // Map checks to RadarData. These must be 0-100 normalized values.
  const toRadarData = (c: RecoveryCheck) => ({
    pain: (c.context.pain / 10) * 100, // 0-100
    visual: c.visualSignal.regionRedDominance ?? c.visualSignal.redDominance, // already 0-100
    area: c.visualSignal.observableArea ? Math.min(100, (c.visualSignal.observableArea / 1250) * 100) : 50, // relative to a baseline area (e.g. 1250)
    symptoms: Math.min(100, c.context.symptoms.length * 25), // 4 symptoms = 100
  });

  const radarCurrent = current ? toRadarData(current) : undefined;
  const radarPrev = previous ? toRadarData(previous) : undefined;

  // Map checks to Trajectory Data (oldest to newest for the chart)
  const trajectoryData = useMemo(() => {
    if (checks.length === 0) return [];
    
    // Sort ascending for the chart (left to right = oldest to newest)
    const ascending = [...checks].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const firstTime = new Date(ascending[0].timestamp).getTime();

    return ascending.map((c, i) => {
      const msDiff = new Date(c.timestamp).getTime() - firstTime;
      const days = Math.round(msDiff / (1000 * 60 * 60 * 24)) + 1;
      
      // Compute an aggregate score.
      // Lower pain is good. Lower visual is good.
      // We want the chart to go UP when healing.
      // Let's invert them: 100 - pain, 100 - visual
      const painScore = 100 - ((c.context.pain / 10) * 100);
      const visualScore = 100 - c.visualSignal.regionRedDominance;
      const combined = (painScore * 0.4) + (visualScore * 0.6); // Weight visual slightly more

      return {
        day: days,
        value: combined,
        label: i === ascending.length - 1 ? 'Today' : `Day ${days}`,
      };
    });
  }, [checks]);

  if (checks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Activity className="w-16 h-16 text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-3">Recovery Intelligence</h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          WoundWatch uses computer vision to track multidimensional recovery signals. Start your first scan to establish a baseline.
        </p>
        <button
          onClick={onNewCheck}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-blue-900/50 transition-transform active:scale-95 mb-8"
        >
          Start Recovery Scan
        </button>

        {onLoadDemo && (
          <div className="w-full max-w-sm border-t border-slate-800 pt-8 mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Developer Tools</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onLoadDemo('improving')} className="p-3 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-emerald-400">
                Load: Improving
              </button>
              <button onClick={() => onLoadDemo('change_point')} className="p-3 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-blue-400">
                Load: Change Point
              </button>
              <button onClick={() => onLoadDemo('low_confidence')} className="p-3 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400">
                Load: Low Confidence
              </button>
              <button onClick={() => onLoadDemo('seek_care')} className="p-3 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-red-400">
                Load: Red Flag
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-24 bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Intelligence
          </h1>
          {isDemoMode && <p className="text-xs text-amber-500 font-bold tracking-widest mt-0.5">SYNTHETIC DEMO DATA</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={onOpenReport} className="text-slate-400 hover:text-white p-2" aria-label="Open clinical report">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={handleClear} className="text-slate-400 hover:text-red-400 p-2" aria-label="Clear all data">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Top Actions */}
        <button
          onClick={onNewCheck}
          className="w-full bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Activity className="w-5 h-5" />
          Start New Scan
        </button>

        {/* Confidence Gauge */}
        {current.confidence && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Observation Confidence</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full ${current.confidence.level === 'High' ? 'bg-emerald-500' : current.confidence.level === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${current.confidence.overallScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Overall Reliability</span>
                  <span className={current.confidence.level === 'High' ? 'text-emerald-400' : current.confidence.level === 'Medium' ? 'text-amber-400' : 'text-red-400'}>
                    {current.confidence.level} ({current.confidence.overallScore}%)
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Intelligence Status / Anomalies / Change Point */}
        <section className={`bg-slate-900 border ${current.changePoint?.detected ? 'border-red-900/50 shadow-red-900/20' : 'border-slate-800'} rounded-2xl p-5 shadow-lg relative overflow-hidden`}>
          {current.changePoint?.detected && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          )}
          
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Latest Analysis</h2>
          
          {current.changePoint?.detected ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-400 text-lg">⚠ Significant Trajectory Change</h3>
                  <p className="text-sm text-red-200/80 mt-1 leading-relaxed">
                    A change in the recovery pattern was detected. This multivariate shift indicates a sudden deviation from the recent healing trajectory.
                  </p>
                </div>
              </div>
            </div>
          ) : current.anomalies && current.anomalies.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-amber-400">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-300">Multivariate Deviation Detected</h3>
                  <ul className="list-disc list-inside text-sm mt-1 opacity-90">
                    {current.anomalies.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-emerald-400">
              <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-300">Recovery On Track</h3>
                <p className="text-sm opacity-90 mt-1">Current signals are within expected longitudinal ranges derived from recent baselines.</p>
              </div>
            </div>
          )}

          {/* Raw Evidence Drill-down */}
          {current.anomalyEvidence && current.anomalyEvidence.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Raw Evidence</h4>
              <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="py-2 px-3 font-medium">Metric</th>
                      <th className="py-2 px-3 font-medium">Baseline</th>
                      <th className="py-2 px-3 font-medium">Current</th>
                      <th className="py-2 px-3 font-medium text-right">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {current.anomalyEvidence.map((ev, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-medium text-slate-200">{ev.metric}</td>
                        <td className="py-2 px-3 opacity-80">{ev.previousValue}</td>
                        <td className="py-2 px-3">{ev.currentValue}</td>
                        <td className="py-2 px-3 text-right font-mono text-amber-400">{ev.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Trajectory Chart */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recovery Trajectory</h2>
            <span className="text-xs font-mono text-slate-500">n={checks.length}</span>
          </div>
          <TrajectoryChart data={trajectoryData} />
          <p className="text-xs text-center text-slate-500 mt-2">Aggregate Healing Score (Higher is better)</p>
        </section>

        {/* Fingerprint Radar Chart */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Recovery Fingerprint</h2>
          <div className="flex flex-col items-center">
            {radarCurrent && <RadarChart data={radarCurrent} previousData={radarPrev} size={240} />}
            
            <div className="flex gap-6 mt-6 text-xs font-semibold">
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-3 h-3 rounded-full bg-blue-400/30 border border-blue-400" />
                Latest Scan
              </div>
              {radarPrev && (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-slate-500/20 border border-slate-500" />
                  Previous Baseline
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
