import { useState } from "react";
import styles from "../styles/PortfolioInput.module.css";
import { usePortfolio } from "@/contexts/PortfolioContext";

export default function PortfolioInput() {
  const [symbols, setSymbols] = useState("");
  const { portfolio, setPortfolio } = usePortfolio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSymbols = symbols
      .toUpperCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !portfolio.includes(s));
    if (newSymbols.length > 0) {
      setPortfolio([...portfolio, ...newSymbols]);
      setSymbols("");
    }
  };

  const removeSymbol = (symbol: string) => {
    setPortfolio((prev) => prev.filter((s) => s !== symbol));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Link Your Portfolio</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="symbols">Enter stock symbols (comma-separated):</label>
        <input
          id="symbols"
          type="text"
          className={styles.input}
          placeholder="e.g., TCS, AAPL, GOOGL, MSFT, AMZN, META"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          Save Portfolio
        </button>
      </form>

      {portfolio.length > 0 && (
        <div className={styles.results}>
          <h3>Your Portfolio:</h3>
          <div className={styles.capsuleWrapper}>
            {portfolio.map((sym, i) => (
              <div key={i} className={styles.capsule}>
                <span className={styles.cross} onClick={() => removeSymbol(sym)}>
                  ×
                </span>
                {sym}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}