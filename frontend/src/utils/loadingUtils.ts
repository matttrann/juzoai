import { useAppLoadingBar, LoadingBarType } from '../contexts/LoadingBarContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to show loading bar on route changes
 */
export const useLoadingOnRouteChange = () => {
  const location = useLocation();
  const loadingBar = useAppLoadingBar();
  
  useEffect(() => {
    loadingBar.start();
    
    // Complete the loading bar after a short delay to make it visible
    const timeout = setTimeout(() => {
      loadingBar.complete();
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [location, loadingBar]);
};

/**
 * Function to start loading during API calls
 * Usage: 
 * const apiCall = withLoading(async () => {
 *   // Your async API call here
 * }, loadingBar);
 */
export const withLoading = <T,>(
  fn: () => Promise<T>,
  loadingBar: LoadingBarType
): (() => Promise<T>) => {
  return async () => {
    try {
      loadingBar.start();
      return await fn();
    } finally {
      loadingBar.complete();
    }
  };
}; 