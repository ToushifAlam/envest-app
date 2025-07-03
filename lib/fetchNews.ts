const NEWS_API_URL = `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&country=in&category=business`;

export async function fetchNews() {
  try {
    const res = await fetch(NEWS_API_URL);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Failed to fetch news:", err);
    return [];
  }
}