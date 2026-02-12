'use client';

import { useEffect } from 'react';

/**
 * This component handles browser extension compatibility issues.
 * It suppresses errors from wallet extensions like TronLink that try to
 * define properties on the window object.
 */
export default function BrowserCompatibility() {
    useEffect(() => {
        // Additional error suppression for React's error overlay in development
        const originalError = console.error;
        console.error = (...args: unknown[]) => {
            const errorString = args.join(' ');

            // Suppress TronLink and similar extension errors
            if (
                errorString.includes('Cannot set property tron') ||
                errorString.includes('chrome-extension://') ||
                errorString.includes('egjidjbpglichdcondbcbdnbeeppgdph')
            ) {
                return; // Suppress the error
            }

            originalError.apply(console, args);
        };

        // Cleanup on unmount
        return () => {
            console.error = originalError;
        };
    }, []);

    return null;
}
