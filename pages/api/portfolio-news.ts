import type { NextApiRequest, NextApiResponse } from "next";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbols } = req.query;

  if (!symbols || typeof symbols !== "string") {
    return res.status(400).json({ error: "Missing symbols" });
  }

  const symbolList = symbols
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 10);

  const allNews: any[] = [];

  try {
    for (const sym of symbolList) {
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(sym)}&country=in&language=en&category=business`
      );
      const data = await response.json();

      if (Array.isArray(data.results)) {
        allNews.push(...data.results.slice(0, 3));
      } else {
        console.warn(`No valid results for ${sym}:`, data);
      }
    }

    res.status(200).json(allNews);
  } catch (error) {
    console.error("Error fetching portfolio news:", error);
    res.status(500).json({ error: "Failed to fetch portfolio news" });
  }
}