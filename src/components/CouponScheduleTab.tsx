// components/CouponScheduleTab.tsx - Вкладка с расписанием купонов
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { CouponSchedule } from "../types";

interface CouponScheduleTabProps {
  couponSchedule: CouponSchedule[];
  onCouponScheduleChange: (
    index: number,
    field: keyof CouponSchedule,
    value: number,
  ) => void;
  onAddCouponPayment: () => void;
  onRemoveCouponPayment: (index: number) => void;
}

const CouponScheduleTab: React.FC<CouponScheduleTabProps> = ({
  couponSchedule,
  onCouponScheduleChange,
  onAddCouponPayment,
  onRemoveCouponPayment,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          График выплаты купонов
        </h2>
        <button
          onClick={onAddCouponPayment}
          className="px-3 py-1 bg-blue-500 text-white rounded flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Добавить выплату
        </button>
      </div>

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
            {couponSchedule.map((coupon, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponScheduleTab;
