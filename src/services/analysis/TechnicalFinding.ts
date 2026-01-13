export type TechnicalSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'informational';

export interface TechnicalFinding {
  code: string;
  severity: TechnicalSeverity;
  description: string;
}
