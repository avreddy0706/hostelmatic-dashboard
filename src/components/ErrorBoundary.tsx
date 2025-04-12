import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
  }
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }; 
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
        return <div>
            <h1>Something went wrong</h1>
            <p>An error occurred in the application.</p>
        </div>;
    }
    return this.props.children; 
  }
}
export default ErrorBoundary;