import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="glass-panel p-6 rounded-2xl border border-red-500/20 text-center max-w-lg mx-auto my-8">
          <div className="inline-flex p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4 animate-pulse">
            <AlertOctagon size={32} />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 mb-2">
            Dynamic Error Caught
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            An unexpected error occurred in this section of the application, but was safely isolated by the React Error Boundary.
          </p>
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 font-mono text-xs p-3 rounded-lg text-left overflow-x-auto max-h-40 border border-red-100 dark:border-red-900/20 mb-6">
            {this.state.error?.toString() || 'Unknown Error'}
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-md shadow-red-500/10"
          >
            <RotateCcw size={16} />
            Reset State & Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
