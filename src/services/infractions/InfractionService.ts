import { Infraction } from './types';

/**
 * Serviço local de infrações.
 * Recebe dados manuais e normaliza.
 */
export class InfractionService {
  static createInfractions(
    input: Omit<Infraction, 'id'>[],
  ): Infraction[] {
    return input.map((item, index) => ({
      id: `MANUAL-${index + 1}`,
      description: item.description.trim(),
      notes: item.notes.trim(),
    }));
  }
}
