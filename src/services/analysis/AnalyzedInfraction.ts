import { Infraction } from '../infractions/types';

export interface AnalyzedInfraction
  extends Infraction {
  analysis: {
    findings: [];
  };
}
