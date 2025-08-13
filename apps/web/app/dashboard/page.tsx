"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { allIndianTools, categories, getToolsByCategory } from "../tools/toolsData";

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
}

const categoryIcons: Record<string, string> = {
  "Project Management": "📊",
  "Finance & Accounting": "💰",
  "Marketing & Sales": "📈",
  "Design & Creative": "🎨",
  "Writing & Content": "✍️",
  "E-commerce & Retail": "🛒",
  "Manufacturing": "🏭",
  "Travel & Hospitality": "✈️",
  "Real Estate": "🏠",
  "Healthcare & Wellness": "🏥",
  "Education & Training": "🎓",
  "Food & Restaurant": "🍽️",
  "Tech & IT": "💻",
  "Professional Services": "📄",
  "Photography & Media": "📸",
  "Events & Entertainment": "🎉",
  "Fitness & Sports": "💪",
  "Beauty & Personal Care": "💅",
  "Automotive & Transport": "🚗",
  "Agriculture & Farming": "🌾",
  "Non-Profit": "🤝",
  "Music & Audio": "🎵"
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Decode JWT token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        setUser({
          id: payload.userId,
          name: payload.name || payload.email?.split('@')[0] || "User",
          email: payload.email,
          phone: payload.phone,
          subscriptionStatus: "active", // For demo, all users have active status
        });
      } catch (decodeError) {
        console.error("Invalid token format:", decodeError);
        localStorage.removeItem("auth_token");
        router.push("/login");
        return;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", { method: "POST" });
      
      // Clear local storage
      localStorage.removeItem("auth_token");
      
      // Clear cookie
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, clear token and redirect
      localStorage.removeItem("auth_token");
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
      router.push("/");
    }
  };

  // Filter tools based on category and search
  const filteredTools = allIndianTools.filter(tool => {
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.menuButton}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h1 className={styles.logoText}>ClientForce</h1>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.searchBar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.userMenu}>
            <span className={styles.userName}>{user?.name}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ""}`}>
          <nav className={styles.sidebarNav}>
            <div className={styles.categorySection}>
              <h3>Categories</h3>
              
              <button
                className={`${styles.categoryItem} ${selectedCategory === "All" ? styles.active : ""}`}
                onClick={() => setSelectedCategory("All")}
              >
                <span className={styles.categoryIcon}>🎯</span>
                <span className={styles.categoryName}>All Tools</span>
                <span className={styles.categoryCount}>{allIndianTools.length}</span>
              </button>

              {categories.map(category => {
                const toolCount = getToolsByCategory(category).length;
                return (
                  <button
                    key={category}
                    className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className={styles.categoryIcon}>{categoryIcons[category] || "📊"}</span>
                    <span className={styles.categoryName}>{category}</span>
                    <span className={styles.categoryCount}>{toolCount}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.sidebarFooter}>
              <div className={styles.subscriptionInfo}>
                <h4>Pro Plan</h4>
                <p>All tools unlocked</p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h2>
              {selectedCategory === "All" ? "All Tools" : selectedCategory}
              <span className={styles.toolCount}>({filteredTools.length} tools)</span>
            </h2>
          </div>

          {/* Stats Overview */}
          {selectedCategory === "All" && (
            <div className={styles.statsOverview}>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🚀</span>
                <div>
                  <h3>{allIndianTools.length}+</h3>
                  <p>Total Tools</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📊</span>
                <div>
                  <h3>{categories.length}</h3>
                  <p>Categories</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>✨</span>
                <div>
                  <h3>Unlimited</h3>
                  <p>Monthly Usage</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>⚡</span>
                <div>
                  <h3>Priority</h3>
                  <p>Support</p>
                </div>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          <div className={styles.toolsGrid}>
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={tool.href} className={styles.toolCard}>
                <div className={styles.toolHeader}>
                  <span className={styles.toolIcon}>{tool.icon}</span>
                  {tool.isNew && <span className={styles.newBadge}>NEW</span>}
                  {tool.isPopular && <span className={styles.popularBadge}>POPULAR</span>}
                </div>
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDescription}>{tool.desc}</p>
                <p className={styles.toolShortDesc}>{tool.shortDesc}</p>
                <div className={styles.toolFooter}>
                  <span className={styles.toolCategory}>{tool.category}</span>
                  <span className={styles.useNow}>Use Now →</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3>No tools found</h3>
              <p>Try adjusting your search or category filter</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className={styles.resetButton}
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}