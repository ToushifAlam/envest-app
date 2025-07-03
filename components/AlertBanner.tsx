import styles from "@/styles/AlertBanner.module.css";
import { useState } from "react";
import { Bell } from "lucide-react";

export default function AlertBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <Bell className={styles.icon} />
      <span>{message}</span>
      <button className={styles.close} onClick={() => setVisible(false)}>×</button>
    </div>
  );
}