import Head from "next/head";
import Navbar from "@/components/Navbar";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { useEffect, useState } from "react";
import InsightsSummary from "@/components/InsightsSummary";
import styles from "@/styles/InsightsSummary.module.css";
import AlertBanner from "@/components/AlertBanner";

interface InsightProps {
  symbol: string;
  change: number;
  percentChange: number;
}

export default function InsightsPage() {
  const { portfolio } = usePortfolio();
  const { data: stockData, loading, error } = usePortfolioData();
  const [insightData, setInsightData] = useState<InsightProps[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("📊 Raw stockData in insights:", stockData);
    const cleaned: InsightProps[] = stockData
      .filter((s) => !isNaN(parseFloat(s.change)) && !isNaN(parseFloat(s.percent_change)))
      .map((s) => ({
        symbol: s.symbol,
        change: parseFloat(s.change),
        percentChange: parseFloat(s.percent_change),
      }));
    console.log("🧠 Cleaned insightData:", cleaned);

    setInsightData(cleaned);

    if (cleaned.length > 0) {
      const extreme = cleaned.find((s) => Math.abs(s.percentChange) > 10);
      const avg = cleaned.reduce((sum, s) => sum + s.percentChange, 0) / cleaned.length;

      if (extreme) {
        setAlertMessage(`🚨 ${extreme.symbol} had an extreme change of ${extreme.percentChange.toFixed(1)}%!`);
      } else if (Math.abs(avg) > 5) {
        setAlertMessage(`⚠️ Portfolio average movement is significant: ${avg.toFixed(2)}%.`);
      } else {
        setAlertMessage(null);
      }
    }
  }, [stockData]);

  return (
    <>
      <Head><title>Envest – Insights</title></Head>
      <Navbar />
      <main style={{ padding: "32px" }}>
        {portfolio.length === 0 ? (
          <div className={styles.container}>
            <h2 className={styles.heading}>Portfolio Insights</h2>
            <div className={styles.card}>
              <p className={styles.emptyMessage}>
                📉 No insights available.<br />Link your portfolio to get AI-based analysis.
              </p>
            </div>
          </div>
        ) : loading ? (
          <p className={styles.emptyMessage}>Loading insights...</p>
        ) : error ? (
          <div className={styles.container}>
            <h2 className={styles.heading}>Portfolio Insights</h2>
            <div className={styles.card}>
              <p className={styles.emptyMessage}>{error}</p>
            </div>
          </div>
                ) : stockData.length === 0 ? (
                  <div className={styles.container}>
                    <h2 className={styles.heading}>Portfolio Insights</h2>
                    <div className={styles.card}>
                      <p className={styles.emptyMessage}>
                        ⚠️ Stock data not available for the selected portfolio.<br />
                        Some symbols might be invalid or temporarily unavailable.
                      </p>
                    </div>
                  </div>
                ) : insightData.length === 0 ? (
                  <div className={styles.container}>
                    <h2 className={styles.heading}>Portfolio Insights</h2>
                    <div className={styles.card}>
                      <p className={styles.emptyMessage}>
                        No insights available for your current portfolio.<br />
                        Try different stock symbols or wait a few moments.
                      </p>
                    </div>
                  </div>
                ) : (
        
          <>
            {alertMessage && <AlertBanner message={alertMessage} />}
            <InsightsSummary data={insightData} />
          </>
        )}
      </main>
    </>
  );
}