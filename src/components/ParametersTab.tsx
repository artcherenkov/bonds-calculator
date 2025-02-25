// components/ParametersTab.tsx - Обновленная вкладка с параметрами
import React, { ChangeEvent } from "react";
import { BondParams } from "../types";

interface ParametersTabProps {
  bondParams: BondParams;
  duration: number;
  onBondParamsChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => void;
  onDurationChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ParametersTab: React.FC<ParametersTabProps> = ({
  bondParams,
  duration,
  onBondParamsChange,
  onDurationChange,
}) => {
  // Генерируем список месяцев для выбора
  const months = [
    { value: 1, label: "Январь" },
    { value: 2, label: "Февраль" },
    { value: 3, label: "Март" },
    { value: 4, label: "Апрель" },
    { value: 5, label: "Май" },
    { value: 6, label: "Июнь" },
    { value: 7, label: "Июль" },
    { value: 8, label: "Август" },
    { value: 9, label: "Сентябрь" },
    { value: 10, label: "Октябрь" },
    { value: 11, label: "Ноябрь" },
    { value: 12, label: "Декабрь" },
  ];

  // Генерируем список лет для выбора (текущий год и 5 лет вперед)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          Изменение параметров моментально влияет на результаты расчётов
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Параметры инвестиции
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Начальная инвестиция (₽)
            </label>
            <input
              type="number"
              name="initialInvestment"
              value={bondParams.initialInvestment}
              onChange={onBondParamsChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Ежемесячное пополнение (₽)
            </label>
            <input
              type="number"
              name="monthlyInvestment"
              value={bondParams.monthlyInvestment}
              onChange={onBondParamsChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Дата начала инвестирования
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                name="startMonth"
                value={bondParams.startMonth}
                onChange={onBondParamsChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                name="startYear"
                value={bondParams.startYear}
                onChange={onBondParamsChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Комиссия брокера (%)
            </label>
            <input
              type="number"
              name="brokerCommission"
              value={bondParams.brokerCommission}
              onChange={onBondParamsChange}
              step="0.1"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              min="0"
              max="100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Ставка налога (%)
            </label>
            <input
              type="number"
              name="taxRate"
              value={bondParams.taxRate}
              onChange={onBondParamsChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              min="0"
              max="100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Период расчета (месяцев)
            </label>
            <input
              type="number"
              name="duration"
              value={duration}
              onChange={onDurationChange}
              min="1"
              max="120"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Параметры облигации
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Текущая цена облигации (₽)
            </label>
            <input
              type="number"
              name="bondPrice"
              value={bondParams.bondPrice}
              onChange={onBondParamsChange}
              step="0.01"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              min="0.01"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Номинал облигации (₽)
            </label>
            <input
              type="number"
              name="bondNominal"
              value={bondParams.bondNominal}
              onChange={onBondParamsChange}
              step="0.01"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              min="0.01"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Размер купона (₽)
            </label>
            <input
              type="number"
              name="couponAmount"
              value={bondParams.couponAmount}
              onChange={onBondParamsChange}
              step="0.01"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              min="0"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ParametersTab;
