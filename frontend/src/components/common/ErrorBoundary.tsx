import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-6 bg-surface border border-line rounded-sm space-y-4 shadow-sm">
            <AlertTriangle className="w-10 h-10 text-gap mx-auto" />
            <h2 className="font-serif text-xl font-bold text-ink">Unexpected Component Error</h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              {this.state.error?.message || 'An unhandled rendering exception occurred.'}
            </p>
            <Button variant="primary" size="sm" onClick={this.handleReset} className="w-full">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reload Workspace
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
