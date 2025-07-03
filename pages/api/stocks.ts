import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.TWELVE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbols } = req.query;

  if (!symbols || typeof symbols !== "string") {
    return res.status(400).json({ error: "Missing or invalid symbols parameter." });
  }

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: "External API request failed." });
    }

    const data = await response.json();

    // Handle rate limit error gracefully
    if (data.status === "error" && data.message?.includes("API credits")) {
      return res.status(429).json({ error: "Rate limit exceeded. Please wait a minute." });
    }

    if (!data || data.status === "error" || data.code) {
      return res.status(500).json({ error: data.message || "Invalid stock data" });
    }

    const normalized = Array.isArray(data)
      ? data
      : typeof data === "object"
      ? Object.values(data)
      : [];

    const cleaned = normalized
      .filter((s: any) => s && s.symbol && s.close)
      .map((s: any) => ({
        symbol: s.symbol,
        price: s.close,
        change: s.change,
        percent_change: s.percent_change,
        currency: s.currency,
      }));

    return res.status(200).json(cleaned);
  } catch (error) {
    console.error("API Fetch Error:", error);
    return res.status(500).json({ error: "Server error while fetching stock data." });
  }
}