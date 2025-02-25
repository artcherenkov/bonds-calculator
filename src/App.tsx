import "./App.css";
import { useState, useEffect, ChangeEvent } from "react";
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
import {
  Settings,
  Calculator,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
} from "lucide-react";

// Форматирование числа для отображения
const formatNumber = (number: number, decimals = 2) => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

interface BondParams {
  initialInvestment: number;
  monthlyInvestment: number;
  bondPrice: number;
  bondNominal: number;
  couponAmount: number;
  remainingCoupons: number;
  couponFrequency: number;
  brokerCommission: number;
  taxRate: number;
}

interface MonthlyData {
  month: number;
  date: string;
  bonds: number;
  invested: number;
  monthlyIncome: number;
  totalIncome: number;
  cash: number;
  marketValue: number;
  nominalValue: number;
  commission: number;
  totalCommission: number;
  tax: number;
  totalTax: number;
}

interface CalculationResults {
  totalBonds: number;
  totalInvested: number;
  totalCouponIncome: number;
  totalBrokerCommission: number;
  totalTaxPaid: number;
  finalMarketValue: number;
  totalProfit: number;
  roiPercent: number;
  annualRoi: number;
  maturityDate: string;
}

const BondCalculator = () => {
  const [bondParams, setBondParams] = useState<BondParams>({
    initialInvestment: 300000,
    monthlyInvestment: 10000,
    bondPrice: 827.52,
    bondNominal: 812.59,
    couponAmount: 14.11,
    remainingCoupons: 103,
    couponFrequency: 12,
    brokerCommission: 0.3,
    taxRate: 13,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("parameters");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBondParams({
      ...bondParams,
      [name]: parseFloat(value),
    });
  };

  const calculateInvestment = () => {
    const {
      initialInvestment,
      monthlyInvestment,
      bondPrice,
      bondNominal,
      couponAmount,
      remainingCoupons,
      couponFrequency,
      brokerCommission,
      taxRate,
    } = bondParams;

    let totalBonds = 0;
    let totalInvested = 0;
    let totalCouponIncome = 0;
    let totalBrokerCommission = 0;
    let totalTaxPaid = 0;
    let remainingCash = 0;
    const monthlyDataArray: MonthlyData[] = [];

    const initialCommission = initialInvestment * (brokerCommission / 100);
    const investmentAfterCommission = initialInvestment - initialCommission;
    const newBonds = Math.floor(investmentAfterCommission / bondPrice);
    remainingCash = investmentAfterCommission - newBonds * bondPrice;

    totalBonds += newBonds;
    totalInvested += initialInvestment;
    totalBrokerCommission += initialCommission;

    for (let month = 1; month <= remainingCoupons; month++) {
      const isCouponMonth = month % (12 / couponFrequency) === 0;
      let grossCouponIncome = 0;

      if (!isCouponMonth) {
        continue;
      }

      grossCouponIncome = totalBonds * couponAmount;
      const taxOnCoupon = grossCouponIncome * (taxRate / 100);
      const netCouponIncome = grossCouponIncome - taxOnCoupon;

      totalCouponIncome += netCouponIncome;
      totalTaxPaid += taxOnCoupon;
      const availableCash = remainingCash + netCouponIncome + monthlyInvestment;

      const brokerFee = monthlyInvestment * (brokerCommission / 100);
      const cashAfterCommission = availableCash - brokerFee;
      totalBrokerCommission += brokerFee;

      const newMonthlyBonds = Math.floor(cashAfterCommission / bondPrice);
      remainingCash = cashAfterCommission - newMonthlyBonds * bondPrice;

      totalBonds += newMonthlyBonds;
      totalInvested += monthlyInvestment;

      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + month);

      monthlyDataArray.push({
        month,
        date: currentDate.toLocaleDateString(),
        bonds: totalBonds,
        invested: totalInvested,
        monthlyIncome: netCouponIncome,
        totalIncome: totalCouponIncome,
        cash: remainingCash,
        marketValue: totalBonds * bondPrice + remainingCash,
        nominalValue: totalBonds * bondNominal + remainingCash,
        commission: brokerFee,
        totalCommission: totalBrokerCommission,
        tax: taxOnCoupon,
        totalTax: totalTaxPaid,
      });
    }

    const finalMarketValue = totalBonds * bondNominal + remainingCash;
    const totalProfit = finalMarketValue - totalInvested;
    const roiPercent = (totalProfit / totalInvested) * 100;
    const years = remainingCoupons / couponFrequency;
    const annualRoi =
      (Math.pow(finalMarketValue / totalInvested, 1 / years) - 1) * 100;

    const maturityDate = new Date();
    maturityDate.setMonth(
      maturityDate.getMonth() + remainingCoupons / (couponFrequency / 12),
    );

    const calculationResults: CalculationResults = {
      totalBonds,
      totalInvested,
      totalCouponIncome,
      totalBrokerCommission,
      totalTaxPaid,
      finalMarketValue,
      totalProfit,
      roiPercent,
      annualRoi,
      maturityDate: maturityDate.toLocaleDateString(),
    };

    setResults(calculationResults);
    setMonthlyData(monthlyDataArray);
  };

  useEffect(() => {
    calculateInvestment();
  }, [bondParams]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2" /> Калькулятор инвестиций в облигации
          </h1>

          {/* Навигация */}
          <div className="flex mb-6 border-b">
            <button
              className={`px-4 py-2 ${activeTab === "parameters" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("parameters")}
            >
              <Settings className="inline mr-1 w-4 h-4" /> Параметры
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "results" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("results")}
            >
              <Calculator className="inline mr-1 w-4 h-4" /> Результаты
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "charts" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("charts")}
            >
              <PieChart className="inline mr-1 w-4 h-4" /> Графики
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "monthly" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("monthly")}
            >
              <Calendar className="inline mr-1 w-4 h-4" /> Помесячные данные
            </button>
          </div>

          {/* Параметры */}
          {activeTab === "parameters" && (
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
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Количество оставшихся купонов
                  </label>
                  <input
                    type="number"
                    name="remainingCoupons"
                    value={bondParams.remainingCoupons}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Частота выплат купонов в год
                  </label>
                  <input
                    type="number"
                    name="couponFrequency"
                    value={bondParams.couponFrequency}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Результаты */}
          {activeTab === "results" && results && (
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
                    <p className="text-gray-600">
                      Купонный доход (после налогов)
                    </p>
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
                    <p className="text-gray-600">Дата погашения</p>
                    <p className="text-xl font-semibold">
                      {results.maturityDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Графики */}
          {activeTab === "charts" && monthlyData.length > 0 && (
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
                    <Tooltip
                      formatter={(value) => [`${formatNumber(+value)} ₽`, ""]}
                    />
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
                      formatter={(value) => [
                        `${formatNumber(+value, 0)} шт.`,
                        "",
                      ]}
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
                <h3 className="text-lg font-semibold mb-4">
                  Купонный доход и расходы
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
                      formatter={(value) => [`${formatNumber(+value)} ₽`, ""]}
                    />
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
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Помесячные данные */}
          {activeTab === "monthly" && monthlyData.length > 0 && (
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
                      Инвестировано
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Купон за месяц
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Стоимость
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
                      <td className="px-3 py-2 whitespace-nowrap">
                        {item.month}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatNumber(item.bonds, 0)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatNumber(item.invested)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatNumber(item.monthlyIncome)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatNumber(item.marketValue)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatNumber(item.commission)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatNumber(item.tax)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return <BondCalculator />;
};

export default App;
