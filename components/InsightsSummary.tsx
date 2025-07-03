import styles from "../styles/InsightsSummary.module.css";

interface InsightProps {
  symbol: string;
  change: number;
  percentChange: number;
}

interface InsightAnalysis {
  impact: string;
  confidence: string;
  reason: string;
}

function analyze(percentChange: number): InsightAnalysis {
  if (percentChange > 5) {
    return { impact: "Strong Positive", confidence: "High", reason: "Uptrend with strong momentum" };
  }
  if (percentChange > 2) {
    return { impact: "Positive", confidence: "Medium", reason: "Moderate gains observed" };
  }
  if (percentChange > -2) {
    return { impact: "Neutral", confidence: "Low", reason: "Minor movement, stable market" };
  }
  if (percentChange > -5) {
    return { impact: "Negative", confidence: "Medium", reason: "Slight decline noticed" };
  }
  return { impact: "Strong Negative", confidence: "High", reason: "Sharp fall detected" };
}

export default function InsightsSummary({ data }: { data: InsightProps[] }) {
  if (!data || data.length === 0) return null;

  const totalChange = data.reduce((sum, s) => sum + s.percentChange, 0);
  const avgChange = totalChange / data.length;
  const top = [...data].sort((a, b) => b.percentChange - a.percentChange)[0];
  const worst = [...data].sort((a, b) => a.percentChange - b.percentChange)[0];

  const topAnalysis = analyze(top.percentChange);
  const worstAnalysis = analyze(worst.percentChange);
  const avgAnalysis = analyze(avgChange);

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>Portfolio Insights</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Top Gainer</h3>
          <p className={styles.positive}>{top.symbol} +{top.percentChange.toFixed(2)}%</p>
          <div className={styles.inlineBadges}>
            <span className={styles.badge}>{topAnalysis.impact}</span>
            <span className={styles.badge}>Confidence: {topAnalysis.confidence}</span>
          </div>
          <p className={styles.reason}>{topAnalysis.reason}</p>
        </div>

        <div className={styles.card}>
          <h3>Worst Performer</h3>
          <p className={styles.negative}>{worst.symbol} {worst.percentChange.toFixed(2)}%</p>
          <div className={styles.inlineBadges}>
            <span className={styles.badge}>{worstAnalysis.impact}</span>
            <span className={styles.badge}>Confidence: {worstAnalysis.confidence}</span>
          </div>
          <p className={styles.reason}>{worstAnalysis.reason}</p>
        </div>

        <div className={styles.card}>
          <h3>Average Change</h3>
          <p className={avgChange >= 0 ? styles.positive : styles.negative}>
            {avgChange >= 0 ? "+" : ""}{avgChange.toFixed(2)}%
          </p>
          <div className={styles.inlineBadges}>
            <span className={styles.badge}>{avgAnalysis.impact}</span>
            <span className={styles.badge}>Confidence: {avgAnalysis.confidence}</span>
          </div>
          <p className={styles.reason}>{avgAnalysis.reason}</p>
        </div>
      </div>

      <h3 className={styles.tableTitle}>Breakdown by Stock</h3>
      <table className={styles.insightTable}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>% Change</th>
            <th>Impact</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => {
            const analysis = analyze(s.percentChange);
            return (
              <tr key={s.symbol}>
                <td>{s.symbol}</td>
                <td className={s.percentChange >= 0 ? styles.positive : styles.negative}>
                  {s.percentChange >= 0 ? "+" : ""}
                  {s.percentChange.toFixed(2)}%
                </td>
                <td>{analysis.impact}</td>
                <td>{analysis.confidence}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}