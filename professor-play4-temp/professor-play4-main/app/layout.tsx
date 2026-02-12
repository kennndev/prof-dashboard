import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import BrowserCompatibility from '@/components/BrowserCompatibility'
import { ExtensionErrorBoundary } from '@/components/ExtensionErrorBoundary'
import { AppProvider } from '@/contexts/AppContext'

export const metadata: Metadata = {
  title: 'TCGPlaytest | Custom Card Printing USA',
  description: 'Design and print your custom card games and TCG prototypes with TCGPlaytest.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Inline script to prevent TronLink and other browser extension conflicts
// Includes error handler to suppress extension-related errors
const browserExtensionFix = `
  (function() {
    // Global error handler to catch and suppress browser extension errors
    window.addEventListener('error', function(event) {
      // Check if error is from a browser extension
      if (event.filename && event.filename.includes('chrome-extension://')) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      // Check for the specific TronLink error message
      if (event.message && event.message.includes('Cannot set property tron')) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      return false;
    }, true);

    // Also handle unhandled promise rejections from extensions
    window.addEventListener('unhandledrejection', function(event) {
      if (event.reason && event.reason.stack && event.reason.stack.includes('chrome-extension://')) {
        event.preventDefault();
        return;
      }
      if (event.reason && event.reason.message && event.reason.message.includes('Cannot set property tron')) {
        event.preventDefault();
        return;
      }
    });

    // Try to pre-define window.tron as writable
    try {
      if (typeof window !== 'undefined' && !window.hasOwnProperty('tron')) {
        Object.defineProperty(window, 'tron', {
          value: undefined,
          writable: true,
          configurable: true
        });
      }
    } catch (e) {
      // Silently handle if property already exists
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          id="browser-extension-fix"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: browserExtensionFix }}
        />
      </head>
      <body className="text-slate-800 bg-white dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        <AppProvider>
          <BrowserCompatibility />
          <ExtensionErrorBoundary>
            {children}
          </ExtensionErrorBoundary>
        </AppProvider>
      </body>
    </html>
  )
}

