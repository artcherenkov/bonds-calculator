// src/types.ts - Updated with additional types
export interface BondParams {
  initialInvestment: number;
  monthlyInvestment: number;
  bondPrice: number;
  bondNominal: number;
  couponAmount: number;
  brokerCommission: number;
  taxRate: number;
}

export interface CouponSchedule {
  month: number;
  year: number;
  amount: number;
}

export interface MonthlyData {
  month: number;
  date: string;
  bonds: number;
  invested: number;
  monthlyIncome: number;
  totalIncome: number;
  cash: number;
  marketValue: number;
  nominalValue: number;
  commission: number;
  totalCommission: number;
  tax: number;
  totalTax: number;
  bondsPurchased: number;
  bondsPurchaseExpense: number;
}

export interface CalculationResults {
  totalBonds: number;
  totalInvested: number;
  totalCouponIncome: number;
  totalBrokerCommission: number;
  totalTaxPaid: number;
  finalMarketValue: number;
  totalProfit: number;
  roiPercent: number;
  annualRoi: number;
  maturityDate: string;
  remainingCash: number;
}

export type TabType =
  | "parameters"
  | "couponSchedule"
  | "results"
  | "charts"
  | "monthly"
  | "help";

// New types for portfolio management
export interface PortfolioSummary {
  id: string;
  name: string;
  createdAt: number;
  lastModified: number;
  roiPercent?: number;
  totalInvested?: number;
}
