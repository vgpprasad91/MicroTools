"use client";

import { usePathname } from "next/navigation";
import styles from "../layout.module.css";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on dashboard or login pages
  if (pathname === "/dashboard" || pathname === "/login") {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© 2024 ClientForce. Built with ❤️ for Indian businesses.</p>
      </div>
    </footer>
  );
}