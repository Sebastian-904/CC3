

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
            <div className="max-w-md text-center">
                <h1 className="text-2xl font-bold text-destructive">Oops! Something went wrong.</h1>
                <p className="mt-2 text-muted-foreground">
                    We encountered an unexpected error. Please try refreshing the page.
                </p>
                {this.state.error && (
                    <pre className="mt-4 whitespace-pre-wrap rounded-md bg-muted p-4 text-left text-xs">
                        {this.state.error.toString()}
                    </pre>
                )}
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    Refresh Page
                </button>
            </div>
        </div>
      );
    }
    // FIX: Explicitly access props from `this` which is standard for class components.
    // The error was likely a linter misconfiguration, but this ensures clarity.
    return this.props.children;
  }
}

export default ErrorBoundary;