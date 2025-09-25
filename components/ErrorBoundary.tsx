import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './ui/Button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  // FIX: Use class property for state initialization to resolve type errors with `this.state` and `this.props`.
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              Oops, something went wrong.
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              We've been notified about the issue and are working to fix it. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;