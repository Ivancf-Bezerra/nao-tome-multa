import { AnalyzedInfraction } from './AnalyzedInfraction';

export interface AnalysisResult {
  totalInfractions: number;
  findingsCount: number;
  hasRelevantFindings: boolean;
}

export function buildAnalysisResult(
  infractions: AnalyzedInfraction[],
): AnalysisResult {
  return {
    totalInfractions: infractions.length,
    findingsCount: 0,
    hasRelevantFindings: false,
  };
}
