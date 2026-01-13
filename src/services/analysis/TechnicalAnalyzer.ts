import { Infraction } from '../infractions/types';
import { AnalyzedInfraction } from './AnalyzedInfraction';

export function analyzeInfractions(
  infractions: Infraction[],
): AnalyzedInfraction[] {
  return infractions.map((infraction) => ({
    ...infraction,
    analysis: {
      findings: [],
    },
  }));
}
