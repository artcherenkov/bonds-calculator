// src/hooks/usePortfolios.ts - Fix the hook to handle URL parameters properly
import { useState, useEffect } from "react";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import { DEFAULT_PORTFOLIO, Portfolio } from "../utils/portfolioManager";

export const usePortfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() =>
    loadFromLocalStorage<Portfolio[]>("bondCalculator_portfolios", [
      DEFAULT_PORTFOLIO,
    ]),
  );

  const [currentPortfolioId, setCurrentPortfolioId] = useState<string>(() =>
    loadFromLocalStorage<string>(
      "bondCalculator_currentPortfolio",
      DEFAULT_PORTFOLIO.id,
    ),
  );

  // Ensure we have at least one portfolio
  useEffect(() => {
    if (portfolios.length === 0) {
      setPortfolios([DEFAULT_PORTFOLIO]);
      setCurrentPortfolioId(DEFAULT_PORTFOLIO.id);
    }
  }, [portfolios.length]);

  // Save portfolios to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage("bondCalculator_portfolios", portfolios);
  }, [portfolios]);

  // Save currentPortfolioId to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage("bondCalculator_currentPortfolio", currentPortfolioId);
  }, [currentPortfolioId]);

  // Get the current portfolio object based on the ID
  const currentPortfolio =
    portfolios.find((p) => p.id === currentPortfolioId) || portfolios[0];

  const updatePortfolio = (updatedPortfolio: Portfolio) => {
    setPortfolios((prev) =>
      prev.map((p) =>
        p.id === updatedPortfolio.id
          ? { ...updatedPortfolio, lastModified: Date.now() }
          : p,
      ),
    );
  };

  const createPortfolio = (name: string = "Новый портфель") => {
    const newPortfolio: Portfolio = {
      ...DEFAULT_PORTFOLIO,
      id: `portfolio_${Date.now()}`,
      name,
      lastModified: Date.now(),
    };

    setPortfolios((prev) => [...prev, newPortfolio]);
    setCurrentPortfolioId(newPortfolio.id);
    return newPortfolio;
  };

  const deletePortfolio = (id: string) => {
    setPortfolios((prev) => {
      const filtered = prev.filter((p) => p.id !== id);

      // If we're deleting the current portfolio, switch to another one
      if (id === currentPortfolioId && filtered.length > 0) {
        setCurrentPortfolioId(filtered[0].id);
      }

      return filtered;
    });
  };

  return {
    portfolios,
    currentPortfolio,
    currentPortfolioId,
    setCurrentPortfolioId,
    updatePortfolio,
    createPortfolio,
    deletePortfolio,
  };
};
