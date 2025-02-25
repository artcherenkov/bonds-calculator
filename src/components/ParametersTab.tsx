// components/ParametersTab.tsx - Вкладка с параметрами
import React, { ChangeEvent } from "react";
import { BondParams } from "../types";

interface ParametersTabProps {
  bondParams: BondParams;
  duration: number;
  onBondParamsChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDurationChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ParametersTab: React.FC<ParametersTabProps> = ({
  bondParams,
  duration,
  onBondParamsChange,
  onDurationChange,
}) => {
  return (
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
          <label className="block text-gray-700 mb-2">Ставка налога (%)</label>
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
          <label className="block text-gray-700 mb-2">Размер купона (₽)</label>
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
  );
};

export default ParametersTab;
