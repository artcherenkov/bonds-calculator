// src/App.tsx
import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BondCalculator from "./components/BondCalculator";
import PortfolioList from "./components/PortfolioList";
import { usePortfolios } from "./hooks/usePortfolios";

const App: React.FC = () => {
  const {
    portfolios,
    currentPortfolio,
    currentPortfolioId,
    setCurrentPortfolioId,
    updatePortfolio,
    createPortfolio,
    deletePortfolio,
  } = usePortfolios();

  return (
    <Router basename="/">
      <Routes>
        <Route
          path="/"
          element={
            <PortfolioList
              portfolios={portfolios}
              currentPortfolioId={currentPortfolioId}
              onSelect={setCurrentPortfolioId}
              onDelete={deletePortfolio}
              onCreate={createPortfolio}
            />
          }
        />
        <Route
          path="/portfolio/:portfolioId"
          element={
            <BondCalculator
              portfolio={currentPortfolio}
              onPortfolioUpdate={updatePortfolio}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
