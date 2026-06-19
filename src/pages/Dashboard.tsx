import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useWindowSize } from '../hooks/useWindowSize';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { trackRender, renderLogs } from '../utils/profiler';
import { 
  CheckCircle, 
  Circle, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Layers, 
  Clock, 
  FlameKindling,
  Award
} from 'lucide-react';

const LiveClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel py-3 px-4 rounded-2xl flex flex-col items-center justify-center min-w-28">
      <span className="text-[10px] text-slate-450 font-bold font-mono uppercase tracking-wider">Local Time</span>
      <span className="text-sm font-semibold font-mono text-slate-700 dark:text-slate-200 mt-1">{currentTime}</span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { tasks, toggleTask } = useStore();
  const windowSize = useWindowSize();
  const isOffline = useOfflineStatus();
  
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Local render counter using useRef
  const renderRef = useRef(0);
  renderRef.current += 1;

  // Track render count inside useEffect (runs on every render)
  useEffect(() => {
    trackRender('DashboardPage');
  });

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-brand-100 dark:border-brand-900/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 text-[9px] font-bold tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 rounded-full border border-brand-100 dark:border-brand-900/30 font-mono uppercase">
              PRESIDIO SDE INTERNSHIP • WEEK 3
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-display mt-2 bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Frontend Engineering & UX Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-sm">
              Interactive playground demonstrating advanced React architectures, global state synchronizers, accessibility safeguards, and TanStack data engines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LiveClock />
            <div className="glass-panel py-3 px-4 rounded-2xl flex flex-col items-center justify-center min-w-24">
              <span className="text-[10px] text-slate-455 font-bold font-mono uppercase tracking-wider">Render Iterations</span>
              <span className="text-sm font-semibold font-mono text-green-600 dark:text-green-400 mt-1">
                #{renderRef.current}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Network & Live Connection */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase tracking-wider">Connection Engine</span>
            <span className="text-lg font-bold flex items-center gap-2">
              {isOffline ? (
                <span className="text-red-500 flex items-center gap-1.5">Offline State</span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1.5">Online State</span>
              )}
            </span>
            <p className="text-xs text-slate-400">Reactive Network status hook</p>
          </div>
          <div className={`p-4 rounded-xl ${isOffline ? 'bg-red-50 dark:bg-red-950/20 text-red-500' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500'}`}>
            {isOffline ? <WifiOff size={24} className="animate-bounce" /> : <Wifi size={24} className="animate-pulse" />}
          </div>
        </div>

        {/* Viewport Size */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase tracking-wider">Viewport Matrix</span>
            <span className="text-lg font-bold font-mono">
              {windowSize.width}px × {windowSize.height}px
            </span>
            <p className="text-xs text-slate-400">
              Breakpoints: {windowSize.width >= 1024 ? 'Desktop (lg)' : windowSize.width >= 768 ? 'Tablet (md)' : 'Mobile (sm)'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500">
            <Monitor size={24} />
          </div>
        </div>

        {/* Completed Core Milestones */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase tracking-wider">Milestone Completion</span>
            <span className="text-lg font-bold flex items-center gap-1.5">
              {progressPercent}% Complete
              <span className="text-xs font-normal text-slate-400">({completedCount}/{tasks.length})</span>
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-1">
              <div 
                className="bg-brand-500 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-green-50 dark:bg-emerald-950/20 text-brand-500">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Main Task Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Tasks Tracker */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <Clock size={20} className="text-brand-500" />
              SDE Curriculum Checkpoints
            </h2>
            
            {/* Filter buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl text-[10px] gap-1 border border-slate-200/55 dark:border-zinc-800">
              {(['all', 'completed', 'pending'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider font-mono cursor-pointer transition-all duration-200 ${
                    filter === f 
                      ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[380px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                No checkpoints found matching that filter.
              </div>
            ) : (
              filteredTasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="py-3 flex items-start gap-3 cursor-pointer group transition-colors duration-200 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 rounded-lg px-2"
                >
                  <button 
                    className="mt-0.5 text-slate-400 group-hover:text-brand-500 transition-colors"
                    aria-label={t.completed ? `Mark ${t.title} incomplete` : `Mark ${t.title} complete`}
                  >
                    {t.completed ? (
                      <CheckCircle size={18} className="text-brand-500 fill-brand-50/50 dark:fill-brand-950/20" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <div className="space-y-0.5 flex-1">
                    <span className={`text-sm font-medium ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {t.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-brand-500/85 font-mono">
                        {t.category}
                      </span>
                      {t.notes && (
                        <span className="text-[10px] text-slate-400 font-sans">
                          • {t.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Runtime Auditing & DevTools Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <Layers size={20} className="text-indigo-500" />
            Active Profiler Logs
          </h2>
          <p className="text-xs text-slate-400">
            Simulated memory & render logs matching targets tracked in standard React Developer Tools.
          </p>

          <div className="space-y-3 font-mono text-xs bg-slate-950/95 dark:bg-black/90 p-4 rounded-xl border border-slate-800 text-slate-300 max-h-[300px] overflow-y-auto">
            <div className="text-slate-500">// React Render Profiler</div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5 text-[9px] uppercase tracking-wider font-bold">
              <span>Component Name</span>
              <span className="text-brand-400">Re-renders</span>
            </div>
            {Object.entries(renderLogs).length === 0 ? (
              <div className="text-slate-500 italic py-2">No profiles registered yet...</div>
            ) : (
              Object.entries(renderLogs).map(([comp, count]) => (
                <div key={comp} className="flex justify-between py-1 border-b border-slate-900/50 hover:bg-slate-900 px-1 rounded">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FlameKindling size={10} className="text-amber-500" />
                    {comp}
                  </span>
                  <span className="text-green-400 font-bold">{count}</span>
                </div>
              ))
            )}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 leading-relaxed bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-lg">
            <span>💡</span>
            <span>
              Tip: Install the <strong>React Developer Tools</strong> extension to view the component tree, inspect hooks, and profile performance directly!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
