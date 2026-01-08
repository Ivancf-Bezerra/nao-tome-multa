import { createContext, useContext, useState, ReactNode } from 'react';

export type AnalysisStatus = 'idle' | 'processing' | 'completed';
export type AnalysisResult = 'regular' | 'inconsistent' | null;

interface Analysis {
  id: string;
  createdAt: Date;
  status: AnalysisStatus;
  result: AnalysisResult;
}

interface AnalysisContextData {
  currentAnalysis: Analysis | null;
  startAnalysis: () => void;
  completeAnalysis: (result: AnalysisResult) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextData | undefined>(
  undefined
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(
    null
  );

  function startAnalysis() {
    setCurrentAnalysis({
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'processing',
      result: null,
    });
  }

  function completeAnalysis(result: AnalysisResult) {
    setCurrentAnalysis((prev) =>
      prev
        ? {
            ...prev,
            status: 'completed',
            result,
          }
        : prev
    );
  }

  function resetAnalysis() {
    setCurrentAnalysis(null);
  }

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        startAnalysis,
        completeAnalysis,
        resetAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error(
      'useAnalysis must be used within an AnalysisProvider'
    );
  }
  return context;
}
