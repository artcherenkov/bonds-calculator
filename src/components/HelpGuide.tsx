// components/HelpGuide.tsx - Компонент справки с примером расчета
import React, { useState } from "react";
import { HelpCircle, BookOpen, Calculator, ArrowRight } from "lucide-react";

const HelpGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <BookOpen className="mr-2" /> Как работает калькулятор облигаций
        </h2>
        <HelpCircle className="text-blue-500" size={24} />
      </div>

      <div className="prose max-w-none">
        <p className="text-gray-700 mb-4">
          Давайте разберем на простом примере, как происходит расчет инвестиций
          в облигации. Представьте, что мы учимся считать деньги в копилке,
          только наша копилка особенная - она регулярно дает нам немного денег
          (купоны), а мы решаем, что с ними делать.
        </p>

        {/* Раздел с исходными данными */}
        <div className="mb-4 border-l-4 border-blue-500 pl-4">
          <h3
            className="font-bold text-lg text-blue-700 cursor-pointer flex items-center"
            onClick={() => toggleSection("initialData")}
          >
            Исходные данные для нашего примера
            {expandedSection === "initialData" ? (
              <span className="ml-2">▼</span>
            ) : (
              <span className="ml-2">▶</span>
            )}
          </h3>

          {expandedSection === "initialData" && (
            <div className="mt-2">
              <p>Предположим, у нас есть:</p>
              <ul className="list-disc pl-6 mb-3">
                <li>
                  Начальная сумма: <strong>100 000 рублей</strong>
                </li>
                <li>
                  Ежемесячное пополнение: <strong>5 000 рублей</strong>
                </li>
                <li>
                  Номинальная стоимость одной облигации:{" "}
                  <strong>1 000 рублей</strong>
                </li>
                <li>
                  Текущая рыночная цена облигации: <strong>1 020 рублей</strong>
                </li>
                <li>
                  Размер ежемесячного купона: <strong>20 рублей</strong> с одной
                  облигации
                </li>
                <li>
                  Комиссия брокера: <strong>0.3%</strong> от суммы сделки
                </li>
                <li>
                  Налог на купонный доход: <strong>13%</strong>
                </li>
                <li>
                  Срок инвестирования: <strong>12 месяцев</strong>
                </li>
              </ul>
              <p className="text-gray-600 italic">
                Это простой пример. В реальности ваши значения могут отличаться,
                но принцип расчета останется тем же.
              </p>
            </div>
          )}
        </div>

        {/* Шаг 1: Первоначальная покупка */}
        <div className="mb-4 border-l-4 border-green-500 pl-4">
          <h3
            className="font-bold text-lg text-green-700 cursor-pointer flex items-center"
            onClick={() => toggleSection("step1")}
          >
            Шаг 1: Первая покупка облигаций
            {expandedSection === "step1" ? (
              <span className="ml-2">▼</span>
            ) : (
              <span className="ml-2">▶</span>
            )}
          </h3>

          {expandedSection === "step1" && (
            <div className="mt-2">
              <p>
                Итак, мы пришли к брокеру со 100 000 рублей. Что происходит
                дальше?
              </p>

              <div className="bg-gray-50 p-3 rounded mt-2 mb-3">
                <p>
                  <strong>1. Рассчитываем комиссию брокера:</strong>
                </p>
                <p className="pl-4">
                  Мы знаем, что брокер возьмет 0.3% от суммы покупки. Но тут
                  есть хитрость!
                </p>
                <p className="pl-4">
                  Если мы хотим потратить <em>все</em> наши 100 000 рублей, то
                  сумма покупки должна быть такой, чтобы с учетом комиссии
                  получилось ровно 100 000.
                </p>
                <p className="pl-4">
                  Формула: 100 000 = Сумма покупки + Комиссия = Сумма покупки +
                  (Сумма покупки × 0.3%)
                </p>
                <p className="pl-4">
                  Отсюда: 100 000 = Сумма покупки × (1 + 0.003)
                </p>
                <p className="pl-4">
                  Сумма покупки = 100 000 ÷ 1.003 = <strong>99 700.90</strong>{" "}
                  рублей
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p>
                  <strong>2. Сколько облигаций можем купить?</strong>
                </p>
                <p className="pl-4">
                  Каждая облигация стоит 1 020 рублей. Сколько целых облигаций
                  мы можем купить?
                </p>
                <p className="pl-4">
                  Количество облигаций = 99 700.90 ÷ 1 020 = 97.75{" "}
                  <ArrowRight className="inline" size={16} />{" "}
                  <strong>97 штук</strong>
                </p>
                <p className="pl-4">
                  Мы не можем купить 97.75 облигаций - только целое число.
                  Поэтому округляем вниз до 97.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p>
                  <strong>3. Считаем фактические затраты:</strong>
                </p>
                <p className="pl-4">
                  Фактическая сумма покупки = 97 × 1 020 ={" "}
                  <strong>98 940</strong> рублей
                </p>
                <p className="pl-4">
                  Комиссия брокера = 98 940 × 0.3% = <strong>296.82</strong>{" "}
                  рублей
                </p>
                <p className="pl-4">
                  Общие затраты = 98 940 + 296.82 = <strong>99 236.82</strong>{" "}
                  рублей
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p>
                  <strong>4. Остаток денежных средств:</strong>
                </p>
                <p className="pl-4">
                  Остаток = 100 000 - 99 236.82 = <strong>763.18</strong> рублей
                </p>
                <p className="pl-4">
                  Эти деньги остаются на нашем счету и будут использованы в
                  следующем месяце.
                </p>
              </div>

              <p className="mt-2">
                <strong>Итоги первого шага:</strong>
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Купили <strong>97 облигаций</strong>
                </li>
                <li>
                  Потратили <strong>99 236.82 рублей</strong>
                </li>
                <li>
                  Остаток на счете: <strong>763.18 рублей</strong>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Шаг 2: Первый месяц */}
        <div className="mb-4 border-l-4 border-yellow-500 pl-4">
          <h3
            className="font-bold text-lg text-yellow-700 cursor-pointer flex items-center"
            onClick={() => toggleSection("step2")}
          >
            Шаг 2: Первый месяц - получаем купон
            {expandedSection === "step2" ? (
              <span className="ml-2">▼</span>
            ) : (
              <span className="ml-2">▶</span>
            )}
          </h3>

          {expandedSection === "step2" && (
            <div className="mt-2">
              <p>
                Прошел месяц, и наши облигации принесли купонный доход. Также мы
                сделали плановое пополнение.
              </p>

              <div className="bg-gray-50 p-3 rounded mt-2 mb-3">
                <p>
                  <strong>1. Рассчитываем купонный доход:</strong>
                </p>
                <p className="pl-4">
                  У нас 97 облигаций, каждая приносит 20 рублей купона в месяц.
                </p>
                <p className="pl-4">
                  Валовый купонный доход = 97 × 20 = <strong>1 940</strong>{" "}
                  рублей
                </p>
                <p className="pl-4">
                  Но с этой суммы нужно заплатить налог 13%:
                </p>
                <p className="pl-4">
                  Налог = 1 940 × 13% = <strong>252.20</strong> рублей
                </p>
                <p className="pl-4">
                  Чистый купонный доход = 1 940 - 252.20 ={" "}
                  <strong>1 687.80</strong> рублей
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p>
                  <strong>2. Считаем доступные средства:</strong>
                </p>
                <p className="pl-4">
                  К остатку прошлого месяца добавляем купон и ежемесячное
                  пополнение:
                </p>
                <p className="pl-4">
                  Доступно = 763.18 + 1 687.80 + 5 000 ={" "}
                  <strong>7 450.98</strong> рублей
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p>
                  <strong>3. Покупаем новые облигации:</strong>
                </p>
                <p className="pl-4">
                  Максимальная сумма для покупки с учетом будущей комиссии:
                </p>
                <p className="pl-4">
                  Максимум для покупки = 7 450.98 ÷ 1.003 ={" "}
                  <strong>7 428.69</strong> рублей
                </p>
                <p className="pl-4">
                  Количество новых облигаций = 7 428.69 ÷ 1 020 = 7.28{" "}
                  <ArrowRight className="inline" size={16} />{" "}
                  <strong>7 штук</strong>
                </p>
                <p className="pl-4">
                  Фактическая сумма покупки = 7 × 1 020 = <strong>7 140</strong>{" "}
                  рублей
                </p>
                <p className="pl-4">
                  Комиссия = 7 140 × 0.3% = <strong>21.42</strong> рублей
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p>
                  <strong>4. Считаем новый остаток:</strong>
                </p>
                <p className="pl-4">
                  Остаток = 7 450.98 - 7 140 - 21.42 = <strong>289.56</strong>{" "}
                  рублей
                </p>
              </div>

              <p className="mt-2">
                <strong>Итоги после первого месяца:</strong>
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Всего облигаций: <strong>97 + 7 = 104 штуки</strong>
                </li>
                <li>
                  Получено купонов (после налогов):{" "}
                  <strong>1 687.80 рублей</strong>
                </li>
                <li>
                  Уплачено налогов: <strong>252.20 рублей</strong>
                </li>
                <li>
                  Уплачено комиссий:{" "}
                  <strong>296.82 + 21.42 = 318.24 рублей</strong>
                </li>
                <li>
                  Остаток на счете: <strong>289.56 рублей</strong>
                </li>
                <li>
                  Рыночная стоимость портфеля: 104 × 1 020 + 289.56 ={" "}
                  <strong>106 369.56 рублей</strong>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Шаг 3: И так далее... */}
        <div className="mb-4 border-l-4 border-purple-500 pl-4">
          <h3
            className="font-bold text-lg text-purple-700 cursor-pointer flex items-center"
            onClick={() => toggleSection("step3")}
          >
            Шаг 3: И так далее каждый месяц...
            {expandedSection === "step3" ? (
              <span className="ml-2">▼</span>
            ) : (
              <span className="ml-2">▶</span>
            )}
          </h3>

          {expandedSection === "step3" && (
            <div className="mt-2">
              <p>Каждый следующий месяц мы повторяем те же самые действия:</p>
              <ul className="list-disc pl-6 mb-3">
                <li>Получаем купонный доход с имеющихся облигаций</li>
                <li>Вычитаем налог</li>
                <li>Добавляем ежемесячное пополнение</li>
                <li>Покупаем новые облигации с учетом комиссии</li>
                <li>Остаток денег переносим на следующий месяц</li>
              </ul>

              <p>
                С каждым месяцем наш портфель растет благодаря трем факторам:
              </p>
              <ol className="list-decimal pl-6 mb-3">
                <li>
                  <strong>Ежемесячное пополнение</strong> – наши новые вложения
                </li>
                <li>
                  <strong>Реинвестирование купонов</strong> – купонный доход не
                  забираем, а снова вкладываем
                </li>
                <li>
                  <strong>Эффект сложного процента</strong> – со временем купоны
                  приносят всё больше, поскольку количество облигаций растет
                </li>
              </ol>

              <div className="bg-yellow-50 p-3 border border-yellow-200 rounded">
                <p className="font-medium">
                  Важное замечание про сложный процент:
                </p>
                <p>
                  Заметьте, что во второй месяц мы получим купонный доход уже со
                  104 облигаций, а не с 97, как в первый месяц. То есть прибыль
                  начинает работать на нас и приносить еще больше прибыли. Это и
                  есть "магия" сложного процента, которая делает долгосрочные
                  инвестиции такими эффективными!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Итоговые результаты */}
        <div className="mb-4 border-l-4 border-red-500 pl-4">
          <h3
            className="font-bold text-lg text-red-700 cursor-pointer flex items-center"
            onClick={() => toggleSection("results")}
          >
            Подводим итоги через 12 месяцев
            {expandedSection === "results" ? (
              <span className="ml-2">▼</span>
            ) : (
              <span className="ml-2">▶</span>
            )}
          </h3>

          {expandedSection === "results" && (
            <div className="mt-2">
              <p>После 12 месяцев инвестирования у нас будет:</p>

              <div className="bg-gray-50 p-4 rounded my-3">
                <p className="mb-2">
                  <strong>Итоговые результаты:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    Всего вложено:{" "}
                    <strong>100 000 + (5 000 × 11) = 155 000 рублей</strong>
                  </li>
                  <li>
                    Количество облигаций: около <strong>175 штук</strong>{" "}
                    (точное число зависит от округлений)
                  </li>
                  <li>
                    Купонный доход (после налогов): около{" "}
                    <strong>25 000 рублей</strong>
                  </li>
                  <li>
                    Рыночная стоимость: около <strong>180 000 рублей</strong>{" "}
                    (при условии, что цена облигации не менялась)
                  </li>
                  <li>
                    Стоимость при погашении по номиналу:{" "}
                    <strong>175 × 1 000 = 175 000 рублей</strong> + остаток
                  </li>
                  <li>
                    Общая прибыль: около <strong>20 000 рублей</strong> (Стоимость при погашении - Общая сумма инвестиций)
                  </li>
                  <li>
                    Доходность: около <strong>12.9%</strong> за год
                  </li>
                </ul>
              </div>

              <p>
                Обратите внимание, что эти расчеты упрощенные и для примера. В
                реальности ваша доходность может отличаться в зависимости от:
              </p>
              <ul className="list-disc pl-6">
                <li>Изменения рыночной цены облигаций</li>
                <li>Разницы между рыночной ценой и номиналом облигации</li>
                <li>Размера и регулярности купонных выплат</li>
                <li>Комиссий вашего конкретного брокера</li>
              </ul>

              <p className="mt-3">
                Наш калькулятор учитывает все эти факторы и показывает детальный
                расчет по каждому месяцу!
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <Calculator
              className="text-blue-500 mr-3 flex-shrink-0 mt-1"
              size={24}
            />
            <div>
              <h3 className="font-bold text-blue-700">Совет:</h3>
              <p>
                Попробуйте поэкспериментировать с разными параметрами в
                калькуляторе, чтобы увидеть, как изменится доходность. Например,
                увеличьте или уменьшите сумму ежемесячного пополнения, измените
                цену или купон облигации. Это поможет вам лучше понять, как
                работают инвестиции в облигации и подобрать оптимальную
                стратегию для своих целей.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpGuide;
