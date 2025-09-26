import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Use a property initializer for state to avoid constructor issues and ensure `this.state` is properly typed.
  // FIX: Removed explicit 'public' modifiers to resolve typing issue and align with idiomatic React style.
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-secondary/50 p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle>¡Ups! Algo salió mal.</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Ocurrió un error inesperado. Por favor, intenta refrescar la página.
                    </p>
                    {this.state.error && (
                        <details className="text-left bg-muted p-2 rounded-md text-xs">
                            <summary>Detalles del Error</summary>
                            <pre className="mt-2 whitespace-pre-wrap">
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                    <Button onClick={this.handleRefresh} className="mt-6">
                        Refrescar Página
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;