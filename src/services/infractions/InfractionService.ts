import { VehicleProfile } from '../../context/TechnicalProfileContext';
import { InspectionResult, Infraction } from './types';
import { RequestState } from './requestState';
import { fetchInfractions } from '../api';

export const InfractionService = {
  async fetchByVehicle(
    vehicle: VehicleProfile
  ): Promise<RequestState<InspectionResult>> {
    try {
      const response = await fetchInfractions(
        vehicle.plate,
        vehicle.renavam
      );

      const infractions: Infraction[] = response.debitos.map(
        (item: any): Infraction => ({
          id: item.id,
          code: item.codigo,
          description: item.descricao,
          status: 'active',
          amount: item.valor,
          location: item.local,
          occuredAt: item.data,
          points: item.pontos,
          severity: item.gravidade,
        })
      );

      const result: InspectionResult = {
        lastUpdate: new Date().toISOString(),
        infractions,
        totalAmount: infractions.reduce<number>(
          (sum, i) => sum + i.amount,
          0
        ),
      };

      return {
        status: 'success',
        data: result,
        error: null,
      };
    } catch (err: any) {
      return {
        status: 'error',
        data: null,
        error:
          err?.message ??
          'Não foi possível consultar a base no momento.',
      };
    }
  },
};
