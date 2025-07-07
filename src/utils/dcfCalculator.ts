import { DCFAssumptions, DCFCalculation, DCFResult } from '../types';

// Example company data for demonstration
const BASE_REVENUE = 1000000000; // $1B starting revenue
const BASE_DEPRECIATION = 50000000; // $50M depreciation
const SHARES_OUTSTANDING = 100000000; // 100M shares

export function calculateDCF(assumptions: DCFAssumptions & {
  terminalMethod?: 'gordon' | 'multiple',
  exitMultiple?: number,
  exitMultipleType?: 'pe' | 'ebitda',
}): DCFResult {
  const calculations: DCFCalculation[] = [];
  let currentRevenue = BASE_REVENUE;
  let currentDepreciation = BASE_DEPRECIATION;
  let cumulativeWorkingCapital = 0;
  let totalPresentValue = 0;

  // Calculate 5-year forecast period
  for (let year = 1; year <= 5; year++) {
    // Revenue growth
    const revenueGrowth = Math.pow(1 + assumptions.revenueGrowthCAGR / 100, year);
    const revenue = BASE_REVENUE * revenueGrowth;
    
    // Operating profit
    const operatingProfit = revenue * (assumptions.operatingProfitMargin / 100);
    
    // Taxes
    const taxes = operatingProfit * (assumptions.taxRate / 100);
    
    // NOPAT
    const nopat = operatingProfit - taxes;
    
    // Depreciation (assume it grows with revenue)
    const depreciation = BASE_DEPRECIATION * revenueGrowth;
    
    // CAPEX
    const capex = revenue * (assumptions.capexIntensity / 100);
    
    // Working capital change
    const workingCapital = revenue * (assumptions.workingCapitalIntensity / 100);
    const workingCapitalChange = workingCapital - cumulativeWorkingCapital;
    cumulativeWorkingCapital = workingCapital;
    
    // Free cash flow
    const freeCashFlow = nopat + depreciation - capex - workingCapitalChange;
    
    // Present value
    const discountFactor = Math.pow(1 + assumptions.discountRate / 100, year);
    const presentValue = freeCashFlow / discountFactor;
    totalPresentValue += presentValue;
    
    calculations.push({
      year,
      revenue,
      operatingProfit,
      taxes,
      nopat,
      depreciation,
      capex,
      workingCapitalChange,
      freeCashFlow,
      presentValue
    });
    
    currentRevenue = revenue;
    currentDepreciation = depreciation;
  }
  
  // Terminal value calculation
  let terminalValue = 0;
  if (assumptions.terminalMethod === 'multiple' && assumptions.exitMultiple && assumptions.exitMultipleType) {
    // Use exit multiple method
    const year5 = calculations[calculations.length - 1];
    if (assumptions.exitMultipleType === 'pe') {
      // Use Year 5 NOPAT as proxy for earnings
      terminalValue = year5.nopat * assumptions.exitMultiple;
    } else if (assumptions.exitMultipleType === 'ebitda') {
      // Use Year 5 EBITDA as proxy (Operating profit + Depreciation)
      terminalValue = (year5.operatingProfit + year5.depreciation) * assumptions.exitMultiple;
    }
  } else {
    // Default: Gordon Growth
    const finalFCF = calculations[calculations.length - 1].freeCashFlow;
    terminalValue = finalFCF * (1 + assumptions.terminalGrowthRate / 100) / 
                     ((assumptions.discountRate / 100) - (assumptions.terminalGrowthRate / 100));
  }
  
  // Present value of terminal value
  const terminalDiscountFactor = Math.pow(1 + assumptions.discountRate / 100, 5);
  const presentValueTerminalValue = terminalValue / terminalDiscountFactor;
  
  // Total enterprise value
  const totalEnterpriseValue = totalPresentValue + presentValueTerminalValue;
  
  // Fair value per share
  const fairValuePerShare = totalEnterpriseValue / SHARES_OUTSTANDING;
  
  return {
    assumptions,
    calculations,
    terminalValue,
    presentValueTerminalValue,
    totalPresentValue,
    fairValue: totalEnterpriseValue,
    sharesOutstanding: SHARES_OUTSTANDING,
    fairValuePerShare
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
} 