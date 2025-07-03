import styles from "../styles/NewsSection.module.css";
import { useNews } from "@/contexts/NewsContext";

export default function NewsSection() {
  const { news, loading, error } = useNews();
  const safeNews = news ?? [];

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Latest Stock News</h2>

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : loading ? (
        <p className={styles.loading}>Loading news...</p>
      ) : safeNews.length === 0 ? (
        <p className={styles.error}>No news available at the moment.</p>
      ) : (
        <div className={styles.newsGrid}>
          {safeNews.slice(0, 6).map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <h3>{article.title}</h3>
              <p>
                {(article.description || "No description available.").slice(0, 120)}...
              </p>
              <span>
                {new Date(article.pubDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}