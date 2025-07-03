import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePortfolio } from "./PortfolioContext";

interface Article {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
}

interface PortfolioNewsContextType {
  news: Article[];
  loading: boolean;
  error: string | null;
}

const PortfolioNewsContext = createContext<PortfolioNewsContextType | undefined>(undefined);

export const PortfolioNewsProvider = ({ children }: { children: React.ReactNode }) => {
  const { portfolio } = usePortfolio();
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedKey = useRef<string>("");

  const currentKey = portfolio.join(",");

  useEffect(() => {
    if (!portfolio.length || lastFetchedKey.current === currentKey) return;

    const storedNewsKey = sessionStorage.getItem("fetchedNewsKey");
    const storedNews = sessionStorage.getItem("fetchedNewsData");

    if (storedNewsKey === currentKey && storedNews) {
      setNews(JSON.parse(storedNews));
      lastFetchedKey.current = currentKey;
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/portfolio-news?symbols=${currentKey}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setNews(data);
          sessionStorage.setItem("fetchedNewsKey", currentKey);
          sessionStorage.setItem("fetchedNewsData", JSON.stringify(data));
          lastFetchedKey.current = currentKey;
        } else {
          setError("Unexpected news format");
        }
      } catch (err) {
        console.error("Portfolio News Error:", err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentKey]);

  return (
    <PortfolioNewsContext.Provider value={{ news, loading, error }}>
      {children}
    </PortfolioNewsContext.Provider>
  );
};

export const usePortfolioNews = () => {
  const context = useContext(PortfolioNewsContext);
  if (!context) throw new Error("usePortfolioNews must be used inside PortfolioNewsProvider");
  return context;
};