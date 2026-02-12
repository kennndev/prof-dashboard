'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Error boundary that catches and suppresses browser extension errors.
 * This prevents the React error overlay from showing for extension-related errors.
 */
export class ExtensionErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State | null {
        // Check if this is a browser extension error
        if (
            error.message?.includes('Cannot set property tron') ||
            error.stack?.includes('chrome-extension://')
        ) {
            // Don't update state for extension errors - just suppress them
            return null;
        }
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Only log non-extension errors
        if (
            !error.message?.includes('Cannot set property tron') &&
            !error.stack?.includes('chrome-extension://')
        ) {
            console.error('Application error:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center p-8">
                        <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
