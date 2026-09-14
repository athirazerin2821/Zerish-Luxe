import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };



  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Zerish Luxe Unhandled Application Error:', error, errorInfo);
  }

  handleReset = () => {
    // Clear any potential corrupt local state
    try {
      localStorage.removeItem('zl_cart');
      localStorage.removeItem('zl_view_mode');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F6] text-[#262220] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-[#262220]/15 p-8 rounded-xs shadow-xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#A15C38]/10 flex items-center justify-center text-[#A15C38] text-xl font-serif">
              ZL
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#262220]">Zerish Luxe</h1>
            <p className="text-xs text-[#C3A6A0] uppercase tracking-widest font-semibold">Fine Jewellery Experience</p>
            <p className="text-sm text-[#262220]/80 leading-relaxed">
              We encountered a temporary display issue while loading the boutique. Please refresh to continue your curation.
            </p>
            {this.state.errorMessage && (
              <p className="text-[11px] font-mono text-[#A15C38] bg-[#FAF8F6] p-2 rounded-xs border border-[#262220]/10 overflow-hidden text-ellipsis whitespace-nowrap">
                {this.state.errorMessage}
              </p>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 bg-[#262220] hover:bg-[#A15C38] text-white text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer rounded-xs"
              >
                Reload Boutique
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch {}
                  window.location.href = '/';
                }}
                className="text-[11px] text-[#262220]/60 hover:text-[#262220] underline transition-colors cursor-pointer"
              >
                Reset Cache & Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

