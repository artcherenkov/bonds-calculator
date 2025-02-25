// components/ChartsTab.tsx - Вкладка с графиками
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyData } from "../types";
import { formatNumber } from "../utils/formatters";

interface ChartsTabProps {
  monthlyData: MonthlyData[];
}

const ChartsTab: React.FC<ChartsTabProps> = ({ monthlyData }) => {
  if (monthlyData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Динамика стоимости портфеля
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{
                value: "Месяц",
                position: "insideBottomRight",
                offset: -10,
              }}
            />
            <YAxis />
            <Tooltip formatter={(value) => [`${formatNumber(+value)} ₽`, ""]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="invested"
              name="Инвестировано"
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              dataKey="marketValue"
              name="Рыночная стоимость"
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              dataKey="nominalValue"
              name="Номинальная стоимость"
              stroke="#ffc658"
            />
            <Line
              type="monotone"
              dataKey="cash"
              name="Остаток денежных средств"
              stroke="#ff7300"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Рост количества облигаций
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{
                value: "Месяц",
                position: "insideBottomRight",
                offset: -10,
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${formatNumber(+value, 0)} шт.`, ""]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bonds"
              name="Количество облигаций"
              stroke="#8884d8"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Купонный доход и расходы</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{
                value: "Месяц",
                position: "insideBottomRight",
                offset: -10,
              }}
            />
            <YAxis />
            <Tooltip formatter={(value) => [`${formatNumber(+value)} ₽`, ""]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalIncome"
              name="Накопленный купонный доход"
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              dataKey="totalCommission"
              name="Комиссии"
              stroke="#ff7300"
            />
            <Line
              type="monotone"
              dataKey="totalTax"
              name="Налоги"
              stroke="#ff0000"
            />
            <Line
              type="monotone"
              dataKey="cash"
              name="Остаток денежных средств"
              stroke="#0088FE"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsTab;
