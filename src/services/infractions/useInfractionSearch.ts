import { useState } from 'react';
import { Infraction } from './types';

export type RequestStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

interface InfractionSearchState {
  status: RequestStatus;
  data?: {
    infraction: Infraction;
  };
  error?: string;
}

export function useInfractionSearch() {
  const [state, setState] =
    useState<InfractionSearchState>({
      status: 'idle',
    });

  function startManualAnalysis(
    infraction: Infraction,
  ) {
    console.log(
      '🟡 useInfractionSearch.startManualAnalysis',
    );
    console.log(
      JSON.stringify(infraction, null, 2),
    );

    try {
      setState({ status: 'loading' });

      setState({
        status: 'success',
        data: {
          infraction,
        },
      });
    } catch {
      setState({
        status: 'error',
        error:
          'Falha técnica ao iniciar análise.',
      });
    }
  }

  return {
    state,
    startManualAnalysis,
  };
}
