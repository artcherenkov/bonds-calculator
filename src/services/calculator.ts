// services/calculator.ts - Исправленный сервис для расчета инвестиций в облигации
import { format } from "date-fns";
import {
  BondParams,
  CouponSchedule,
  MonthlyData,
  CalculationResults,
} from "../types";

/**
 * Рассчитывает инвестиции в облигации с учетом:
 * - Комиссии брокера с каждой сделки покупки
 * - Купонных выплат и их реинвестирования
 * - Налогов на купонный доход
 * - Ежемесячного пополнения
 */
export const calculateInvestment = (
  bondParams: BondParams,
  couponSchedule: CouponSchedule[],
  duration: number,
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

  // Инициализируем переменные для отслеживания состояния инвестиций
  let totalBonds = 0; // Общее количество облигаций
  let totalInvested = 0; // Общая сумма инвестиций
  let totalCouponIncome = 0; // Общий чистый купонный доход
  let totalBrokerCommission = 0; // Общая сумма комиссий брокера
  let totalTaxPaid = 0; // Общая сумма налогов
  let remainingCash = 0; // Остаток денежных средств
  const monthlyDataArray: MonthlyData[] = []; // Массив для хранения данных по месяцам

  // Используем текущую дату как стартовую
  const currentDate = new Date();
  // Создаем безопасную копию текущей даты для начала расчетов
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  let latestDate = new Date(startDate);

  // ШАГ 1: Первоначальная покупка облигаций - добавляем отдельной записью

  // Для корректного расчета максимальной суммы покупки с учетом комиссии используем формулу:
  // max_сумма_покупки = доступные_средства / (1 + комиссия_процент / 100)
  const maxInitialPurchase = initialInvestment / (1 + brokerCommission / 100);

  // Рассчитываем количество облигаций, которое можно купить изначально
  const initialBondsPurchased = Math.floor(maxInitialPurchase / bondPrice);

  // Рассчитываем фактическую сумму покупки облигаций
  const initialPurchaseAmount = initialBondsPurchased * bondPrice;

  // Рассчитываем комиссию от фактической суммы покупки
  const initialCommission = initialPurchaseAmount * (brokerCommission / 100);

  // Рассчитываем остаток денежных средств после покупки
  remainingCash = initialInvestment - initialPurchaseAmount - initialCommission;

  // Обновляем общие счетчики
  totalBonds += initialBondsPurchased;
  totalInvested += initialInvestment;
  totalBrokerCommission += initialCommission;

  // Добавляем запись о начальной инвестиции в массив данных
  monthlyDataArray.push({
    month: 1, // Первый месяц
    date: format(startDate, "MM/yyyy"),
    bonds: totalBonds,
    invested: totalInvested,
    monthlyIncome: 0, // Нет купонного дохода в первый месяц
    totalIncome: 0,
    cash: remainingCash,
    marketValue: totalBonds * bondPrice + remainingCash,
    nominalValue: totalBonds * bondNominal + remainingCash,
    commission: initialCommission,
    totalCommission: totalBrokerCommission,
    tax: 0, // Нет налога в первый месяц
    totalTax: 0,
    bondsPurchased: initialBondsPurchased,
    bondsPurchaseExpense: initialPurchaseAmount,
    // Не добавляем isInitial, так как этого свойства нет в интерфейсе MonthlyData
  });

  // Создаем массив всех месяцев для расчета (начиная со второго месяца)
  const allMonths: { month: number; year: number }[] = [];
  for (let i = 1; i < duration; i++) {
    // Начинаем с 1, потому что 0 - это начальная инвестиция
    const calcDate = new Date(startDate);
    calcDate.setMonth(startDate.getMonth() + i);
    allMonths.push({
      month: calcDate.getMonth() + 1,
      year: calcDate.getFullYear(),
    });
  }

  // ШАГ 2: Помесячные расчеты (начиная со второго месяца)
  // Цикл по всем месяцам
  for (let i = 0; i < allMonths.length; i++) {
    const { month, year } = allMonths[i];
    const monthIndex = i + 2; // Индекс месяца в таблице (начиная со 2)

    // Проверяем, есть ли купонная выплата в этом месяце
    const couponPayment = sortedSchedule.find(
      (c) => c.month === month && c.year === year,
    );

    let grossCouponIncome = 0; // Валовый купонный доход
    let netCouponIncome = 0; // Чистый купонный доход после налогов
    let taxOnCoupon = 0; // Налог на купонный доход

    // Если есть купонная выплата
    if (couponPayment) {
      // Рассчитываем валовый купонный доход
      grossCouponIncome = totalBonds * couponPayment.amount;

      // Рассчитываем налог на купонный доход
      taxOnCoupon = grossCouponIncome * (taxRate / 100);

      // Рассчитываем чистый купонный доход после уплаты налога
      netCouponIncome = grossCouponIncome - taxOnCoupon;

      // Обновляем общие суммы
      totalCouponIncome += netCouponIncome;
      totalTaxPaid += taxOnCoupon;
    }

    // Рассчитываем доступные средства для покупки новых облигаций
    const availableCash = remainingCash + netCouponIncome + monthlyInvestment;

    // Переменные для отслеживания данных текущего месяца
    let newMonthlyBonds = 0; // Количество купленных облигаций
    let bondsPurchaseExpense = 0; // Сумма покупки облигаций
    let brokerFee = 0; // Комиссия брокера

    // Если есть доступные средства для покупки хотя бы одной облигации
    if (availableCash >= bondPrice) {
      // Рассчитываем максимальную сумму для покупки с учетом комиссии
      const maxPurchaseAmount = availableCash / (1 + brokerCommission / 100);

      // Рассчитываем количество облигаций, которое можно купить
      newMonthlyBonds = Math.floor(maxPurchaseAmount / bondPrice);

      // Если можем купить хотя бы одну облигацию
      if (newMonthlyBonds > 0) {
        // Рассчитываем фактическую сумму покупки
        bondsPurchaseExpense = newMonthlyBonds * bondPrice;

        // Рассчитываем комиссию брокера
        brokerFee = bondsPurchaseExpense * (brokerCommission / 100);

        // Обновляем общую сумму комиссий
        totalBrokerCommission += brokerFee;

        // Обновляем общее количество облигаций
        totalBonds += newMonthlyBonds;
      }
    }

    // Рассчитываем остаток денежных средств
    remainingCash = availableCash - bondsPurchaseExpense - brokerFee;

    // Если было ежемесячное пополнение, добавляем его к общей сумме инвестиций
    if (monthlyInvestment > 0) {
      totalInvested += monthlyInvestment;
    }

    // Обновляем дату для расчета
    const calcDate = new Date(startDate);
    calcDate.setMonth(startDate.getMonth() + i + 1); // +1 потому что начинаем со второго месяца
    latestDate = calcDate;

    // Добавляем данные месяца в массив
    monthlyDataArray.push({
      month: monthIndex,
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
      // Удаляем isInitial, так как этого свойства нет в интерфейсе MonthlyData
    });
  }

  // ШАГ 3: Итоговые результаты
  // Рассчитываем финальную стоимость инвестиции при погашении по номиналу
  const finalMarketValue = totalBonds * bondNominal + remainingCash;

  // Общая прибыль = итоговая стоимость - вложенные средства
  const totalProfit = finalMarketValue - totalInvested;

  // Рассчитываем доходность инвестиций
  const roiPercent =
    totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Рассчитываем годовую доходность (CAGR)
  const years = duration / 12;
  const annualRoi =
    totalInvested > 0 && years > 0
      ? (Math.pow(finalMarketValue / totalInvested, 1 / years) - 1) * 100
      : 0;

  // Формируем итоговый объект с результатами
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
