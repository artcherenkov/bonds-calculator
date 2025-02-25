// components/Navigation.tsx - Компонент навигации
import {
  Settings,
  Calculator,
  Calendar,
  PieChart,
} from "lucide-react";
import { TabType } from "../types";

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="flex mb-6 border-b">
      <button
        className={`px-4 py-2 ${activeTab === "parameters" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
        onClick={() => onChangeTab("parameters")}
      >
        <Settings className="inline mr-1 w-4 h-4" /> Параметры
      </button>
      <button
        className={`px-4 py-2 ${activeTab === "couponSchedule" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
        onClick={() => onChangeTab("couponSchedule")}
      >
        <Calendar className="inline mr-1 w-4 h-4" /> График купонов
      </button>
      <button
        className={`px-4 py-2 ${activeTab === "results" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
        onClick={() => onChangeTab("results")}
      >
        <Calculator className="inline mr-1 w-4 h-4" /> Результаты
      </button>
      <button
        className={`px-4 py-2 ${activeTab === "charts" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
        onClick={() => onChangeTab("charts")}
      >
        <PieChart className="inline mr-1 w-4 h-4" /> Графики
      </button>
      <button
        className={`px-4 py-2 ${activeTab === "monthly" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
        onClick={() => onChangeTab("monthly")}
      >
        <Calendar className="inline mr-1 w-4 h-4" /> Помесячные данные
      </button>
    </div>
  );
};

export default Navigation;
