// src/components/BondCalculator.tsx - Updated with portfolio management
import React, { useState, useEffect, ChangeEvent } from "react";
import { TrendingUp, ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BondParams,
  CouponSchedule,
  MonthlyData,
  CalculationResults,
  TabType,
} from "../types";
import { calculateInvestment } from "../services/calculator";
import { Portfolio } from "../utils/portfolioManager";
import Navigation from "./Navigation";
import ParametersTab from "./ParametersTab";
import CouponScheduleTab from "./CouponScheduleTab";
import ResultsTab from "./ResultsTab";
import ChartsTab from "./ChartsTab";
import MonthlyDataTab from "./MonthlyDataTab";
import HelpGuide from "./HelpGuide.tsx";

interface BondCalculatorProps {
  portfolio: Portfolio;
  onPortfolioUpdate: (portfolio: Portfolio) => void;
}

const BondCalculator: React.FC<BondCalculatorProps> = ({
  portfolio,
  onPortfolioUpdate,
}) => {
  const navigate = useNavigate();
  const { portfolioId } = useParams();

  const [bondParams, setBondParams] = useState<BondParams>(
    portfolio.bondParams,
  );
  const [couponSchedule, setCouponSchedule] = useState<CouponSchedule[]>(
    portfolio.couponSchedule,
  );
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("parameters");
  const [duration, setDuration] = useState<number>(portfolio.duration);
  const [portfolioName, setPortfolioName] = useState<string>(portfolio.name);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  // Check if the current portfolio ID matches the URL parameter
  useEffect(() => {
    // If the portfolio ID from props doesn't match the URL parameter, redirect
    if (portfolioId && portfolio.id !== portfolioId) {
      navigate(`/portfolio/${portfolio.id}`, { replace: true });
    }
  }, [portfolioId, portfolio.id, navigate]);

  // Initialize coupon schedule if empty
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
      setUnsavedChanges(true);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBondParams({
      ...bondParams,
      [name]: parseFloat(value) || 0,
    });
    setUnsavedChanges(true);
  };

  const removeAllCouponPayments = () => {
    setCouponSchedule([]);
    setUnsavedChanges(true);
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDuration(parseInt(e.target.value) || 1);
    setUnsavedChanges(true);
  };

  const handleCouponScheduleChange = (
    index: number,
    field: keyof CouponSchedule,
    value: number,
  ) => {
    const updatedSchedule = [...couponSchedule];
    updatedSchedule[index][field] = value;
    setCouponSchedule(updatedSchedule);
    setUnsavedChanges(true);
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
    setUnsavedChanges(true);
  };

  const removeCouponPayment = (index: number) => {
    setCouponSchedule(couponSchedule.filter((_, i) => i !== index));
    setUnsavedChanges(true);
  };

  const handlePortfolioNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPortfolioName(e.target.value);
    setUnsavedChanges(true);
  };

  const savePortfolio = () => {
    onPortfolioUpdate({
      ...portfolio,
      name: portfolioName,
      bondParams,
      couponSchedule,
      duration,
    });
    setUnsavedChanges(false);
  };

  // Recalculate on parameter changes
  useEffect(() => {
    const { results, monthlyData } = calculateInvestment(
      bondParams,
      couponSchedule,
      duration,
    );
    setResults(results);
    setMonthlyData(monthlyData);
  }, [bondParams, couponSchedule, duration]);

  // Confirm before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (unsavedChanges) {
                    if (
                      window.confirm(
                        "У вас есть несохраненные изменения. Вы уверены, что хотите вернуться без сохранения?",
                      )
                    ) {
                      navigate("/");
                    }
                  } else {
                    navigate("/");
                  }
                }}
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
                aria-label="Вернуться к списку портфелей"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <TrendingUp className="mr-2 w-6 h-6 text-blue-500" />
                <input
                  type="text"
                  value={portfolioName}
                  onChange={handlePortfolioNameChange}
                  className="text-xl font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1"
                />
              </div>
            </div>
            <button
              onClick={savePortfolio}
              disabled={!unsavedChanges}
              className={`px-4 py-2 rounded flex items-center ${
                unsavedChanges
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4 mr-1" /> Сохранить
            </button>
          </div>

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
              bondParams={bondParams}
              onRemoveAllCouponPayments={removeAllCouponPayments}
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
