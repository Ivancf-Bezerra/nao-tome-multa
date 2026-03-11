export type InconsistencyCode =
  | 'MISSING_AGENT_ID'
  | 'MISSING_AIT_NUMBER'
  | 'MISSING_RENAINF'
  | 'MISSING_EQUIPMENT_ID'
  | 'EQUIPMENT_CALIBRATION_EXPIRED'
  | 'MISSING_ISSUING_BODY'
  | 'MISSING_COMPETENT_BODY'
  | 'INVALID_DATE_FORMAT'
  | 'MISSING_INFRACTION_CODE';

export type InconsistencySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface InconsistencyRule {
  code: InconsistencyCode;
  title: string;
  description: string;
  severity: InconsistencySeverity;
  legalBasis: string;
  defenseTemplateCode: string;
}
