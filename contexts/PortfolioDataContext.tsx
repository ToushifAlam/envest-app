import { createContext, useContext, useEffect, useState, useRef } from "react";
import { usePortfolio } from "./PortfolioContext";

interface StockData {
  symbol: string;
  price: string;
  change: string;
  percent_change: string;
  currency: string;
}

interface PortfolioDataContextType {
  data: StockData[];
  loading: boolean;
  error: string | null;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { portfolio } = usePortfolio();
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedRef = useRef<string>("");

  const currentKey = portfolio.join(",");

  useEffect(() => {
    if (!portfolio.length || lastFetchedRef.current === currentKey) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/stocks?symbols=${currentKey}`, {
          cache: "no-store",
        });

        let raw: any;
        try {
          raw = await res.json();
        } catch (jsonError) {
          const text = await res.text();
          console.error("Invalid JSON:", jsonError, "Response Text:", text);
          setError("Invalid JSON received from server.");
          setData([]);
          return;
        }

        if (!res.ok || !raw) {
          console.warn("Bad response from server:", res.status, raw);
          setError(raw?.error || "Failed to load stock data.");
          setData([]);
          return;
        }

        const rawArray = Array.isArray(raw) ? raw : Object.values(raw);
        const valid = rawArray.filter(
          (s: any) =>
            s &&
            s.symbol &&
            s.price !== undefined &&
            !isNaN(Number(s.price)) &&
            !isNaN(Number(s.change)) &&
            !isNaN(Number(s.percent_change))
        );

        if (valid.length === 0) {
          console.warn("No valid stock data found.");
          setError("No valid stock data found for your portfolio.");
          setData([]);
          return;
        }

        setData(valid);
        lastFetchedRef.current = currentKey;
        console.log("✅ PortfolioData fetched for:", currentKey, valid);
      } catch (err) {
        console.error("❌ Portfolio fetch error:", err);
        setError("Unable to fetch portfolio data.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentKey]);

  return (
    <PortfolioDataContext.Provider value={{ data, loading, error }}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error("usePortfolioData must be used inside PortfolioDataProvider");
  return ctx;
};