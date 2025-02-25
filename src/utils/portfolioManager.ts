// src/utils/portfolioManager.ts
import { BondParams, CouponSchedule } from "../types";

export interface Portfolio {
  id: string;
  name: string;
  bondParams: BondParams;
  couponSchedule: CouponSchedule[];
  duration: number;
  lastModified: number;
}

export const DEFAULT_PORTFOLIO: Portfolio = {
  id: "default",
  name: "Новый портфель",
  bondParams: {
    initialInvestment: 100000,
    monthlyInvestment: 5000,
    bondPrice: 1020,
    bondNominal: 1000,
    couponAmount: 20,
    brokerCommission: 0.3,
    taxRate: 13,
  },
  couponSchedule: [], // Will be populated in BondCalculator
  duration: 12,
  lastModified: Date.now(),
};
