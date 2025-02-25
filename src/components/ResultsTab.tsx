// components/ResultsTab.tsx - Улучшенная вкладка с результатами
import React from "react";
import { DollarSign, HelpCircle } from "lucide-react";
import { CalculationResults } from "../types";
import { formatNumber } from "../utils/formatters";

interface ResultsTabProps {
  results: CalculationResults | null;
}

interface ResultItemProps {
  label: string;
  value: string | number;
  tooltip?: string;
  isHighlighted?: boolean;
}

const ResultItem: React.FC<ResultItemProps> = ({
  label,
  value,
  tooltip,
  isHighlighted = false,
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className="mb-4 relative">
      <div className="flex items-center">
        <p className="text-gray-600">{label}</p>
        {tooltip && (
          <button
            className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <HelpCircle size={14} />
          </button>
        )}
      </div>
      <p
        className={`text-xl font-semibold ${isHighlighted ? "text-green-600" : ""}`}
      >
        {value}
      </p>
      {showTooltip && tooltip && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg p-3 text-sm w-64 left-0">
          {tooltip}
        </div>
      )}
    </div>
  );
};

const ResultsTab: React.FC<ResultsTabProps> = ({ results }) => {
  if (!results) return null;

  const tooltips = {
    totalBonds:
      "Общее количество облигаций, купленных за весь период инвестирования",
    totalInvested:
      "Сумма первоначальной инвестиции и всех ежемесячных пополнений",
    couponIncome: "Общая сумма купонного дохода после вычета налогов",
    commission:
      "Общая сумма комиссий брокера за все сделки по покупке облигаций",
    tax: "Общая сумма налогов, уплаченных с купонного дохода",
    maturityValue:
      "Стоимость при погашении = Номинал × Количество облигаций + Остаток",
    profit: "Общая прибыль = Стоимость при погашении - Общая сумма инвестиций",
    roi: "Доходность = (Общая прибыль / Общая сумма инвестиций) × 100%",
    annualRoi:
      "Годовая доходность = ((Стоимость при погашении / Общая сумма инвестиций)^(1/количество лет) - 1) × 100%",
    remainingCash: "Денежные средства, которые остались неинвестированными",
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <DollarSign className="mr-2" /> Итоговые результаты инвестиций
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          Расчет выполнен на основе текущих параметров. Наведите курсор на
          значок <HelpCircle size={14} className="inline" /> рядом с
          показателем, чтобы увидеть подробную информацию о расчете.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ResultItem
            label="Общее количество облигаций"
            value={`${formatNumber(results.totalBonds, 0)} шт.`}
            tooltip={tooltips.totalBonds}
          />

          <ResultItem
            label="Общая сумма инвестиций"
            value={`${formatNumber(results.totalInvested)} ₽`}
            tooltip={tooltips.totalInvested}
          />

          <ResultItem
            label="Купонный доход (после налогов)"
            value={`${formatNumber(results.totalCouponIncome)} ₽`}
            tooltip={tooltips.couponIncome}
          />

          <ResultItem
            label="Комиссия брокера"
            value={`${formatNumber(results.totalBrokerCommission)} ₽`}
            tooltip={tooltips.commission}
          />
        </div>

        <div>
          <ResultItem
            label="Налог на купонный доход"
            value={`${formatNumber(results.totalTaxPaid)} ₽`}
            tooltip={tooltips.tax}
          />

          <ResultItem
            label="Стоимость при погашении"
            value={`${formatNumber(results.finalMarketValue)} ₽`}
            tooltip={tooltips.maturityValue}
          />

          <ResultItem
            label="Общая прибыль"
            value={`${formatNumber(results.totalProfit)} ₽`}
            tooltip={tooltips.profit}
            isHighlighted={true}
          />

          <ResultItem
            label="Доходность"
            value={`${formatNumber(results.roiPercent)}% (годовая: ${formatNumber(results.annualRoi)}%)`}
            tooltip={tooltips.roi}
          />

          <ResultItem
            label="Дата окончания расчета"
            value={results.maturityDate}
          />

          <ResultItem
            label="Оставшиеся средства"
            value={`${formatNumber(results.remainingCash)} ₽`}
            tooltip={tooltips.remainingCash}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;
