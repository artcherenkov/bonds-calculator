// components/MonthlyDataTab.tsx - Вкладка с помесячными данными
import React from "react";
import { MonthlyData } from "../types";
import { formatNumber } from "../utils/formatters";

interface MonthlyDataTabProps {
  monthlyData: MonthlyData[];
}

const MonthlyDataTab: React.FC<MonthlyDataTabProps> = ({ monthlyData }) => {
  if (monthlyData.length === 0) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Помесячные данные</h3>
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
              Облигации
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Купонный доход
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Покупка облигаций
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Стоимость
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Остаток
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Комиссия
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Налог
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
                {formatNumber(item.monthlyIncome)}
                {item.monthlyIncome > 0 && (
                  <span className="text-green-600 ml-1">
                    (+{formatNumber(item.monthlyIncome)})
                  </span>
                )}
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
              <td className="px-3 py-2 whitespace-nowrap">
                {formatNumber(item.marketValue)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap font-medium">
                {formatNumber(item.cash)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                {item.commission > 0 ? (
                  <span className="text-red-600">
                    -{formatNumber(item.commission)}
                  </span>
                ) : (
                  "0.00"
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                {item.tax > 0 ? (
                  <span className="text-red-600">
                    -{formatNumber(item.tax)}
                  </span>
                ) : (
                  "0.00"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyDataTab;
