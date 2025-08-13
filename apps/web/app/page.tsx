"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { allIndianTools, categories as toolCategories, searchTools, getToolsByCategory } from "./tools/toolsData";

// Basic free tools visible to all users
const basicTools = [
  { id: 1, href: "/tools/gst-invoice", title: "GST Invoice Generator", desc: "Create GST-compliant tax invoices", shortDesc: "Auto-calculate CGST/SGST in seconds", icon: "🧾", category: "GST & Tax", tags: ["gst", "invoice", "billing"], isFree: true, isPopular: true },
  { id: 2, href: "/tools/gst-calculator", title: "GST Calculator", desc: "Calculate GST, CGST, SGST, IGST", shortDesc: "Instant GST breakup for any amount", icon: "🧮", category: "GST & Tax", tags: ["gst", "calculator", "tax"], isFree: true, isPopular: true },
  { id: 7, href: "/tools/tds-calculator", title: "TDS Calculator", desc: "Calculate TDS on various payments", shortDesc: "All sections covered - 194C to 194Q", icon: "💰", category: "GST & Tax", tags: ["tds", "tax", "deduction"], isFree: true },
  { id: 101, href: "/tools/ifsc-finder", title: "Bank IFSC Code Finder", desc: "Find IFSC codes of any bank", shortDesc: "5000+ bank branches database", icon: "🏦", category: "Banking", tags: ["ifsc", "bank", "code"], isFree: true, isNew: true },
  { id: 103, href: "/tools/emi-calculator", title: "EMI Calculator", desc: "Calculate loan EMI amount", shortDesc: "Home, car, personal loan EMIs", icon: "🏠", category: "Banking", tags: ["emi", "loan", "calculator"], isFree: true },
  { id: 201, href: "/tools/pan-validator", title: "PAN Card Validator", desc: "Validate PAN card format", shortDesc: "Instant PAN format verification", icon: "💳", category: "Compliance", tags: ["pan", "kyc", "validator"], isFree: true },
  { id: 202, href: "/tools/aadhaar-validator", title: "Aadhaar Validator", desc: "Validate Aadhaar number", shortDesc: "Verhoeff algorithm validation", icon: "🆔", category: "Compliance", tags: ["aadhaar", "kyc", "validator"], isFree: true },
  { id: 301, href: "/tools/salary-calculator", title: "Salary Calculator", desc: "Calculate in-hand salary", shortDesc: "CTC to in-hand with tax slabs", icon: "💸", category: "Payroll", tags: ["salary", "ctc", "calculator"], isFree: true, isPopular: true },
  { id: 501, href: "/tools/rent-receipt", title: "Rent Receipt Generator", desc: "Generate rent receipts for HRA", shortDesc: "PDF receipts for HRA claims", icon: "🏠", category: "Property", tags: ["rent", "receipt", "hra"], isFree: true },
  { id: 601, href: "/tools/ltc-bill", title: "LTC Bill Generator", desc: "Generate LTC bills for claims", shortDesc: "Ready-to-submit LTC bills", icon: "✈️", category: "Travel", tags: ["ltc", "travel", "bill"], isFree: true, isNew: true },
  { id: 3, href: "/tools/number-to-words", title: "Number to Words (Indian)", desc: "Convert amounts to words in Lakhs & Crores", shortDesc: "Indian numbering system", icon: "🔢", category: "Banking", tags: ["number", "words", "converter"], isFree: true },
  { id: 8, href: "/tools/bill-splitter", title: "Bill Splitter", desc: "Split bills among friends easily", shortDesc: "Fair split with tip calculation", icon: "💵", category: "Utilities", tags: ["bill", "split", "calculator"], isFree: true }
];


