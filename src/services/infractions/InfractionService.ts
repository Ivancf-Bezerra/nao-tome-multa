import { InspectionResult, Infraction } from './types';
import { RequestState } from './requestState';
import { fetchInfractions } from '../api';

type VehicleQuery = {
  plate: string;
  renavam: string;
  uf: string;
};

export const InfractionService = {
  async fetchByVehicle(
    vehicle: VehicleQuery
  ): Promise<RequestState<InspectionResult>> {
    const response = await fetchInfractions({
      plate: vehicle.plate,
      renavam: vehicle.renavam,
      uf: vehicle.uf,
    });

    if (!response.ok) {
      return {
        status: 'error',
        data: null,
        error: 'Não foi possível consultar a base no momento.',
      };
    }

    const rawDebts = response.data?.debitos ?? [];

    const infractions: Infraction[] = rawDebts.map(
      (item: any): Infraction => ({
        id: String(item.id),
        code: item.codigo,
        description: item.descricao,
        status: 'active',
        amount: Number(item.valor),
        location: item.local,
        occuredAt: item.data,
        points: Number(item.pontos),
        severity: item.gravidade,
      })
    );

    const result: InspectionResult = {
      lastUpdate: new Date().toISOString(),
      infractions,
      totalAmount: infractions.reduce(
        (sum, i) => sum + i.amount,
        0
      ),
    };

    return {
      status: 'success',
      data: result,
      error: null,
    };
  },
};
