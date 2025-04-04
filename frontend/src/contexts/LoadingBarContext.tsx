import React, { createContext, useContext, ReactNode, useMemo, useRef } from 'react';
import LoadingBar, { LoadingBarContainer, LoadingBarRef } from 'react-top-loading-bar';
import { createApiWithLoading } from '../services/apiWrapper';

// Define our own loading bar interface
export interface LoadingBarType {
  start: () => void;
  complete: () => void;
  continuousStart: (startingValue?: number, refreshRate?: number) => void;
  staticStart: (startingValue?: number) => void;
  increase: (value: number) => void;
  decrease: (value: number) => void;
  getProgress: () => number;
}

interface ContextValue {
  loadingBar: LoadingBarType;
  api: ReturnType<typeof createApiWithLoading>;
}

const LoadingBarContext = createContext<ContextValue | null>(null);

export const useAppLoadingBar = () => {
  const context = useContext(LoadingBarContext);
  if (!context) {
    throw new Error('useAppLoadingBar must be used within a LoadingBarProvider');
  }
  return context.loadingBar;
};

export const useLoadingApi = () => {
  const context = useContext(LoadingBarContext);
  if (!context) {
    throw new Error('useLoadingApi must be used within a LoadingBarProvider');
  }
  return context.api;
};

interface LoadingBarProviderProps {
  children: ReactNode;
}

export const LoadingBarProvider: React.FC<LoadingBarProviderProps> = ({ children }) => {
  // Create a ref for the loading bar
  const loadingBarRef = useRef<LoadingBarRef>(null);
  
  // Create our loading bar API
  const loadingBar: LoadingBarType = useMemo(() => ({
    start: () => loadingBarRef.current?.start(),
    complete: () => loadingBarRef.current?.complete(),
    continuousStart: (startingValue?: number, refreshRate?: number) => 
      loadingBarRef.current?.continuousStart(startingValue, refreshRate),
    staticStart: (startingValue?: number) => 
      loadingBarRef.current?.staticStart(startingValue),
    increase: (value: number) => loadingBarRef.current?.increase(value),
    decrease: (value: number) => loadingBarRef.current?.decrease(value),
    getProgress: () => loadingBarRef.current?.getProgress() || 0
  }), []);
  
  // Create API wrapper with loading bar integration
  const api = useMemo(() => createApiWithLoading(loadingBar), [loadingBar]);
  
  const value = useMemo(() => ({
    loadingBar,
    api
  }), [loadingBar, api]);

  return (
    <LoadingBarContext.Provider value={value}>
      <LoadingBar 
        ref={loadingBarRef} 
        color="#90caf9" 
        height={3} 
        shadow={true} 
      />
      {children}
    </LoadingBarContext.Provider>
  );
}; 