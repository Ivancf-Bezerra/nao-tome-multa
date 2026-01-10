export interface Infraction {
  id: string;
  code: string; // Ex: 501-0
  description: string;
  status: 'pending' | 'active' | 'cleared';
  amount: number;
  location: string;
  occuredAt: string;
  points: number;
  severity: 'Light' | 'Medium' | 'Serious' | 'Very Serious';
}

export interface InspectionResult {
  lastUpdate: string;
  infractions: Infraction[];
  totalAmount: number;
}