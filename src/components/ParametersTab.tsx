// components/ParametersTab.tsx - Enhanced with tooltips
import React, { ChangeEvent } from "react";
import { HelpCircle } from "lucide-react";
import { BondParams } from "../types";
import Tooltip from "./Tooltip";
import { formatNumber } from "../utils/formatters";

interface ParametersTabProps {
  bondParams: BondParams;
  duration: number;
  onBondParamsChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDurationChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Enhanced Number Input that formats values for display
const NumberInput: React.FC<{
  name: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  tooltip: string;
  step?: string;
  min?: string;
  max?: string;
  prefix?: string;
  suffix?: string;
}> = ({
  name,
  value,
  onChange,
  label,
  tooltip,
  step = "1",
  min = "0",
  max,
  prefix,
  suffix,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <label className="block text-gray-700">{label}</label>
        <Tooltip content={tooltip}>
          <button className="ml-1 text-gray-400 hover:text-gray-600">
            <HelpCircle className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {prefix}
          </div>
        )}
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          max={max}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            {suffix}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Текущее значение: {prefix || ""}
        {formatNumber(value)}
        {suffix || ""}
      </p>
    </div>
  );
};

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

        <NumberInput
          name="initialInvestment"
          value={bondParams.initialInvestment}
          onChange={onBondParamsChange}
          label="Начальная инвестиция"
          tooltip="Сумма средств, которую вы инвестируете изначально для покупки облигаций"
          step="100"
          suffix=" ₽"
        />

        <NumberInput
          name="monthlyInvestment"
          value={bondParams.monthlyInvestment}
          onChange={onBondParamsChange}
          label="Ежемесячное пополнение"
          tooltip="Сумма, которую вы планируете добавлять к инвестициям каждый месяц"
          step="100"
          suffix=" ₽"
        />

        <NumberInput
          name="brokerCommission"
          value={bondParams.brokerCommission}
          onChange={onBondParamsChange}
          label="Комиссия брокера"
          tooltip="Процент, который брокер взимает за каждую операцию покупки облигаций"
          step="0.1"
          min="0"
          max="100"
          suffix=" %"
        />

        <NumberInput
          name="taxRate"
          value={bondParams.taxRate}
          onChange={onBondParamsChange}
          label="Ставка налога"
          tooltip="Процент налога, который взимается с купонного дохода (стандартная ставка НДФЛ - 13%)"
          step="1"
          min="0"
          max="100"
          suffix=" %"
        />

        <NumberInput
          name="duration"
          value={duration}
          onChange={onDurationChange}
          label="Период расчета"
          tooltip="Количество месяцев, на которые вы планируете инвестировать"
          step="1"
          min="1"
          max="120"
          suffix=" мес."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Параметры облигации
        </h2>

        <NumberInput
          name="bondPrice"
          value={bondParams.bondPrice}
          onChange={onBondParamsChange}
          label="Текущая цена облигации"
          tooltip="Рыночная стоимость одной облигации. Может отличаться от номинала и изменяться со временем"
          step="0.01"
          min="0.01"
          suffix=" ₽"
        />

        <NumberInput
          name="bondNominal"
          value={bondParams.bondNominal}
          onChange={onBondParamsChange}
          label="Номинал облигации"
          tooltip="Номинальная стоимость облигации, которая будет выплачена при погашении"
          step="0.01"
          min="0.01"
          suffix=" ₽"
        />

        <NumberInput
          name="couponAmount"
          value={bondParams.couponAmount}
          onChange={onBondParamsChange}
          label="Размер купона"
          tooltip="Сумма в рублях, которую эмитент выплачивает за каждую облигацию при каждой купонной выплате"
          step="0.01"
          min="0"
          suffix=" ₽"
        />

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-md font-semibold text-blue-800 mb-2">
            Что такое облигации?
          </h3>
          <p className="text-sm text-blue-800">
            Облигация — это долговая ценная бумага. Покупая облигацию, вы даёте
            деньги в долг компании или государству. В обмен вы получаете:
          </p>
          <ul className="text-sm text-blue-800 list-disc pl-5 mt-2">
            <li>
              Регулярные выплаты (купоны) — в % от номинала или фиксированной
              суммой
            </li>
            <li>Возврат номинала облигации при погашении</li>
          </ul>
          <p className="text-sm text-blue-800 mt-2">
            Доходность облигации складывается из купонных выплат и разницы между
            ценой покупки и номиналом при погашении.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParametersTab;
