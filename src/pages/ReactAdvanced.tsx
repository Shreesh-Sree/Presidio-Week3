import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { trackRender } from '../utils/profiler';
import { 
  Zap, 
  ZapOff, 
  RefreshCw, 
  Layers, 
  AlertTriangle,
  Play,
  HelpCircle,
  Sliders,
  Database
} from 'lucide-react';

// Unoptimized Child Component
interface ChildProps {
  count: number;
  onClick: () => void;
}

const UnoptimizedChild: React.FC<ChildProps> = ({ count, onClick }) => {
  const renderRef = useRef(0);
  renderRef.current += 1;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-red-500/20 text-center relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Visual render flash using CSS keyframe animations */}
      <div key={`unopt-${renderRef.current}`} className="absolute inset-0 flash-render-unoptimized pointer-events-none"></div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-center gap-1.5 text-red-500 font-bold text-xs font-mono uppercase tracking-wider">
          <ZapOff size={14} />
          Unoptimized Child
        </div>
        
        <p className="text-xs text-slate-400 leading-relaxed min-h-12">
          Receives raw prop updates and standard callback functions. Re-renders <strong>every single time</strong> the parent component re-renders.
        </p>

        <div className="py-2">
          <span className="text-[10px] text-slate-450 block font-mono uppercase tracking-wider">Child Counter</span>
          <div className="text-4xl font-extrabold font-mono text-slate-800 dark:text-slate-100 mt-1">
            {count}
          </div>
        </div>

        <button
          onClick={onClick}
          className="w-full py-2 bg-slate-150 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-slate-200/40 dark:border-zinc-700/50"
        >
          Increment Child State
        </button>

        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-red-500 bg-red-500/5 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          Total Renders: {renderRef.current}
        </div>
      </div>
    </div>
  );
};

// Optimized Child Component
const OptimizedChild = React.memo<ChildProps>(
  ({ count, onClick }) => {
    const renderRef = useRef(0);
    renderRef.current += 1;

    return (
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 text-center relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
        <div key={`opt-${renderRef.current}`} className="absolute inset-0 flash-render-optimized pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-bold text-xs font-mono uppercase tracking-wider">
            <Zap size={14} />
            Optimized Child
          </div>

          <p className="text-xs text-slate-400 leading-relaxed min-h-12">
            Wrapped in <code>React.memo</code> and receives a memoized <code>useCallback</code> click handler. Ignores parent re-renders.
          </p>

          <div className="py-2">
            <span className="text-[10px] text-slate-450 block font-mono uppercase tracking-wider">Child Counter</span>
            <div className="text-4xl font-extrabold font-mono text-slate-800 dark:text-slate-100 mt-1">
              {count}
            </div>
          </div>

          <button
            onClick={onClick}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-brand-950/20 dark:hover:bg-brand-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-emerald-100/20 dark:border-brand-900/30"
          >
            Increment Child State
          </button>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Total Renders: {renderRef.current}
          </div>
        </div>
      </div>
    );
  }
);
OptimizedChild.displayName = 'OptimizedChild';

