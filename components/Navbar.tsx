import Link from "next/link";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Envest</Link>
      </div>
      <ul className={styles.links}>
        <li><Link href="/news">News</Link></li>
        <li><Link href="/portfolio">Portfolio</Link></li>
        <li><Link href="/insights">Insights</Link></li>
      </ul>
    </nav>
  );
}