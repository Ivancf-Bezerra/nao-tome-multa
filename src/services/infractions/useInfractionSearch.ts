import { useState } from 'react';
import { InfractionInput } from './types';
import { analyzeInfraction } from '../analysis/TechnicalAnalyzer';
import { buildAnalysisResult, AnalysisResult } from '../analysis/AnalysisResult';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface InfractionSearchState {
  status: RequestStatus;
  data?: {
    input: InfractionInput;
    result: AnalysisResult;
  };
  error?: string;
}

export function useInfractionSearch() {
  const [state, setState] = useState<InfractionSearchState>({ status: 'idle' });

  function startManualAnalysis(input: InfractionInput) {
    try {
      setState({ status: 'loading' });

      const findings = analyzeInfraction(input);
      const result = buildAnalysisResult(findings);

      setState({
        status: 'success',
        data: { input, result },
      });
    } catch {
      setState({
        status: 'error',
        error: 'Falha técnica ao processar a análise.',
      });
    }
  }

  function reset() {
    setState({ status: 'idle' });
  }

  return { state, startManualAnalysis, reset };
}
