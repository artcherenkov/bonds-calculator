// components/ResultsTab.tsx - Вкладка с результатами
import React from "react";
import { DollarSign } from "lucide-react";
import { CalculationResults } from "../types";
import { formatNumber } from "../utils/formatters";

interface ResultsTabProps {
  results: CalculationResults | null;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ results }) => {
  if (!results) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <DollarSign className="mr-2" /> Итоговые результаты
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <p className="text-gray-600">Общее количество облигаций</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.totalBonds, 0)} шт.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Общая сумма инвестиций</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.totalInvested)} ₽
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Купонный доход (после налогов)</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.totalCouponIncome)} ₽
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Комиссия брокера</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.totalBrokerCommission)} ₽
            </p>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <p className="text-gray-600">Налог на купонный доход</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.totalTaxPaid)} ₽
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Стоимость при погашении</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.finalMarketValue)} ₽
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Общая прибыль</p>
            <p className="text-xl font-semibold text-green-600">
              {formatNumber(results.totalProfit)} ₽
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Доходность</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.roiPercent)}% (годовая:{" "}
              {formatNumber(results.annualRoi)}%)
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Дата окончания расчета</p>
            <p className="text-xl font-semibold">{results.maturityDate}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Оставшиеся средства</p>
            <p className="text-xl font-semibold">
              {formatNumber(results.remainingCash)} ₽
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;
