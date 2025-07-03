import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PortfolioContextType {
  portfolio: string[];
  setPortfolio: React.Dispatch<React.SetStateAction<string[]>>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [portfolio, setPortfolio] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio");
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch {
        console.warn("Failed to parse saved portfolio.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  return (
    <PortfolioContext.Provider value={{ portfolio, setPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return context;
};