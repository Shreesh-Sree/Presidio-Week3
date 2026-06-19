import { useState } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ReactAdvanced } from './pages/ReactAdvanced';
import { StateManagement } from './pages/StateManagement';
import { ApiPlayground } from './pages/ApiPlayground';
import { A11yStorage } from './pages/A11yStorage';
import { Analytics } from './pages/Analytics';
import { useTheme } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CustomAlertModal } from './components/CustomAlertModal';
import { 
  LayoutDashboard, 
  Layers, 
  Server, 
  Globe, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Menu, 
  X,
  FileCode,
  BarChart3
} from 'lucide-react';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'React Advanced', to: '/react-advanced', icon: Layers },
    { name: 'State Management', to: '/state-management', icon: Server },
    { name: 'API Playground', to: '/api-playground', icon: Globe },
    { name: 'Forms & Charts', to: '/analytics', icon: BarChart3 },
    { name: 'Security & A11y', to: '/a11y-storage', icon: ShieldCheck },
  ];

  return (
    <Router>
      <CustomAlertModal />
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-200 dark:border-zinc-900 h-screen sticky top-0 p-5 z-20">
          <div className="flex items-center gap-2 px-2 py-4 border-b border-slate-100 dark:border-zinc-900 mb-6">
            <div className="p-2 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/25">
              <FileCode size={20} />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white font-display block text-sm tracking-tight">Presidio SDE</span>
              <span className="text-[9px] text-brand-500 font-bold uppercase tracking-widest font-mono">Week 3 Mastery</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5" aria-label="Sidebar Navigation">
            {navigation.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                    : 'text-slate-555 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100/50 dark:hover:bg-zinc-900/40'
                  }
                `}
              >
                <item.icon size={16} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-100 dark:border-zinc-900 pt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
              aria-label="Toggle theme settings"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between p-4 glass-panel border-b border-slate-200 dark:border-zinc-900 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-500 text-white">
              <FileCode size={18} />
            </div>
            <span className="font-bold text-sm font-display text-slate-800 dark:text-white">Presidio SDE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
              aria-label="Toggle light/dark theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Navigation */}
        {mobileOpen && (
          <div 
            className="md:hidden fixed inset-0 z-40 bg-slate-950/20 dark:bg-black/40 backdrop-blur-sm" 
            onClick={() => setMobileOpen(false)}
          >
            <div 
              className="absolute top-[65px] left-0 right-0 glass-panel border-b border-slate-200 dark:border-zinc-900 p-4 space-y-2 z-50" 
              onClick={e => e.stopPropagation()}
            >
              {navigation.map(item => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-100/50 dark:hover:bg-zinc-900/40'
                    }
                  `}
                >
                  <item.icon size={16} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Page Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full overflow-x-hidden">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/react-advanced" element={<ReactAdvanced />} />
              <Route path="/state-management" element={<StateManagement />} />
              <Route path="/api-playground" element={<ApiPlayground />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/a11y-storage" element={<A11yStorage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;
