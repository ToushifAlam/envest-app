import type { NextApiRequest, NextApiResponse } from "next";

interface NewsArticle {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
}

interface NewsDataResponse {
  status: string;
  results?: any[];
  nextPage?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.NEWS_API_KEY;
  const baseUrl = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&category=business`;

  try {
    let allArticles: NewsArticle[] = [];
    let nextPage: string | null = null;

    for (let i = 0; i < 4; i++) {
      const requestUrl = nextPage ? `${baseUrl}&page=${nextPage}` : baseUrl;

      const response = await fetch(requestUrl);
      const data: NewsDataResponse = await response.json();

      if (data.status === "error") {
        console.error("API error:", data.message);
        return res.status(401).json({ error: data.message || "API error" });
      }

      if (!data.results || !Array.isArray(data.results)) break;

      const filtered = data.results
        .filter((article) => article.title && article.link)
        .map((article) => ({
          title: article.title,
          link: article.link,
          description: article.description || "No description available.",
          pubDate: article.pubDate || new Date().toISOString(),
        }));

      allArticles = allArticles.concat(filtered);
      nextPage = data.nextPage ?? null;

      if (!nextPage) break;
    }

    return res.status(200).json(allArticles);
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}