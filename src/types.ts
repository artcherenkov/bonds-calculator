// types.ts - Обновленные типы для использования во всем приложении
export interface BondParams {
    initialInvestment: number;
    monthlyInvestment: number;
    bondPrice: number;
    bondNominal: number;
    couponAmount: number;
    brokerCommission: number;
    taxRate: number;
    startMonth: number;  // Новый параметр: месяц начала инвестирования (1-12)
    startYear: number;   // Новый параметр: год начала инвестирования
}

export interface CouponSchedule {
    month: number;
    year: number;
    amount: number;
}

export interface MonthlyData {
    month: number;       // Порядковый номер месяца (1, 2, 3...)
    date: string;        // Форматированная дата (MM/YYYY)
    bonds: number;       // Общее количество облигаций
    invested: number;    // Общая сумма инвестиций
    monthlyIncome: number; // Купонный доход за текущий месяц (после налогов)
    totalIncome: number; // Общий купонный доход (накопленный)
    cash: number;        // Остаток денежных средств
    marketValue: number; // Рыночная стоимость портфеля
    nominalValue: number; // Номинальная стоимость портфеля
    commission: number;  // Комиссия за текущий месяц
    totalCommission: number; // Общая комиссия (накопленная)
    tax: number;         // Налог за текущий месяц
    totalTax: number;    // Общий налог (накопленный)
    bondsPurchased: number; // Количество купленных облигаций в текущем месяце
    bondsPurchaseExpense: number; // Сумма расходов на покупку облигаций в текущем месяце
    isInitial: boolean;  // Флаг, указывающий, является ли это начальной инвестицией
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

export type TabType = "parameters" | "couponSchedule" | "results" | "charts" | "monthly" | "help";
