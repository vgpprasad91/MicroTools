"use client";

import { useTheme } from '../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={`${styles.toggleTrack} ${theme === 'dark' ? styles.dark : ''}`}>
        <div className={styles.toggleThumb}>
          <span className={styles.icon}>
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
    </button>
  );
}