const testimonials = [
  {
    text: "Earlier, I used to spend 2-3 hours daily just on GST invoices and calculations. With ClientForce, I create professional invoices in under 2 minutes. The automatic CGST/SGST split and HSN code search have eliminated all my compliance worries. My CA is also happy!",
    author: "Rajesh Kumar",
    role: "Founder & CEO",
    avatar: "RK",
    location: "Mumbai, Maharashtra",
    business: "Kumar Electronics & Home Appliances",
    businessType: "Retail Chain (3 Stores)",
    turnover: "₹2.5 Cr Annual Turnover",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: true,
    rating: 5
  },
  {
    text: "As a CA handling 50+ clients, ClientForce has been a game-changer. The bulk GST return filing, automated TDS calculations, and Form 16 generator save me 15+ hours every week. My clients love the professional invoices, and I love the compliance accuracy. Worth every rupee!",
    author: "CA Priya Sharma",
    role: "Managing Partner",
    avatar: "PS",
    location: "Gurgaon, Haryana",
    business: "Sharma & Associates Chartered Accountants",
    businessType: "CA Firm (12 Employees)",
    clientBase: "200+ SME Clients",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
    rating: 5
  },
  {
    text: "We manufacture and export textiles across India. E-way bill generation used to be a nightmare with multiple consignments daily. ClientForce's bulk e-way bill feature and GSTR integration have reduced our compliance time by 80%. Even our truck drivers can generate e-way bills on mobile now!",
    author: "Amit Patel",
    role: "Managing Director",
    avatar: "AP",
    location: "Surat, Gujarat",
    business: "Patel Textiles Pvt Ltd",
    businessType: "Textile Manufacturing & Export",
    employees: "150+ Employees",
    photo: "https://randomuser.me/api/portraits/men/51.jpg",
    verified: true,
    rating: 5
  }
];

