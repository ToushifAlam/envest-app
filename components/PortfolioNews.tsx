import { usePortfolioNews } from "@/contexts/PortfolioNewsContext";
import styles from "../styles/PortfolioNews.module.css";
import style2 from "../styles/InsightsSummary.module.css"

export default function PortfolioNews() {
  const { news, loading, error } = usePortfolioNews();

  if (loading) return <p className={styles.loading}>Loading news...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (news.length === 0) {
    return (
      <>
        <h2 className={styles.heading}>News Related to your Portfolio</h2>
        <p className={style2.emptyMessage}>No news available</p>
      </>
    )
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>News Related to Your Portfolio</h2>
      <div className={styles.grid}>
        {news.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h3>{article.title}</h3>
            <p>{article.description?.slice(0, 100) || "No description"}</p>
            <span className={styles.date}>
              {article.pubDate &&
                new Date(article.pubDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}