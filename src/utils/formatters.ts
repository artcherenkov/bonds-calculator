// utils/formatters.ts - Утилиты форматирования
export const formatNumber = (number: number, decimals = 2): string => {
    return new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number);
};
