import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface NewsItem {
  title: string;
  description: string;
  link: string;
  source_id: string;
  pubDate: string;
}

interface NewsContextType {
  news: NewsItem[] | null;
  loading: boolean;
  error: string | null;
}

const NewsContext = createContext<NewsContextType>({
  news: null,
  loading: false,
  error: null,
});

export const useNews = () => useContext(NewsContext);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (news !== null) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news");
        const data = await res.json();

        setNews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("NewsContext fetch failed:", err);
        setError("Failed to fetch news.");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [news]);

  return (
    <NewsContext.Provider value={{ news, loading, error }}>
      {children}
    </NewsContext.Provider>
  );
}