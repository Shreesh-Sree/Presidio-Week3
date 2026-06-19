import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trackRender } from '../utils/profiler';
import { 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  Mail, 
  Briefcase, 
  MapPin,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
  address: {
    city: string;
  };
}

export const ApiPlayground: React.FC = () => {
  const [triggerFail, setTriggerFail] = useState(false);

  // Load API URL from Vite environment variables
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com';

  useEffect(() => {
    trackRender('ApiPlaygroundPage');
  });

  // Query definition using TanStack Query v5 syntax
  const { data, error, isLoading, isFetching, refetch, status } = useQuery<UserData[], Error>({
    queryKey: ['users', triggerFail],
    queryFn: async () => {
      if (triggerFail) {
        // Deliberate simulated network breakdown
        throw new Error('Simulated API Outage: Error 503 Service Unavailable. The TanStack query handler captured this error safely.');
      }
      
      const response = await fetch(`${apiBaseUrl}/users`);
      if (!response.ok) {
        throw new Error(`HTTP network error: status code ${response.status}`);
      }
      return response.json();
    },
    // Prevent auto retry when deliberately failing, for quick testing
    retry: triggerFail ? 0 : 2,
    staleTime: 1000 * 15, // 15 seconds fresh state
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-100 dark:border-brand-900/30 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isFetching && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/20 px-2 py-0.5 rounded-full">
              <RefreshCw size={10} className="animate-spin" />
              Caching Sync...
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Globe size={24} className="text-brand-500" />
          API Consumption Engine
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Managing remote operations using TanStack Query, async/await streams, loading skeleton states, and localized environmental configs.
        </p>
      </div>

      {/* TanStack Stats Console */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Environment Variable Console */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase tracking-wider">Vite API Address</span>
            <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300 break-all select-all block">
              {apiBaseUrl}
            </span>
            <p className="text-[10px] text-slate-400">Fetched from <code>import.meta.env</code></p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-brand-500 shrink-0">
            <Cpu size={20} />
          </div>
        </div>

        {/* Cache status info */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase tracking-wider">Query Data Status</span>
            <span className="text-sm font-bold capitalize flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className={`w-2.5 h-2.5 rounded-full ${status === 'success' ? 'bg-emerald-500' : status === 'error' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></span>
              {status} State
            </span>
            <p className="text-[10px] text-slate-400">Fresh Duration: 15s</p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 shrink-0">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Fault Injection switch */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase tracking-wider">API Fault Injector</span>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input 
                type="checkbox" 
                checked={triggerFail} 
                onChange={() => setTriggerFail(prev => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
              <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                {triggerFail ? 'Simulating Fault' : 'Healthy Link'}
              </span>
            </label>
            <p className="text-[10px] text-slate-400">Injects synthetic network failure</p>
          </div>
          <div className={`p-3.5 rounded-xl ${triggerFail ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 animate-pulse' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-500'} shrink-0`}>
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Area: Loader, Error, Grid */}
      <div className="glass-panel p-6 rounded-2xl">
        {/* Loading state (skeletons) */}
        {isLoading && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-5 border border-slate-100 dark:border-zinc-800/80 rounded-2xl space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-slate-100 dark:border-zinc-800/60 pt-3">
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500">
              <AlertCircle size={36} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">API Query Failure</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {error.message}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setTriggerFail(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Disable Fault
              </button>
              <button 
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md shadow-rose-500/10"
              >
                <RefreshCw size={12} />
                Trigger Retry
              </button>
            </div>
          </div>
        )}

        {/* Success Grid */}
        {status === 'success' && data && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-bold font-display text-slate-700 dark:text-slate-300">
                Staff Directory ({data.length} records)
              </h2>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-600 dark:text-slate-300 text-xs rounded-xl font-semibold cursor-pointer border border-slate-200/50 dark:border-zinc-800/80"
              >
                <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
                Refresh Cache
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map(user => (
                <div 
                  key={user.id} 
                  className="p-5 border border-slate-100 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-zinc-950/30 hover:shadow-lg dark:hover:shadow-zinc-950/50 hover:border-brand-500/40 transition-all duration-300 group flex flex-col justify-between"
                  tabIndex={0}
                  aria-label={`Staff contact card: ${user.name}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold font-display">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-500 transition-colors">
                          {user.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium">
                          @{user.username}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 dark:border-zinc-800/50 pt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Mail size={12} className="text-slate-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Briefcase size={12} className="text-slate-400" />
                        <span className="truncate">{user.company.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{user.address.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 dark:border-zinc-800/20 text-[10px] italic text-slate-400 leading-normal">
                    "{user.company.catchPhrase}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
