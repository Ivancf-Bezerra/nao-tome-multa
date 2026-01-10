import { useState } from 'react';
import { VehicleProfile } from '../../context/TechnicalProfileContext';
import { InfractionService } from './InfractionService';
import { InspectionResult } from './types';
import { RequestState } from './requestState';

const initialState: RequestState<InspectionResult> = {
  status: 'idle',
  data: null,
  error: null,
};

export function useInfractionSearch() {
  const [state, setState] =
    useState<RequestState<InspectionResult>>(initialState);

  async function search(vehicle: VehicleProfile) {
    setState({
      status: 'loading',
      data: null,
      error: null,
    });

    const result = await InfractionService.fetchByVehicle(vehicle);
    setState(result);
  }

  return {
    state,
    search,
  };
}
