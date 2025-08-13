"use client";

import Link from "next/link";
import styles from "../page.module.css";

const businessDocTools = [
  {
    id: 1,
    href: "/tools/invoice-generator",
    title: "Invoice Generator",
    description: "Create professional invoices with automatic calculations and PDF export",
    icon: "🧾",
    color: "#667EEA",
    features: ["PDF Export", "Tax Calculations", "Multi-currency", "Custom Branding"]
  },
  {
    id: 2,
    href: "/tools/quote-generator",
    title: "Quote & Estimate Generator",
    description: "Generate detailed quotes and estimates to win more business",
    icon: "📝",
    color: "#764BA2",
    features: ["Project Timeline", "Multiple Items", "Terms & Conditions", "Professional Design"]
  },
  {
    id: 3,
    href: "/tools/receipt-generator",
    title: "Receipt Generator",
    description: "Quick and easy payment receipt generation",
    icon: "🧾",
    color: "#FA709A",
    features: ["Multiple Payment Methods", "Multi-currency", "Instant Download", "Clean Design"]
  },
  {
    id: 4,
    href: "/tools/purchase-order",
    title: "Purchase Order Generator",
    description: "Create purchase orders for your suppliers",
    icon: "📋",
    color: "#FEE140",
    features: ["Vendor Management", "Shipping Details", "Payment Terms", "Item Tracking"]
  },
  {
    id: 5,
    href: "/tools/business-proposal",
    title: "Business Proposal Generator",
    description: "Create compelling proposals that close deals",
    icon: "💼",
    color: "#00D2FF",
    features: ["Cover Page", "Dynamic Sections", "Timeline View", "Professional Layout"]
  },
  {
    id: 6,
    href: "/tools/contract-generator",
    title: "Contract & Agreement Generator",
    description: "Generate legally structured contracts and agreements",
    icon: "📜",
    color: "#3A7BD5",
    features: ["Multiple Templates", "Dynamic Clauses", "Legal Format", "E-signature Ready"]
  },
  {
    id: 7,
    href: "/tools/timesheet-generator",
    title: "Timesheet Generator",
    description: "Track work hours and generate professional timesheets",
    icon: "⏰",
    color: "#10B981",
    features: ["Weekly View", "Overtime Tracking", "Pay Calculations", "Project Tracking"]
  },
  {
    id: 8,
    href: "/tools/expense-report",
    title: "Expense Report Generator",
    description: "Create detailed expense reports for easy reimbursement",
    icon: "💳",
    color: "#EF4444",
    features: ["Category Tracking", "Receipt Status", "Multi-currency", "Approval Flow"]
  }
];

export default function BusinessDocsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
          <div className={styles.blob3}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.badge}>Free Professional Tools</div>
          <h1 className={styles.heroTitle}>
            Business Document Generators
          </h1>
          <p className={styles.heroSubtitle}>
            Create professional invoices, contracts, proposals, and more - all completely free
          </p>
        </div>
      </div>

      <div className={styles.mainSection}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>
            Everything You Need for Your Business Documentation
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)', maxWidth: '800px', margin: '0 auto' }}>
            Our suite of business document tools helps you create professional documents in minutes. 
            No signup required, no hidden fees - just powerful tools that work.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px', marginBottom: '80px' }}>
          {businessDocTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                className={styles.toolCard}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '32px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.25rem',
                      background: `linear-gradient(135deg, ${tool.color}20 0%, ${tool.color}10 100%)`,
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.375rem',
                      fontWeight: '800',
                      color: '#F1F5F9',
                      margin: '0 0 8px',
                      letterSpacing: '-0.01em'
                    }}>
                      {tool.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9375rem',
                      color: '#94A3B8',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {tool.features.map((feature, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          background: `${tool.color}15`,
                          border: `1px solid ${tool.color}30`,
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: tool.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: tool.color,
                    fontWeight: '700',
                    fontSize: '0.9375rem'
                  }}>
                    <span>Use Tool</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
          borderRadius: '24px',
          padding: '64px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#F1F5F9', marginBottom: '16px' }}>
            Why Choose Our Business Tools?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginTop: '48px' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>
                100% Free
              </h3>
              <p style={{ color: '#94A3B8' }}>
                No hidden fees, no subscriptions. All tools are completely free to use.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>
                No Sign-up Required
              </h3>
              <p style={{ color: '#94A3B8' }}>
                Start creating documents immediately. No registration or login needed.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📥</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>
                PDF Export
              </h3>
              <p style={{ color: '#94A3B8' }}>
                Download your documents as PDFs or print them directly from your browser.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎨</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px' }}>
                Professional Design
              </h3>
              <p style={{ color: '#94A3B8' }}>
                Beautiful, modern templates that make your business look professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}