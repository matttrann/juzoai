import api from './api';
import { LoadingBarType } from '../contexts/LoadingBarContext';

/**
 * Creates an API wrapper that shows loading bar during API calls
 * @param loadingBar - The loading bar context
 */
export const createApiWithLoading = (loadingBar: LoadingBarType) => {
  // Create a wrapper for get requests
  const get = async <T>(url: string, config?: any) => {
    try {
      loadingBar.start();
      return await api.get<T>(url, config);
    } finally {
      loadingBar.complete();
    }
  };

  // Create a wrapper for post requests
  const post = async <T>(url: string, data?: any, config?: any) => {
    try {
      loadingBar.start();
      return await api.post<T>(url, data, config);
    } finally {
      loadingBar.complete();
    }
  };

  // Create a wrapper for put requests
  const put = async <T>(url: string, data?: any, config?: any) => {
    try {
      loadingBar.start();
      return await api.put<T>(url, data, config);
    } finally {
      loadingBar.complete();
    }
  };

  // Create a wrapper for delete requests
  const del = async <T>(url: string, config?: any) => {
    try {
      loadingBar.start();
      return await api.delete<T>(url, config);
    } finally {
      loadingBar.complete();
    }
  };

  return {
    get,
    post,
    put,
    delete: del,
  };
};

/**
 * Hook to create API wrappers that use the loading bar
 * Usage in components:
 * const api = useApiWithLoading();
 * api.get('/endpoint') will trigger the loading bar
 */
export const useApiWithLoading = (loadingBar: LoadingBarType) => {
  return createApiWithLoading(loadingBar);
}; 