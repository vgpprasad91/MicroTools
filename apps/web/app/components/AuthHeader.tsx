"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../layout.module.css";

export default function AuthHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  // Don't show header on dashboard or login pages as they have their own headers
  if (pathname === "/dashboard" || pathname === "/login") {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerContent}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🚀</div>
          <div>
            <h1 className={styles.logoText}>ClientForce</h1>
            <p className={styles.tagline}>Empowering your business success</p>
          </div>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/pricing" className={styles.navLink}>Pricing</Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.navLinkPrimary}>Dashboard</Link>
          ) : (
            <Link href="/login" className={styles.navLinkPrimary}>Get Started</Link>
          )}
        </nav>
      </div>
    </header>
  );
}