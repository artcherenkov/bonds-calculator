// src/components/PortfolioList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Portfolio } from "../utils/portfolioManager";
import { AlertTriangle, Database, Folder, Plus, Trash2 } from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface PortfolioListProps {
  portfolios: Portfolio[];
  currentPortfolioId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (name: string) => Portfolio;
}

const PortfolioList: React.FC<PortfolioListProps> = ({
  portfolios,
  currentPortfolioId,
  onSelect,
  onDelete,
  onCreate,
}) => {
  const navigate = useNavigate();
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showStorageWarning, setShowStorageWarning] = useState(true);

  const handleSelect = (id: string) => {
    onSelect(id);
    navigate(`/portfolio/${id}`);
  };

  const handleCreate = () => {
    if (newPortfolioName.trim()) {
      const newPortfolio = onCreate(newPortfolioName.trim());
      setNewPortfolioName("");
      setIsCreating(false);
      navigate(`/portfolio/${newPortfolio.id}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {showStorageWarning && (
          <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-yellow-800">
                  Важное уведомление о хранении данных
                </h3>
                <div className="mt-2 text-yellow-700">
                  <p>
                    Все данные о ваших портфелях облигаций хранятся{" "}
                    <strong>только в браузере</strong> на вашем устройстве и{" "}
                    <strong>не отправляются</strong> на сервер.
                  </p>
                  <p className="mt-2">Это означает:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>
                      При очистке данных браузера ваши портфели будут удалены
                    </li>
                    <li>
                      Данные не синхронизируются между разными устройствами и
                      браузерами
                    </li>
                    <li>
                      Для сохранения важных расчетов рекомендуется делать
                      скриншоты результатов
                    </li>
                  </ul>
                  <div className="flex items-center mt-3 text-sm">
                    <Database className="w-4 h-4 mr-1" />
                    <span>Данные хранятся в localStorage вашего браузера</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowStorageWarning(false)}
                className="flex-shrink-0 ml-2 text-yellow-500 hover:text-yellow-700"
                aria-label="Закрыть предупреждение"
              >
                &times;
              </button>
            </div>
          </div>
        )}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              <Folder className="inline mr-2" /> Мои портфели облигаций
            </h1>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Создать новый
            </button>
          </div>

          {isCreating && (
            <div className="mb-6 p-4 border rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Новый портфель</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  placeholder="Название портфеля"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                />
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Создать
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className={`p-4 border rounded-lg ${
                  portfolio.id === currentPortfolioId
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">{portfolio.name}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelect(portfolio.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Открыть
                    </button>
                    {portfolios.length > 1 && (
                      <button
                        onClick={() => onDelete(portfolio.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Удалить портфель"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">
                      Начальная инвестиция
                    </p>
                    <p className="font-semibold">
                      {formatNumber(portfolio.bondParams.initialInvestment)} ₽
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Цена облигации</p>
                    <p className="font-semibold">
                      {formatNumber(portfolio.bondParams.bondPrice)} ₽
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Купон</p>
                    <p className="font-semibold">
                      {formatNumber(portfolio.bondParams.couponAmount)} ₽
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Последнее изменение:{" "}
                  {new Date(portfolio.lastModified).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioList;
