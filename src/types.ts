export interface DCFAssumptions {
  revenueGrowthCAGR: number;
  operatingProfitMargin: number;
  discountRate: number;
  capexIntensity: number;
  workingCapitalIntensity: number;
  taxRate: number;
  terminalGrowthRate: number;
}

export interface Scenario {
  id: string;
  name: string;
  assumptions: DCFAssumptions;
  fairValue: number;
}

export interface DCFCalculation {
  year: number;
  revenue: number;
  operatingProfit: number;
  taxes: number;
  nopat: number;
  depreciation: number;
  capex: number;
  workingCapitalChange: number;
  freeCashFlow: number;
  presentValue: number;
}

export interface DCFResult {
  assumptions: DCFAssumptions;
  calculations: DCFCalculation[];
  terminalValue: number;
  presentValueTerminalValue: number;
  totalPresentValue: number;
  fairValue: number;
  sharesOutstanding: number;
  fairValuePerShare: number;
} 