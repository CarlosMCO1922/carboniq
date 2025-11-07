export type Currency = 'EUR' | 'USD';
export type Locale = 'pt' | 'en';

export interface UnitValue {
  value: number;
  unit: string; // e.g. kWh, L, km, EUR
}

export interface ActivityInput {
  type: string; // e.g. electricity, fuel, transport, spend
  location?: string; // ISO country code
  period?: { start: string; end: string };
  amount: UnitValue;
  metadata?: Record<string, unknown>;
}
