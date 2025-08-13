import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthHeader from "./components/AuthHeader";
import ConditionalFooter from "./components/ConditionalFooter";

export const metadata: Metadata = {
  title: "ClientForce - 268+ Business Tools for Indian SMEs",
  description: "GST invoices, tax calculators, compliance tools, and more. Trusted by 50,000+ Indian businesses. All tools in one place."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              document.documentElement.setAttribute('data-theme', 'light');
            })();
          `
        }} />
        <ThemeProvider>
          <AuthHeader />
          
          <main className={styles.main}>
            {children}
          </main>
          
          <ConditionalFooter />
          
          <script 
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                }
              `
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}