const faqs = [
  {
    question: "Is my data safe? Where is it stored?",
    answer: "100% safe! All data is stored in AWS Mumbai servers (within India) and encrypted with bank-level security. We comply with Indian data protection laws and never share your data with third parties. Your GST data, invoices, and client information remain completely confidential."
  },
  {
    question: "Do you have a mobile app?",
    answer: "Yes! Our Android app is available on Google Play Store with 4.5+ rating. iOS app is coming soon. Meanwhile, our website is fully mobile-responsive and works perfectly on all smartphones. You can generate invoices, calculate GST, and file returns directly from your phone."
  },
  {
    question: "Do you support regional language invoices?",
    answer: "Yes! We support invoices in Hindi, Tamil, Telugu, Gujarati, Marathi, Bengali, and Kannada. You can switch languages with one click and even create bilingual invoices (English + Regional) for better customer communication."
  },
  {
    question: "Is ClientForce approved by GST Network (GSTN)?",
    answer: "Yes! We are a GSTN-approved GSP (GST Suvidha Provider). All our tools follow latest GST rules, support new return formats, and are updated within 24 hours of any government notification. Your compliance is always up-to-date."
  },
  {
    question: "Can I import data from Tally/Busy/Marg?",
    answer: "Absolutely! We support direct import from Tally, Busy, Marg, and 15+ other accounting software. Just export your data in Excel/CSV format and upload - our AI will map fields automatically. Migration takes less than 5 minutes."
  },
  {
    question: "What if I need help or training?",
    answer: "We provide FREE onboarding for all users! Get WhatsApp support (9 AM - 9 PM), video tutorials in Hindi/English, and weekly webinars. Pro users get dedicated account manager and priority phone support within 2 hours."
  }
];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Check if user is logged in (simplified - in real app, check auth state)
  useEffect(() => {
    const checkAuth = () => {
      // Simple check - in production, use proper auth
      const authToken = localStorage.getItem('auth_token');
      setIsLoggedIn(!!authToken);
    };
    checkAuth();
  }, []);

  const filteredTools = useMemo(() => {
    let tools = isLoggedIn ? allIndianTools : basicTools;
    
    if (searchTerm) {
      tools = tools.filter(tool => 
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return tools;
  }, [searchTerm, isLoggedIn]);

  const displayedTools = isLoggedIn ? filteredTools : filteredTools.slice(0, 6);

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

  return (
    <div>
      {/* Trust Banner with animation */}
      <div className={styles.trustBanner}>
        <div className={styles.trustBannerContent}>
          <span className={styles.tricolorBadge}>
            <span className={styles.saffron}></span>
            <span className={styles.white}></span>
            <span className={styles.green}></span>
          </span>
          <div className={styles.trustBannerText}>
            <span className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
              Built for Indian Businesses
            </span>
            <span className={styles.trustDivider}>•</span>
            <span className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3.5 7v6c0 5.5 3.8 10.7 8.5 12 4.7-1.3 8.5-6.5 8.5-12V7L12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              100% GST Compliant
            </span>
            <span className={styles.trustDivider}>•</span>
            <span className={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Data Stored in India
            </span>
          </div>
        </div>
      </div>
      
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
          <div className={styles.blob3}></div>
        </div>
        
        <div className={styles.heroContent}>
          {/* Trust badges at top */}
          <div className={styles.heroTrustBadges}>
            <span className={styles.heroTrustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3.5 7v6c0 5.5 3.8 10.7 8.5 12 4.7-1.3 8.5-6.5 8.5-12V7L12 2zm0 2.2l6.5 3.8v5c0 4.5-3.1 8.8-6.5 10-3.4-1.2-6.5-5.5-6.5-10V8l6.5-3.8z"/>
              </svg>
              Govt Compliant
            </span>
            <span className={styles.heroTrustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              50,000+ Businesses
            </span>
            <span className={styles.heroTrustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              100% Secure
            </span>
          </div>

          {/* Brand with enhanced animation */}
          <div className={styles.brandSection}>
            <div className={styles.brandLogo}>
              <div className={styles.brandIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className={styles.brandName}>ClientForce</h1>
            </div>
            <p className={styles.brandTagline}>भारत का बिजनेस साथी</p>
          </div>
          
          {/* Hero Title with gradient and animation */}
          <h2 className={styles.heroTitle}>
            <span className={styles.heroTitleGradient}>268+ Free Business Tools</span>
            <br />
            <span className={styles.heroTitleSecond}>for Indian SMEs</span>
          </h2>
          <p className={styles.heroSubtitle}>
            GST Invoices, Tax Calculators, Banking Tools & More — All in One Place
          </p>
          
          {/* Animated tool icons */}
          <div className={styles.floatingIcons}>
            <div className={styles.floatingIcon} style={{animationDelay: '0s'}}>📄</div>
            <div className={styles.floatingIcon} style={{animationDelay: '1s'}}>💰</div>
            <div className={styles.floatingIcon} style={{animationDelay: '2s'}}>🏦</div>
            <div className={styles.floatingIcon} style={{animationDelay: '3s'}}>📊</div>
            <div className={styles.floatingIcon} style={{animationDelay: '4s'}}>🧾</div>
          </div>
        
          {/* CTA Buttons */}
          <div className={styles.ctaSection}>
            <Link href="/tools" className={styles.primaryCTA}>
              Explore All Tools
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <Link href="/tools/gst-invoice" className={styles.secondaryCTA}>
              Start with GST Invoice
            </Link>
          </div>
          
          <p className={styles.ctaSubtext}>✓ No sign-up required • ✓ 100% Free • ✓ Made in India</p>
          
          {/* Popular Tools */}
          <div className={styles.popularTools}>
            <span className={styles.popularLabel}>Most Used:</span>
            {[
              { name: "GST Invoice", icon: "📄" },
              { name: "E-Way Bill", icon: "🚚" },
              { name: "TDS Calculator", icon: "💰" },
              { name: "Form 16", icon: "📋" }
            ].map(tool => (
              <Link
                key={tool.name}
                href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={styles.popularTool}
              >
                <span>{tool.icon}</span>
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>🚀</div>
              <div className={styles.statIconBg}></div>
            </div>
            <h3 className={styles.statNumber}>
              <span className={styles.statNumberValue}>1000</span>
              <span className={styles.statNumberPlus}>+</span>
            </h3>
            <p className={styles.statLabel}>Business Tools</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>🏢</div>
              <div className={styles.statIconBg}></div>
            </div>
            <h3 className={styles.statNumber}>
              <span className={styles.statNumberValue}>50K</span>
              <span className={styles.statNumberPlus}>+</span>
            </h3>
            <p className={styles.statLabel}>Active Businesses</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>📈</div>
              <div className={styles.statIconBg}></div>
            </div>
            <h3 className={styles.statNumber}>
              <span className={styles.statNumberValue}>₹5Cr</span>
              <span className={styles.statNumberPlus}>+</span>
            </h3>
            <p className={styles.statLabel}>Invoice Value</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <div className={styles.statIcon}>⏱️</div>
              <div className={styles.statIconBg}></div>
            </div>
            <h3 className={styles.statNumber}>
              <span className={styles.statNumberValue}>10Hr</span>
              <span className={styles.statNumberPlus}>+</span>
            </h3>
            <p className={styles.statLabel}>Saved Weekly</p>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Essential Tools for Indian Businesses</h2>
            <p className={styles.sectionSubtitle}>
              {isLoggedIn ? (
                <>Browse {allIndianTools.length}+ professional business tools</>
              ) : (
                <><span className={styles.freeTag}>FREE</span> GST, Tax, Banking tools - Sab kuch ek jagah!</>
              )}
            </p>
          </div>
          
        </div>

        
        <div className={styles.toolsGrid}>
          {displayedTools.map((tool, index) => (
            <Link 
              key={tool.id} 
              href={tool.href} 
              className={styles.toolCard}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className={styles.toolBadges}>
                {tool.isFree ? (
                  <span className={styles.freeBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    FREE
                  </span>
                ) : (
                  <span className={styles.premiumBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    PRO
                  </span>
                )}
              </div>
              <div 
                className={styles.toolIconWrapper}
                style={{ backgroundColor: categoryColors[tool.category] + "15" }}
              >
                <span className={styles.toolIcon}>{tool.icon}</span>
              </div>
              <h3 className={styles.toolTitle}>{tool.title}</h3>
              <p className={styles.toolDescription}>{tool.desc}</p>
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
                <span className={styles.toolAction}>
                  Use Now →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {!isLoggedIn && (
          <div className={styles.loginPrompt}>
            <div className={styles.loginPromptCard}>
              <div className={styles.loginPromptIcon}>🔓</div>
              <h3>Unlock {allIndianTools.length - 6}+ More Tools</h3>
              <p>Sign up for free to access our complete suite of 268+ business tools including:</p>
              <div className={styles.toolPreview}>
                <span>✓ Advanced GST Features</span>
                <span>✓ E-Way Bill Generator</span>
                <span>✓ Form 16 & TDS Tools</span>
                <span>✓ Business Documents</span>
              </div>
              <Link href="/login" className={styles.signupButton}>
                Sign Up Free - No Credit Card Required
              </Link>
              <p className={styles.signupSubtext}>Join 50,000+ Indian businesses already using ClientForce</p>
            </div>
          </div>
        )}

        {filteredTools.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No tools found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className={styles.resetFilters}
              onClick={() => {
                setSearchTerm("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>


      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>Trusted by Indian Businesses</h2>
        <p className={styles.sectionSubtitle}>
          From MSMEs to large enterprises, see why India trusts ClientForce
        </p>
        
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {"★".repeat(testimonial.rating)}
              </div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
              <div className={styles.testimonialAuthor}>
                <img 
                  src={testimonial.photo} 
                  alt={testimonial.author}
                  className={styles.authorPhoto}
                />
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>{testimonial.author}</p>
                  <p className={styles.authorRole}>{testimonial.role}</p>
                  <p className={styles.businessName}>{testimonial.business}</p>
                  <div className={styles.businessDetails}>
                    <span className={styles.businessBadge}>
                      {testimonial.businessType}
                    </span>
                    <span className={styles.locationBadge}>
                      📍 {testimonial.location}
                    </span>
                  </div>
                  {testimonial.turnover && (
                    <p className={styles.businessMetric}>{testimonial.turnover}</p>
                  )}
                  {testimonial.clientBase && (
                    <p className={styles.businessMetric}>{testimonial.clientBase}</p>
                  )}
                  {testimonial.employees && (
                    <p className={styles.businessMetric}>{testimonial.employees}</p>
                  )}
                </div>
              </div>
              {testimonial.verified && (
                <div className={styles.verifiedBadge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L3.5 7v6c0 5.5 3.8 10.7 8.5 12 4.7-1.3 8.5-6.5 8.5-12V7L12 2zm-2 15l-4-4 1.4-1.4L10 14.2l6.6-6.6L18 9l-8 8z"/>
                  </svg>
                  Verified Business
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.partnersSection}>
        <h2 className={styles.sectionTitle}>Works Seamlessly With Your Bank, Payment & Compliance Tools</h2>
        <p className={styles.sectionSubtitle}>
          Direct integration with tools you trust and use daily
        </p>
        <div className={styles.partnersGrid}>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogo}>
              <span className={styles.partnerIcon}>💳</span>
            </div>
            <h3>Razorpay</h3>
            <p className={styles.partnerType}>Payment Gateway</p>
            <p className={styles.partnerDesc}>Accept payments & auto-generate invoices</p>
          </div>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogo}>
              <span className={styles.partnerIcon}>🏦</span>
            </div>
            <h3>HDFC Bank</h3>
            <p className={styles.partnerType}>Banking Partner</p>
            <p className={styles.partnerDesc}>Direct bank reconciliation & statements</p>
          </div>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogo}>
              <span className={styles.partnerIcon}>📊</span>
            </div>
            <h3>Tally</h3>
            <p className={styles.partnerType}>Accounting Software</p>
            <p className={styles.partnerDesc}>Sync invoices & GST data automatically</p>
          </div>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogo}>
              <span className={styles.partnerIcon}>🎯</span>
            </div>
            <h3>ClearTax</h3>
            <p className={styles.partnerType}>GST Filing Partner</p>
            <p className={styles.partnerDesc}>One-click GSTR filing & reconciliation</p>
          </div>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogo}>
              <span className={styles.partnerIcon}>📧</span>
            </div>
            <h3>Zoho</h3>
            <p className={styles.partnerType}>Business Suite</p>
            <p className={styles.partnerDesc}>CRM & invoice sync for sales teams</p>
          </div>
          <div className={styles.partnerCard}>
            <div className={styles.partnerLogo}>
              <span className={styles.partnerIcon}>📦</span>
            </div>
            <h3>Shiprocket</h3>
            <p className={styles.partnerType}>Logistics Partner</p>
            <p className={styles.partnerDesc}>E-way bills & shipping labels</p>
          </div>
        </div>
      </section>

      {/* Compliance & Trust Section */}
      <section className={styles.complianceSection}>
        <h2 className={styles.sectionTitle}>100% Compliant & Secure</h2>
        <p className={styles.sectionSubtitle}>
          Your trust is our foundation
        </p>
        <div className={styles.complianceGrid}>
          <div className={styles.complianceCard}>
            <div className={styles.complianceIcon}>🛡️</div>
            <h3>GSTN Approved</h3>
            <p>Official GST Suvidha Provider</p>
          </div>
          <div className={styles.complianceCard}>
            <div className={styles.complianceIcon}>🔒</div>
            <h3>ISO 27001</h3>
            <p>Information Security Certified</p>
          </div>
          <div className={styles.complianceCard}>
            <div className={styles.complianceIcon}>🏛️</div>
            <h3>MCA Compliant</h3>
            <p>Ministry of Corporate Affairs</p>
          </div>
          <div className={styles.complianceCard}>
            <div className={styles.complianceIcon}>🇮🇳</div>
            <h3>Data in India</h3>
            <p>Stored in Mumbai Servers</p>
          </div>
          <div className={styles.complianceCard}>
            <div className={styles.complianceIcon}>✅</div>
            <h3>PCI DSS</h3>
            <p>Payment Security Standard</p>
          </div>
          <div className={styles.complianceCard}>
            <div className={styles.complianceIcon}>📱</div>
            <h3>Aadhaar Vault</h3>
            <p>UIDAI Compliant Storage</p>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                {faq.question}
                <span>→</span>
              </h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Join 50,000+ Indian Businesses</h2>
          <p className={styles.ctaSubtitle}>
            Save 10+ hours every week on GST, Tax & Compliance work
          </p>
          <div className={styles.ctaStats}>
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNumber}>2 Min</span>
              <span className={styles.ctaStatLabel}>Setup Time</span>
            </div>
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNumber}>₹0</span>
              <span className={styles.ctaStatLabel}>Forever Free</span>
            </div>
            <div className={styles.ctaStat}>
              <span className={styles.ctaStatNumber}>24/7</span>
              <span className={styles.ctaStatLabel}>Support</span>
            </div>
          </div>
          <div className={styles.ctaButtons}>
            {isLoggedIn ? (
              <Link href="/tools" className={styles.ctaButton}>
                Explore All 268+ Tools →
              </Link>
            ) : (
              <>
                <Link href="/tools/gst-invoice" className={styles.ctaButton}>
                  Start Free – Generate Your First Invoice
                </Link>
                <Link href="/pricing" className={styles.ctaButtonSecondary}>
                  See Pro Features
                </Link>
              </>
            )}
          </div>
          <p className={styles.ctaGuarantee}>
            ✓ No credit card required &nbsp;·&nbsp; ✓ No hidden charges &nbsp;·&nbsp; ✓ Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}