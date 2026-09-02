import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 text-stone-900 font-sans" dir="rtl">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-stone-200 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div>
              <h2 className="text-lg font-black text-stone-900 mb-1">حدث خطأ غير متوقع</h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                نعتذر عن هذا الخطأ المؤقت. يمكنك تحديث الصفحة أو إعادة المحاولة لمواصلة استخدام منصة معايشة القرآن بأمان.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-stone-100 rounded-xl p-3 text-left font-mono text-[11px] text-stone-700 overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة المحاولة والتحديث</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
