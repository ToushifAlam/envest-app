import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import styles from "../styles/PortfolioSummary.module.css";
import styles2 from "@/styles/InsightsSummary.module.css";

export default function PortfolioSummary() {
  const { data, loading, error } = usePortfolioData();

  if (data.length === 0 && !loading && !error) {
    return (
      <section className={styles.container}>
        <h2 className={styles.heading}>Live Portfolio Summary</h2>
        <p className={styles2.emptyMessage}>No live data available. Check stock symbols or try again shortly.</p>
      </section>
    );
  }
  
  

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>Live Portfolio Summary</h2>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : loading ? (
        <p className={styles.loading}>Loading stock data...</p>
      ) : (
        <div className={styles.grid}>
          {data.map((stock, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.header}>
                <span className={styles.symbol}>{stock.symbol}</span>
                <span
                  className={
                    parseFloat(stock.change) >= 0 ? styles.green : styles.red
                  }
                >
                  {parseFloat(stock.change) >= 0 ? "+" : ""}
                  {stock.change} ({stock.percent_change}%)
                </span>
              </div>
              <div className={styles.price}>
                {stock.price && !isNaN(Number(stock.price)) ? (
                  stock.currency === "USD" ? (
                    `$${parseFloat(stock.price).toFixed(2)}`
                  ) : (
                    `₹${parseFloat(stock.price).toFixed(2)}`
                  )
                ) : (
                  "Price unavailable"
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}