// Crash trigger component for Error Boundary
const CrashComponent: React.FC = () => {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Simulated Crash: Failed to fetch state variables from reference pointers.");
  }

  return (
    <div className="p-5 bg-slate-50 dark:bg-zinc-950/50 border border-slate-150 dark:border-zinc-900/80 rounded-2xl flex flex-col items-center gap-4 text-center">
      <div className="space-y-1">
        <span className="inline-flex px-2.5 py-1 text-[9px] font-bold tracking-widest text-amber-600 dark:text-sky-accent bg-amber-50 dark:bg-sky-accent/10 border border-amber-100 dark:border-sky-accent/20 rounded-full font-mono uppercase">
          Safe Sub-module Component
        </span>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          This sub-card is safely sandboxed inside a React Error Boundary. Triggering an unhandled lifecycle exception will only replace this element with a fallback.
        </p>
      </div>
      
      <button
        onClick={() => setShouldCrash(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md shadow-red-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <AlertTriangle size={12} />
        Throw Unhandled Lifecycle Error
      </button>
    </div>
  );
};

export const ReactAdvanced: React.FC = () => {
  const [parentCount, setParentCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  // useMemo Sandbox States
  const [loopSize, setLoopSize] = useState(1000000);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);

  // Local parent render tracker
  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;

  useEffect(() => {
    trackRender('ReactAdvancedPage');
  });

  // useCallback keeps reference intact across re-renders
  const memoizedClick = useCallback(() => {
    setChildCount(c => c + 1);
  }, []);

  // Raw callback gets recreated on every render
  const rawClick = () => {
    setChildCount(c => c + 1);
  };

  // Heavy computation function that maps math loops
  const runCalculation = useCallback((size: number) => {
    const start = performance.now();
    let sum = 0;
    for (let i = 0; i < size; i++) {
      sum += Math.sin(i);
    }
    const end = performance.now();
    return {
      sum: sum.toFixed(4),
      time: (end - start).toFixed(2)
    };
  }, []);

  // useMemo cached result: only evaluates when loopSize changes
  const memoizedResult = useMemo(() => {
    return runCalculation(loopSize);
  }, [loopSize, runCalculation]);

  // Evaluate result. If useMemo is disabled, this runs on EVERY render of ReactAdvanced!
  const calculationResult = useMemoEnabled 
    ? memoizedResult 
    : runCalculation(loopSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-100 dark:border-brand-900/30">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Layers size={24} className="text-brand-500" />
          React Advanced Engine
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visualizing memoization mechanics, callback reference caching, runtime crash scopes, and expensive state optimization.
        </p>
      </div>

      {/* Render Visualizer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualizer Controls */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <RefreshCw size={18} className="text-brand-500 animate-spin-slow" />
              Render Tracker
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Updating parent state triggers a full parent redraw. 
              Observe how the child components respond:
            </p>
            <ul className="text-xs space-y-2 list-none text-slate-450">
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 mt-0.5">•</span>
                <span>The <strong>Unoptimized Child</strong> flashes red and increments its render count because its callback reference is recreated on every parent paint.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>The <strong>Optimized Child</strong> ignores parent updates. It only renders when its own counter is incremented.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-zinc-900">
            <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl space-y-3 border border-slate-150 dark:border-zinc-900/80">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span>Parent Renders</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">#{parentRenderCount.current}</span>
              </div>
              <button
                onClick={() => setParentCount(c => c + 1)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors shadow-md shadow-brand-500/10"
              >
                <Play size={12} />
                Force Parent Re-render ({parentCount})
              </button>
            </div>

            <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-3 rounded-lg flex items-start gap-2 border border-slate-100 dark:border-zinc-900/30">
              <HelpCircle size={14} className="text-brand-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal">
                Optimize renders by wrapping items in <code>React.memo</code> and caching function references via <code>useCallback</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Playfield Children */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <UnoptimizedChild count={childCount} onClick={rawClick} />
          <OptimizedChild count={childCount} onClick={memoizedClick} />
        </div>
      </div>

      {/* useMemo and Error Boundaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* useMemo Sandbox */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Sliders size={18} className="text-indigo-500" />
              useMemo Playground
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              <code>useMemo</code> caches the output of intensive calculations, skipping heavy processor runs unless dependended values are edited.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-150 dark:border-zinc-900/80 space-y-4 my-2">
            {/* Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Loop Iteration Size</span>
                <span className="font-bold font-mono text-indigo-500">{loopSize.toLocaleString()} runs</span>
              </div>
              <input 
                type="range" 
                min="100000" 
                max="5000000" 
                step="100000" 
                value={loopSize}
                onChange={e => setLoopSize(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none"
              />
            </div>

            {/* Toggle */}
            <div className="flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-500 block">Enable useMemo Caching</span>
                <span className="text-[9px] text-slate-400">Stores outputs in memory closure</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useMemoEnabled}
                  onChange={() => setUseMemoEnabled(prev => !prev)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>

          {/* Results Console */}
          <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-150 dark:border-zinc-900/80 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Loop Sum Value</span>
                <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
                  {calculationResult.sum}
                </div>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Execution Speed</span>
                <div className={`text-base font-bold font-mono ${useMemoEnabled ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {calculationResult.time} ms
                </div>
              </div>
            </div>

            <div className={`text-[10px] p-2.5 rounded-lg border font-mono ${
              useMemoEnabled 
                ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100/20 text-emerald-600 dark:text-emerald-400' 
                : 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-100/20 text-amber-600 dark:text-amber-400'
            }`}>
              {useMemoEnabled ? (
                <span>⚡ <strong>Cached:</strong> Re-renders use stored results. Execution speed is 0 ms on parent updates.</span>
              ) : (
                <span>⚠️ <strong>Uncached:</strong> The heavy calculations run on EVERY parent render. Watch the speed change!</span>
              )}
            </div>
          </div>
        </div>

        {/* Error Boundaries */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-500" />
              Lifecycle Error Isolation
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard React trees crash completely if any sub-component encounters a render error. React Error Boundaries capture lifecycle failures within children, isolating errors while keeping the application responsive.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center my-4">
            <ErrorBoundary>
              <CrashComponent />
            </ErrorBoundary>
          </div>

          <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-3 rounded-lg flex items-start gap-2 border border-slate-100 dark:border-zinc-900/30 text-xs">
            <Database size={14} className="text-brand-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-normal">
              Clicking <strong>"Reset State & Retry"</strong> unmounts the crashed instance, clears the boundary buffer, and mounts a fresh component tree.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
