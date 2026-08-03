import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4 text-center">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-green-900 mb-2">Something went wrong</h1>
      <p className="text-green-700 mb-8 max-w-md">
        We're sorry, but the application encountered an unexpected error. Please try refreshing the app.
      </p>
      
      <div className="flex flex-col w-full max-w-xs space-y-4">
        <button
          onClick={resetErrorBoundary}
          className="w-full py-3 bg-green-600 text-white rounded-xl font-medium shadow-md hover:bg-green-700 active:bg-green-800 transition-colors"
        >
          Refresh App
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full py-3 bg-white text-green-700 border border-green-200 rounded-xl font-medium hover:bg-green-50 active:bg-green-100 transition-colors"
        >
          Return Home
        </button>
      </div>

      {import.meta.env.DEV && (
        <div className="mt-12 text-left bg-white p-4 rounded-xl shadow-sm border border-red-100 w-full max-w-2xl overflow-auto text-sm text-red-800">
          <p className="font-bold mb-2">Developer Details:</p>
          <pre>{error.message}</pre>
        </div>
      )}
    </div>
  );
}

export function GlobalErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here if needed
        window.location.reload();
      }}
      onError={(error, info) => {
        // Here we could send the error to an analytics or crash reporting service
        console.error("Global Error Boundary caught an error:", error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
