import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { trackRender } from '../utils/profiler';
import { CustomSelect } from '../components/CustomSelect';
import { 
  Database, 
  Settings, 
  Plus, 
  Eye, 
  EyeOff,
  Code,
  Server
} from 'lucide-react';

// 1. Create a local Context API container to demonstrate raw React Context
interface LocalSettingsState {
  showRawLogs: boolean;
  toggleRawLogs: () => void;
}

const LocalSettingsContext = createContext<LocalSettingsState | undefined>(undefined);

const LocalSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showRawLogs, setShowRawLogs] = useState(false);
  
  const toggleRawLogs = () => {
    setShowRawLogs(prev => !prev);
  };

  return (
    <LocalSettingsContext.Provider value={{ showRawLogs, toggleRawLogs }}>
      {children}
    </LocalSettingsContext.Provider>
  );
};

const useLocalSettings = () => {
  const context = useContext(LocalSettingsContext);
  if (!context) {
    throw new Error('useLocalSettings must be used inside a LocalSettingsProvider');
  }
  return context;
};

// Sub-component consuming Context API state
const ContextConsumerComponent: React.FC = () => {
  const { showRawLogs, toggleRawLogs } = useLocalSettings();
  const renderRef = useRef(0);
  renderRef.current += 1;

  return (
    <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800/80 space-y-3 relative overflow-hidden">
      <div key={`ctx-${renderRef.current}`} className="absolute inset-0 flash-render-unoptimized pointer-events-none opacity-40"></div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Settings size={12} />
          Settings Context Consumer
        </span>
        <span className="text-[10px] font-mono bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold">
          Render #{renderRef.current}
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-normal">
        This card consumes the Context API. When toggled, any updates trigger a re-render of this component tree.
      </p>

      <button
        onClick={toggleRawLogs}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
      >
        {showRawLogs ? <EyeOff size={12} /> : <Eye size={12} />}
        {showRawLogs ? 'Hide Raw Live JSON' : 'Show Raw Live JSON'}
      </button>
    </div>
  );
};

// Sub-component consuming Zustand state
const ZustandConsumerComponent: React.FC = () => {
  const { tasks, toggleTask } = useStore();
  const renderRef = useRef(0);
  renderRef.current += 1;

  return (
    <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-100 dark:border-zinc-800/80 space-y-3 relative overflow-hidden">
      <div key={`zustand-${renderRef.current}`} className="absolute inset-0 flash-render-optimized pointer-events-none opacity-40"></div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Database size={12} />
          Zustand Store Consumer
        </span>
        <span className="text-[10px] font-mono bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold">
          Render #{renderRef.current}
        </span>
      </div>

      <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
        {tasks.slice(0, 3).map(task => (
          <div 
            key={task.id} 
            onClick={() => toggleTask(task.id)}
            className="flex items-center justify-between text-xs py-1 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 px-1 rounded cursor-pointer"
          >
            <span className={`truncate mr-2 ${task.completed ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {task.title}
            </span>
            <span className={`text-[9px] uppercase font-extrabold shrink-0 px-1.5 py-0.5 rounded ${task.completed ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {task.completed ? 'Done' : 'ToDo'}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 italic text-center">Toggling items updates state instantly across components.</p>
    </div>
  );
};

// Main Component Wrapper
const StateManagementInner: React.FC = () => {
  const { tasks, addTask } = useStore();
  const { showRawLogs } = useLocalSettings();
  
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('React Advanced');

  const categoryOptions = [
    { value: 'React Advanced', label: 'React Advanced' },
    { value: 'State Management', label: 'State Management' },
    { value: 'API Handling', label: 'API Handling' },
    { value: 'UX & Security', label: 'UX & Security' },
    { value: 'UX & Accessibility', label: 'UX & Accessibility' },
  ];

  useEffect(() => {
    trackRender('StateManagementPage');
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newCategory);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-100 dark:border-brand-900/30">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Server size={24} className="text-brand-500" />
          State Management comparison
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluating Context API (standard React tree propagation) against Zustand (selector-based publish/subscribe store).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Side-by-Side Architectural Summary */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            Context API (React Core)
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Best suited for low-frequency global updates like themes, language translation, or authentication state. Toggling settings triggers renders in all children consuming this context.
          </p>
          <ContextConsumerComponent />

          <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-2.5">
            <h3 className="text-xs font-bold font-display text-slate-500 uppercase tracking-wide text-[10px]">Context Architecture Details:</h3>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-500 dark:text-slate-400">
              <li>Built directly into React (no external package needed).</li>
              <li>Suffers from "Provider Nesting Hell" as state layers multiply.</li>
              <li>Lacks native optimization for high-frequency writes.</li>
            </ul>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            Zustand (Modern Store)
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            A small, fast state manager that lets you retrieve specific state slices. It relies on subscription observers, preventing unneeded parent re-renders.
          </p>
          <ZustandConsumerComponent />

          <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4 space-y-2.5">
            <h3 className="text-xs font-bold font-display text-slate-500 uppercase tracking-wide text-[10px]">Zustand Store Details:</h3>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-500 dark:text-slate-400">
              <li>Decoupled from the React component render tree.</li>
              <li>Support for action creators, middleware (Persistence, DevTools).</li>
              <li>Extremely simple API without boilerplate code.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Task Manager Console & State Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Creator Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 lg:col-span-1">
          <h2 className="text-md font-bold font-display">Add Custom Milestone</h2>
          <form onSubmit={handleAddTask} className="space-y-3.5">
            <div>
              <label htmlFor="task-title" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Milestone Description</label>
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Run bundle size analysis"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="task-category" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Curriculum Category</label>
              <CustomSelect
                id="task-category"
                value={newCategory}
                onChange={(val) => setNewCategory(val)}
                options={categoryOptions}
                label="Curriculum Category"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-brand-500/10 transition-colors"
            >
              <Plus size={14} />
              Add to Store
            </button>
          </form>
        </div>

        {/* Live Zustand Store / JSON Display */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-bold font-display flex items-center gap-2">
              <Code size={16} className="text-brand-500" />
              Live JSON Store Snapshot
            </h2>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
              {showRawLogs ? 'Dev Mode (Active)' : 'Redacted'}
            </span>
          </div>

          {showRawLogs ? (
            <pre className="text-[10px] font-mono bg-slate-950 dark:bg-black p-4 rounded-xl border border-slate-800 text-brand-300 max-h-[220px] overflow-y-auto">
              {JSON.stringify({ tasks: tasks.map(t => ({ id: t.id, title: t.title, completed: t.completed })) }, null, 2)}
            </pre>
          ) : (
            <div className="p-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center text-slate-400 max-h-[220px] h-[220px] space-y-2">
              <span className="text-lg">🔒</span>
              <p className="text-xs font-semibold">Store contents are hidden by Context Settings</p>
              <p className="text-[11px] text-slate-500">Toggle "Show Raw Live JSON" above to unlock real-time store streaming.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StateManagement: React.FC = () => {
  return (
    <LocalSettingsProvider>
      <StateManagementInner />
    </LocalSettingsProvider>
  );
};
