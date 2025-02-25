// components/BondCalculator.tsx - Обновленный основной компонент калькулятора
import React, { useState, useEffect, ChangeEvent } from "react";
import { TrendingUp } from "lucide-react";
import {
  BondParams,
  CouponSchedule,
  MonthlyData,
  CalculationResults,
  TabType,
} from "../types";
import { calculateInvestment } from "../services/calculator";
import Navigation from "./Navigation";
import ParametersTab from "./ParametersTab";
import CouponScheduleTab from "./CouponScheduleTab";
import ResultsTab from "./ResultsTab";
import ChartsTab from "./ChartsTab";
import MonthlyDataTab from "./MonthlyDataTab";
import HelpGuide from "./HelpGuide";

const BondCalculator: React.FC = () => {
  // Получаем текущий месяц и год для инициализации
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript месяцы начинаются с 0
  const currentYear = currentDate.getFullYear();

  const [bondParams, setBondParams] = useState<BondParams>({
    initialInvestment: 100000,
    monthlyInvestment: 5000,
    bondPrice: 1020,
    bondNominal: 1000,
    couponAmount: 20,
    brokerCommission: 0.3,
    taxRate: 13,
    startMonth: currentMonth, // Инициализируем текущим месяцем
    startYear: currentYear, // Инициализируем текущим годом
  });

  const [couponSchedule, setCouponSchedule] = useState<CouponSchedule[]>([]);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("parameters");
  const [duration, setDuration] = useState<number>(12);

  // Инициализация расписания купонов
  useEffect(() => {
    if (couponSchedule.length === 0) {
      const defaultSchedule: CouponSchedule[] = [];
      const startDate = new Date(
        bondParams.startYear,
        bondParams.startMonth - 1,
      );

      for (let i = 1; i <= 12; i++) {
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i);

        defaultSchedule.push({
          month: paymentDate.getMonth() + 1,
          year: paymentDate.getFullYear(),
          amount: bondParams.couponAmount,
        });
      }

      setCouponSchedule(defaultSchedule);
    }
  }, [bondParams.startMonth, bondParams.startYear]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Для числовых полей преобразуем строку в число
    if (
      name === "initialInvestment" ||
      name === "monthlyInvestment" ||
      name === "bondPrice" ||
      name === "bondNominal" ||
      name === "couponAmount" ||
      name === "brokerCommission" ||
      name === "taxRate" ||
      name === "startMonth" ||
      name === "startYear"
    ) {
      setBondParams({
        ...bondParams,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setBondParams({
        ...bondParams,
        [name]: value,
      });
    }
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDuration(parseInt(e.target.value) || 1);
  };

  const handleCouponScheduleChange = (
    index: number,
    field: keyof CouponSchedule,
    value: number,
  ) => {
    const updatedSchedule = [...couponSchedule];
    updatedSchedule[index][field] = value;
    setCouponSchedule(updatedSchedule);
  };

  const addCouponPayment = () => {
    const lastPayment = couponSchedule[couponSchedule.length - 1] || {
      month: bondParams.startMonth,
      year: bondParams.startYear,
      amount: bondParams.couponAmount,
    };

    let newMonth = lastPayment.month + 1;
    let newYear = lastPayment.year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    setCouponSchedule([
      ...couponSchedule,
      {
        month: newMonth,
        year: newYear,
        amount: bondParams.couponAmount,
      },
    ]);
  };

  const removeCouponPayment = (index: number) => {
    setCouponSchedule(couponSchedule.filter((_, i) => i !== index));
  };

  // Пересчет при изменении параметров
  useEffect(() => {
    const { results, monthlyData } = calculateInvestment(
      bondParams,
      couponSchedule,
      duration,
    );
    setResults(results);
    setMonthlyData(monthlyData);
  }, [bondParams, couponSchedule, duration]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2" /> Калькулятор инвестиций в облигации
          </h1>

          <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />

          {activeTab === "parameters" && (
            <ParametersTab
              bondParams={bondParams}
              duration={duration}
              onBondParamsChange={handleInputChange}
              onDurationChange={handleDurationChange}
            />
          )}

          {activeTab === "couponSchedule" && (
            <CouponScheduleTab
              couponSchedule={couponSchedule}
              onCouponScheduleChange={handleCouponScheduleChange}
              onAddCouponPayment={addCouponPayment}
              onRemoveCouponPayment={removeCouponPayment}
            />
          )}

          {activeTab === "results" && <ResultsTab results={results} />}

          {activeTab === "charts" && <ChartsTab monthlyData={monthlyData} />}

          {activeTab === "monthly" && (
            <MonthlyDataTab monthlyData={monthlyData} />
          )}

          {activeTab === "help" && <HelpGuide />}
        </div>
      </div>
    </div>
  );
};

export default BondCalculator;
