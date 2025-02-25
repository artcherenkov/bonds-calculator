// components/MonthlyDataTab.tsx - Улучшенная вкладка с помесячными данными
import React, { useState } from "react";
import { Info } from "lucide-react";
import { MonthlyData } from "../types";
import { formatNumber } from "../utils/formatters";
import HelpGuide from "./HelpGuide.tsx";

interface MonthlyDataTabProps {
  monthlyData: MonthlyData[];
}

interface FormulaTooltipProps {
  formula: string;
  description: string;
}

// Компонент для отображения подсказки с формулой
const FormulaTooltip: React.FC<FormulaTooltipProps> = ({
  formula,
  description,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="text-blue-500 p-1 rounded-full hover:bg-blue-100 focus:outline-none"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <Info size={16} />
      </button>
      {showTooltip && (
        <div className="absolute z-10 left-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-3 text-sm w-64">
          <p className="font-semibold mb-1">Формула расчета:</p>
          <p className="italic mb-2">{formula}</p>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

const MonthlyDataTab: React.FC<MonthlyDataTabProps> = ({ monthlyData }) => {
  if (monthlyData.length === 0) return null;

  // Объект с описаниями формул для различных столбцов
  const formulas = {
    coupon: {
      formula: "Количество облигаций × Размер купона",
      description: "Валовая сумма купона до вычета налога",
    },
    tax: {
      formula: "Купонный доход × Ставка налога",
      description: "Налог взимается с купонного дохода по установленной ставке",
    },
    commission: {
      formula: "Сумма покупки × Комиссия брокера",
      description:
        "Комиссия рассчитывается от суммы сделки по покупке облигаций",
    },
    purchaseAmount: {
      formula: "Доступные средства / (1 + Комиссия брокера)",
      description:
        "Максимальная сумма, которую можно потратить на покупку с учетом комиссии",
    },
    bondsCount: {
      formula: "Сумма покупки ÷ Цена облигации (округление вниз)",
      description:
        "Рассчитывается максимальное количество целых облигаций, которое можно купить",
    },
    remainingCash: {
      formula: "Предыдущий остаток + Купон + Пополнение - Покупка - Комиссия",
      description: "Оставшиеся средства после всех операций текущего месяца",
    },
    marketValue: {
      formula: "Количество облигаций × Цена + Остаток денежных средств",
      description: "Общая рыночная стоимость портфеля",
    },
  };

  return (
    <>
      <div className="mb-4">
        <HelpGuide />
      </div>
      <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Помесячные данные</h3>
        <div className="text-sm text-gray-600 mb-4">
          <p>
            Таблица показывает ежемесячную динамику вашего инвестиционного
            портфеля. Нажмите на иконку <Info size={14} className="inline" />{" "}
            рядом с заголовком столбца, чтобы увидеть формулу расчета.
          </p>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Месяц
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Облигации (шт)
                  <FormulaTooltip {...formulas.bondsCount} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Купонный доход
                  <FormulaTooltip {...formulas.coupon} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Стоимость
                  <FormulaTooltip {...formulas.marketValue} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Покупка облигаций
                  <FormulaTooltip {...formulas.purchaseAmount} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Остаток
                  <FormulaTooltip {...formulas.remainingCash} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Комиссия
                  <FormulaTooltip {...formulas.commission} />
                </div>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Налог
                  <FormulaTooltip {...formulas.tax} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-3 py-2 whitespace-nowrap">{item.month}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.date}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatNumber(item.bonds, 0)}
                  {item.bondsPurchased > 0 && (
                    <span className="text-green-600 ml-1">
                      (+{item.bondsPurchased})
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatNumber(item.totalIncome)}
                  {item.monthlyIncome > 0 && (
                    <span className="text-green-600 ml-1">
                      (+{formatNumber(item.monthlyIncome)})
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatNumber(item.marketValue)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {item.bondsPurchaseExpense > 0 ? (
                    <span className="text-red-600">
                      -{formatNumber(item.bondsPurchaseExpense)}
                    </span>
                  ) : (
                    "0.00"
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-medium">
                  {formatNumber(item.cash)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatNumber(item.totalCommission)}
                  {item.commission > 0 && (
                    <span className="text-red-600 ml-1">
                      (-{formatNumber(item.commission)})
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatNumber(item.totalTax)}
                  {item.tax > 0 && (
                    <span className="text-red-600 ml-1">
                      (-{formatNumber(item.tax)})
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MonthlyDataTab;
