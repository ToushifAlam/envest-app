import Head from "next/head";
import Navbar from "../components/Navbar";
import NewsSection from "@/components/NewsSection";
import { useEffect, useState } from "react";

interface NewsArticle {
  title: string;
  link: string;
  description: string | null;
  pubDate: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/news");
        const data = await res.json();

        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.warn("Invalid response:", data);
          setError("Failed to load news.");
        }
      } catch (err) {
        console.error("News fetch failed:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <>
      <Head>
        <title>Envest – Smart News & Portfolio</title>
      </Head>
      <Navbar />
      <main style={{ padding: "32px" }}>
        <h1 style={{ color: "white" }}>Welcome to Envest</h1>
        <NewsSection />
      </main>
    </>
  );
}