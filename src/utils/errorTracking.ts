/**
 * Client-side error tracking and reporting
 * 
 * This utility captures and reports frontend errors to our backend
 * and optionally to external monitoring services.
 */

import { api } from './api';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  component?: string;
  userAgent: string;
  timestamp: string;
  userId?: string | null;
  additionalInfo?: Record<string, any>;
}

/**
 * Initialize global error tracking
 * Call this once at application startup
 */
export const initErrorTracking = (userId?: string | null) => {
  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    event.preventDefault();
    logErrorToBackend({
      message: event.message || 'Unknown error',
      stack: event.error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId
    });
    
    console.error('Captured error:', event.error);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    
    logErrorToBackend({
      message: error.message || 'Unhandled promise rejection',
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId
    });
    
    console.error('Unhandled rejection:', error);
  });
  
  console.log('Error tracking initialized');
};

/**
 * Manually log an error or exception
 * Use this for try/catch blocks where you handle the error but still want to report it
 */
export const logError = (
  error: Error | string,
  component?: string,
  additionalInfo?: Record<string, any>
) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  logErrorToBackend({
    message: errorObj.message,
    stack: errorObj.stack,
    component,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    additionalInfo
  });
  
  console.error(`Error in ${component || 'unknown component'}:`, errorObj);
};

/**
 * Send error report to backend logging endpoint
 */
const logErrorToBackend = async (errorReport: ErrorReport) => {
  try {
    // Only send to backend in production environment
    if (import.meta.env.PROD) {
      await api.post('error-logging', errorReport);
    }
  } catch (err) {
    // Fallback to console if reporting fails
    console.error('Failed to report error to backend:', err);
  }
};