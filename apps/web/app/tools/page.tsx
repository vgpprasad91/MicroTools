"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { allIndianTools, categories, searchTools, getToolsByCategory, categoryStats } from "./toolsData";

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCategories, setShowCategories] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(`.${styles.toolCard}, .${styles.toolListItem}`);
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}%`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}%`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const filteredTools = useMemo(() => {
    let tools = selectedCategory === "All" ? allIndianTools : getToolsByCategory(selectedCategory);
    
    if (searchTerm) {
      tools = searchTools(searchTerm).filter(tool => 
        selectedCategory === "All" || tool.category === selectedCategory
      );
    }
    
    return tools;
  }, [searchTerm, selectedCategory]);

  const categoryColors: Record<string, string> = {
    "GST & Tax": "#FF6B6B",
    "Banking": "#4ECDC4",
    "Compliance": "#45B7D1",
    "Payroll": "#96CEB4",
    "Business Docs": "#FFEAA7",
    "Property": "#DDA0DD",
    "Travel": "#98D8C8",
    "Agriculture": "#F7DC6F",
    "Education": "#85C1E9",
    "Healthcare": "#F1948A",
    "Utilities": "#BB8FCE",
    "Insurance": "#52BE80",
    "Manufacturing": "#F0B27A",
    "E-commerce": "#85929E",
    "Government": "#5DADE2",
    "Legal": "#F1948A",
    "Import-Export": "#48C9B0",
    "Food-Business": "#F5B041",
    "Transport": "#AF7AC5",
    "Events": "#5499C7",
    "Fitness": "#45B39D",
    "Construction": "#DC7633",
    "Automotive": "#7FB3D5",
    "Hospitality": "#C39BD3",
    "Digital": "#7DCEA0",
    "NGO": "#F7DC6F"
  };

  const categoryIcons: Record<string, string> = {
    "GST & Tax": "💰",
    "Banking": "🏦",
    "Compliance": "📋",
    "Payroll": "💸",
    "Business Docs": "📄",
    "Property": "🏠",
    "Travel": "✈️",
    "Agriculture": "🌾",
    "Education": "🎓",
    "Healthcare": "🏥",
    "Utilities": "💡",
    "Insurance": "🛡️",
    "Manufacturing": "🏭",
    "E-commerce": "🛒",
    "Government": "🏛️",
    "Legal": "⚖️",
    "Import-Export": "🚢",
    "Food-Business": "🍽️",
    "Transport": "🚛",
    "Events": "🎉",
    "Fitness": "💪",
    "Construction": "🏗️",
    "Automotive": "🚗",
    "Hospitality": "🏨",
    "Digital": "💻",
    "NGO": "🤝"
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
          <div className={styles.blob3}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.badge}>India's #1 Business Tools Platform</div>
          <h1 className={styles.heroTitle}>
            Find the Perfect Tool for Your Business
          </h1>
          <p className={styles.heroSubtitle}>
            280+ professionally crafted tools for GST, Banking, Compliance, and more
          </p>
          
          {/* Featured Business Docs Banner */}
          <Link href="/tools/business-docs" style={{ textDecoration: 'none' }}>
            <div style={{
              marginTop: '48px',
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(20px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#E0E7FF', marginBottom: '8px' }}>
                    🎉 NEW: Business Document Generators
                  </h3>
                  <p style={{ color: '#CBD5E1', fontSize: '1.125rem' }}>
                    Create invoices, contracts, proposals, timesheets & more - 100% Free!
                  </p>
                </div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: '#E0E7FF' }}>
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </Link>

          {/* Search Section */}
          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <input
                ref={searchRef}
                type="text"
                placeholder="What are you looking for?"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.searchButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Search
              </button>
            </div>
            
            {/* Quick Search Tags */}
            <div className={styles.quickTags}>
              <span className={styles.tagLabel}>Popular:</span>
              {["GST Invoice", "Salary Calculator", "Rent Receipt", "PAN Card"].map(tag => (
                <button
                  key={tag}
                  className={styles.quickTag}
                  onClick={() => setSearchTerm(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <button
              className={styles.categoryToggle}
              onClick={() => setShowCategories(!showCategories)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Categories
              <span className={styles.categoryChip}>{selectedCategory}</span>
            </button>
            
            <div className={styles.resultCount}>
              {filteredTools.length} tools found
            </div>
          </div>
          
          <div className={styles.toolbarRight}>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Panel */}
        {showCategories && (
          <div className={styles.categoryPanel}>
            <div className={styles.categoryGrid}>
              {categories.map(category => (
                <button
                  key={category}
                  className={`${styles.categoryCard} ${selectedCategory === category ? styles.active : ""}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowCategories(false);
                  }}
                  style={{
                    borderColor: selectedCategory === category ? categoryColors[category] : "transparent",
                    backgroundColor: selectedCategory === category ? categoryColors[category] + "10" : "transparent"
                  }}
                >
                  <span className={styles.categoryEmoji}>
                    {category === "All" ? "🎯" : categoryIcons[category]}
                  </span>
                  <span className={styles.categoryName}>{category}</span>
                  {category !== "All" && (
                    <span className={styles.categoryCount}>
                      {allIndianTools.filter(t => t.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tools Display */}
        <div className={viewMode === "grid" ? styles.toolsGrid : styles.toolsList}>
          {filteredTools.map(tool => (
            <Link 
              key={tool.id} 
              href={tool.href} 
              className={viewMode === "grid" ? styles.toolCard : styles.toolListItem}
            >
              <div className={styles.toolContent}>
                <div 
                  className={styles.toolIconWrapper}
                  style={{ backgroundColor: categoryColors[tool.category] + "15" }}
                >
                  <span className={styles.toolIcon}>{tool.icon}</span>
                </div>
                
                <div className={styles.toolInfo}>
                  <h3 className={styles.toolTitle}>{tool.title}</h3>
                  <p className={styles.toolDesc}>{tool.desc}</p>
                  
                  <div className={styles.toolMeta}>
                    <span 
                      className={styles.toolCategoryTag}
                      style={{ 
                        backgroundColor: categoryColors[tool.category] + "20",
                        color: categoryColors[tool.category]
                      }}
                    >
                      {tool.category}
                    </span>
                    {tool.isFree && <span className={styles.freeTag}>FREE</span>}
                  </div>
                </div>

                <div className={styles.toolAction}>
                  <span className={styles.useToolText}>Use Tool</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No tools found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className={styles.resetFilters}
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaContent}>
            <h2>Can't find what you need?</h2>
            <p>We're constantly adding new tools. Let us know what you're looking for!</p>
          </div>
          <button className={styles.ctaButton}>
            Request a Tool
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 7L18 12M18 12L13 17M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}