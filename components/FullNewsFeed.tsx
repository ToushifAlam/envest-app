import styles from "../styles/FullNewsFeed.module.css";
import { useNews } from "@/contexts/NewsContext";

export default function FullNewsFeed() {
  const { news, loading, error } = useNews();
  const safeNews = news ?? [];

  return (
    <section>
      <h2 className={styles.heading}>All Stock Market News</h2>

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : loading ? (
        <p className={styles.loading}>Loading more news...</p>
      ) : safeNews.length === 0 ? (
        <p className={styles.error}>No news available at the moment.</p>
      ) : (
        <div className={styles.grid}>
          {safeNews.slice(0, 40).map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <h3>{article.title}</h3>
              <p>
                {(article.description || "No description available").slice(0, 150)}...
              </p>
              <span>
                {article.pubDate
                  ? new Date(article.pubDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date unavailable"}
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}