// components/CouponScheduleTab.tsx - Enhanced version
import React, { useState } from "react";
import { Plus, Trash2, Info, HelpCircle, Calendar } from "lucide-react";
import { CouponSchedule, BondParams } from "../types";
import Tooltip from "./Tooltip";

interface CouponScheduleTabProps {
  couponSchedule: CouponSchedule[];
  onCouponScheduleChange: (
    index: number,
    field: keyof CouponSchedule,
    value: number,
  ) => void;
  onAddCouponPayment: () => void;
  onRemoveCouponPayment: (index: number) => void;
  bondParams: BondParams;
  onRemoveAllCouponPayments?: () => void;
}

const CouponScheduleTab: React.FC<CouponScheduleTabProps> = ({
  couponSchedule,
  onCouponScheduleChange,
  onAddCouponPayment,
  onRemoveCouponPayment,
  bondParams,
  onRemoveAllCouponPayments,
}) => {
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [frequency, setFrequency] = useState<
    "monthly" | "quarterly" | "semi-annual" | "annual"
  >("quarterly");
  const [startMonth, setStartMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [numberOfPayments, setNumberOfPayments] = useState<number>(4);
  const [couponAmount, setCouponAmount] = useState<number>(
    bondParams.couponAmount,
  );
  const [showInstructions, setShowInstructions] = useState(true);

  const handleRemoveAll = () => {
    // Ask for confirmation before deleting all
    if (couponSchedule.length === 0) {
      return; // No coupons to delete
    }

    if (
      window.confirm("Вы уверены, что хотите удалить все купонные выплаты?")
    ) {
      // If a handler function was provided, call it
      if (onRemoveAllCouponPayments) {
        onRemoveAllCouponPayments();
      } else {
        // Fallback implementation - remove items one by one from the end
        while (couponSchedule.length > 0) {
          onRemoveCouponPayment(couponSchedule.length - 1);
        }
      }
    }
  };

  const generateCouponSchedule = () => {
    const newSchedule: CouponSchedule[] = [];
    let currentMonth = startMonth;
    let currentYear = startYear;
    let interval = 1; // monthly

    // Set interval based on frequency
    if (frequency === "quarterly") interval = 3;
    else if (frequency === "semi-annual") interval = 6;
    else if (frequency === "annual") interval = 12;

    for (let i = 0; i < numberOfPayments; i++) {
      newSchedule.push({
        month: currentMonth,
        year: currentYear,
        amount: couponAmount,
      });

      // Calculate next date
      currentMonth += interval;
      while (currentMonth > 12) {
        currentMonth -= 12;
        currentYear += 1;
      }
    }

    return newSchedule;
  };

  const handleBatchAdd = () => {
    const newCoupons = generateCouponSchedule();

    // Clear existing coupons if user confirms
    if (
      couponSchedule.length > 0 &&
      !window.confirm("Добавить новые купоны к существующим?")
    ) {
      // Replace existing schedule
      setCouponSchedule(newCoupons);
    } else {
      // Add to existing schedule
      const combined = [...couponSchedule, ...newCoupons];
      setCouponSchedule(combined);
    }

    setIsAddingBatch(false);
  };

  // Helper function to sort and deduplicate the coupon schedule
  const setCouponSchedule = (schedule: CouponSchedule[]) => {
    // Sort by date
    const sorted = [...schedule].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Deduplicate (combine coupons on the same month/year)
    const uniqueDates: Record<string, number> = {};
    const uniqueSchedule: CouponSchedule[] = [];

    sorted.forEach((coupon) => {
      const dateKey = `${coupon.year}-${coupon.month}`;
      if (uniqueDates[dateKey] === undefined) {
        uniqueDates[dateKey] = uniqueSchedule.length;
        uniqueSchedule.push(coupon);
      } else {
        // If there's already a coupon for this date, add the amounts
        const index = uniqueDates[dateKey];
        uniqueSchedule[index].amount += coupon.amount;
      }
    });

    // Update the parent component's state with our modified schedule
    // We need to re-add all coupons one by one
    while (couponSchedule.length > 0) {
      onRemoveCouponPayment(0);
    }

    uniqueSchedule.forEach((coupon) => {
      const index = couponSchedule.length;
      couponSchedule.push(coupon); // Add empty coupon
      onCouponScheduleChange(index, "month", coupon.month);
      onCouponScheduleChange(index, "year", coupon.year);
      onCouponScheduleChange(index, "amount", coupon.amount);
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            График выплаты купонов
          </h2>
          <Tooltip content="Купоны - это периодические выплаты, которые получает владелец облигации. Их размер и периодичность зависят от условий выпуска облигации.">
            <button className="ml-2 text-gray-400 hover:text-gray-600">
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingBatch(true)}
            className="px-3 py-1 bg-green-500 text-white rounded flex items-center"
          >
            <Calendar className="w-4 h-4 mr-1" /> Создать график
          </button>
          <button
            onClick={onAddCouponPayment}
            className="px-3 py-1 bg-blue-500 text-white rounded flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Добавить
          </button>
          {couponSchedule.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="px-3 py-1 bg-red-500 text-white rounded flex items-center"
              title="Удалить все купонные выплаты"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Удалить все
            </button>
          )}
        </div>
      </div>

      {showInstructions && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-md font-semibold text-blue-800 flex items-center mb-2">
              <Info className="w-4 h-4 mr-2" /> Что такое купоны?
            </h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>
          <p className="text-sm text-blue-800 mb-2">
            Купоны — это периодические выплаты владельцам облигаций. Основные
            характеристики:
          </p>
          <ul className="text-sm text-blue-800 list-disc pl-5 mb-2">
            <li>Размер купона указывается в рублях за одну облигацию</li>
            <li>
              Периодичность выплат зависит от эмитента (ежемесячные,
              квартальные, полугодовые, годовые)
            </li>
            <li>
              Даты выплат фиксированные и указаны в проспекте эмиссии облигации
            </li>
          </ul>
          <p className="text-sm text-blue-800">
            Для создания графика купонов используйте кнопку "Создать график",
            указав периодичность и размер купона.
          </p>
        </div>
      )}

      {isAddingBatch && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-md font-semibold mb-4">
            Добавление серии купонов
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Периодичность выплат
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full p-2 border rounded"
              >
                <option value="monthly">Ежемесячно</option>
                <option value="quarterly">Ежеквартально</option>
                <option value="semi-annual">Раз в полгода</option>
                <option value="annual">Ежегодно</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Размер купона (₽)
              </label>
              <input
                type="number"
                value={couponAmount}
                onChange={(e) =>
                  setCouponAmount(parseFloat(e.target.value) || 0)
                }
                step="0.01"
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Начальный месяц
              </label>
              <input
                type="number"
                value={startMonth}
                onChange={(e) => setStartMonth(parseInt(e.target.value) || 1)}
                min="1"
                max="12"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Начальный год
              </label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value) || 2024)}
                min="2024"
                max="2050"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Количество выплат
              </label>
              <input
                type="number"
                value={numberOfPayments}
                onChange={(e) =>
                  setNumberOfPayments(parseInt(e.target.value) || 1)
                }
                min="1"
                max="60"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleBatchAdd}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Добавить выплаты
            </button>
            <button
              onClick={() => setIsAddingBatch(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Месяц
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Год
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма купона (₽)
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {couponSchedule.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  Нет запланированных выплат купонов. Используйте кнопку
                  "Создать график" для добавления серии выплат.
                </td>
              </tr>
            ) : (
              couponSchedule.map((coupon, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={coupon.month}
                      onChange={(e) =>
                        onCouponScheduleChange(
                          index,
                          "month",
                          parseInt(e.target.value),
                        )
                      }
                      min="1"
                      max="12"
                      className="w-16 p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={coupon.year}
                      onChange={(e) =>
                        onCouponScheduleChange(
                          index,
                          "year",
                          parseInt(e.target.value),
                        )
                      }
                      min="2024"
                      max="2050"
                      className="w-24 p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      value={coupon.amount}
                      onChange={(e) =>
                        onCouponScheduleChange(
                          index,
                          "amount",
                          parseFloat(e.target.value),
                        )
                      }
                      step="0.01"
                      min="0"
                      className="w-24 p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => onRemoveCouponPayment(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                      aria-label="Удалить выплату"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponScheduleTab;
