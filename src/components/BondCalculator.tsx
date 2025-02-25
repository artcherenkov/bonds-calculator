// components/BondCalculator.tsx - Основной компонент калькулятора
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

const BondCalculator: React.FC = () => {
  const [bondParams, setBondParams] = useState<BondParams>({
    initialInvestment: 18500,
    monthlyInvestment: 0,
    bondPrice: 1021,
    bondNominal: 1000,
    couponAmount: 18.49,
    brokerCommission: 0.3,
    taxRate: 13,
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
      const currentDate = new Date();

      for (let i = 1; i <= 12; i++) {
        const paymentDate = new Date(currentDate);
        paymentDate.setMonth(currentDate.getMonth() + i);

        defaultSchedule.push({
          month: paymentDate.getMonth() + 1,
          year: paymentDate.getFullYear(),
          amount: bondParams.couponAmount,
        });
      }

      setCouponSchedule(defaultSchedule);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBondParams({
      ...bondParams,
      [name]: parseFloat(value) || 0,
    });
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
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
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
        </div>
      </div>
    </div>
  );
};

export default BondCalculator;
