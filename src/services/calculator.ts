// services/calculator.ts - Сервис для выполнения расчетов
import { format } from "date-fns";
import { BondParams, CouponSchedule, MonthlyData, CalculationResults } from '../types';

export const calculateInvestment = (
    bondParams: BondParams,
    couponSchedule: CouponSchedule[],
    duration: number
): { results: CalculationResults; monthlyData: MonthlyData[] } => {
    const {
        initialInvestment,
        monthlyInvestment,
        bondPrice,
        bondNominal,
        brokerCommission,
        taxRate,
    } = bondParams;

    // Сортируем расписание купонов по дате
    const sortedSchedule = [...couponSchedule].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });

    let totalBonds = 0;
    let totalInvested = 0;
    let totalCouponIncome = 0;
    let totalBrokerCommission = 0;
    let totalTaxPaid = 0;
    let remainingCash = 0;
    const monthlyDataArray: MonthlyData[] = [];

    // Начальная покупка облигаций
    const initialCommission = initialInvestment * (brokerCommission / 100);
    const investmentAfterCommission = initialInvestment - initialCommission;
    const initialBondsPurchased = Math.floor(
        investmentAfterCommission / bondPrice,
    );
    remainingCash =
        investmentAfterCommission - initialBondsPurchased * bondPrice;

    totalBonds += initialBondsPurchased;
    totalInvested += initialInvestment;
    totalBrokerCommission += initialCommission;

    const currentDate = new Date();
    let latestDate = new Date();

    // Создаем массив всех месяцев для расчета
    const allMonths: { month: number; year: number }[] = [];
    for (let i = 0; i < duration; i++) {
        const calcDate = new Date(currentDate);
        calcDate.setMonth(currentDate.getMonth() + i);
        allMonths.push({
            month: calcDate.getMonth() + 1,
            year: calcDate.getFullYear(),
        });
    }

    // Для хранения предыдущих значений
    let prevTotalIncome = 0;
    let prevBonds = totalBonds;

    // Цикл по всем месяцам
    for (let i = 0; i < allMonths.length; i++) {
        const { month, year } = allMonths[i];

        // Проверяем, есть ли купонная выплата в этом месяце
        const couponPayment = sortedSchedule.find(
            (c) => c.month === month && c.year === year,
        );

        let grossCouponIncome = 0;
        let netCouponIncome = 0;
        let taxOnCoupon = 0;

        // Если есть купонная выплата
        if (couponPayment) {
            grossCouponIncome = totalBonds * couponPayment.amount;
            taxOnCoupon = grossCouponIncome * (taxRate / 100);
            netCouponIncome = grossCouponIncome - taxOnCoupon;

            totalCouponIncome += netCouponIncome;
            totalTaxPaid += taxOnCoupon;
        }

        // Добавляем ежемесячное пополнение
        const availableCash = remainingCash + netCouponIncome + monthlyInvestment;

        // Комиссия брокера на новую инвестицию
        const brokerFee = monthlyInvestment > 0 ? monthlyInvestment * (brokerCommission / 100) : 0;
        const cashAfterCommission = availableCash - brokerFee;
        totalBrokerCommission += brokerFee;

        // Покупка новых облигаций
        const newMonthlyBonds = Math.floor(cashAfterCommission / bondPrice);
        const bondsPurchaseExpense = newMonthlyBonds * bondPrice;
        remainingCash = cashAfterCommission - bondsPurchaseExpense;

        totalBonds += newMonthlyBonds;
        totalInvested += monthlyInvestment;

        // Обновляем дату
        const calcDate = new Date(currentDate);
        calcDate.setMonth(currentDate.getMonth() + i);
        latestDate = calcDate;

        // Добавляем данные месяца
        monthlyDataArray.push({
            month: i + 1,
            date: format(calcDate, "MM/yyyy"),
            bonds: totalBonds,
            invested: totalInvested,
            monthlyIncome: netCouponIncome,
            totalIncome: totalCouponIncome,
            cash: remainingCash,
            marketValue: totalBonds * bondPrice + remainingCash,
            nominalValue: totalBonds * bondNominal + remainingCash,
            commission: brokerFee,
            totalCommission: totalBrokerCommission,
            tax: taxOnCoupon,
            totalTax: totalTaxPaid,
            bondsPurchased: newMonthlyBonds,
            bondsPurchaseExpense: bondsPurchaseExpense,
        });
    }

    const finalMarketValue = totalBonds * bondNominal + remainingCash;
    const totalProfit = finalMarketValue - totalInvested;
    const roiPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    const years = duration / 12;
    const annualRoi = totalInvested > 0 && years > 0
        ? (Math.pow(finalMarketValue / totalInvested, 1 / years) - 1) * 100
        : 0;

    const calculationResults: CalculationResults = {
        totalBonds,
        totalInvested,
        totalCouponIncome,
        totalBrokerCommission,
        totalTaxPaid,
        finalMarketValue,
        totalProfit,
        roiPercent,
        annualRoi,
        maturityDate: format(latestDate, "MM/yyyy"),
        remainingCash,
    };

    return { results: calculationResults, monthlyData: monthlyDataArray };
};
