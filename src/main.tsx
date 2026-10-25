import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-200" dir="rtl">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-4 text-2xl border border-amber-200 dark:border-amber-800">
            ⚠️
          </div>
          <h1 className="text-lg font-bold mb-1.5 text-stone-900 dark:text-stone-100">אירעה שגיאה בטעינת האפליקציה</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mb-5 leading-relaxed">
            {this.state.error?.message || 'אנא נסה לרענן את הדף'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 text-xs"
          >
            רענון הדף
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
