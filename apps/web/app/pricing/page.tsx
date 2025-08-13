"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for individuals and small businesses",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "12 Basic Tools",
      "GST Invoice Generator",
      "Basic Tax Calculators",
      "PAN & Aadhaar Validators",
      "Community Support",
      "Limited to 50 uses/month"
    ],
    cta: "Get Started Free",
    featured: false
  },
  {
    id: "pro",
    name: "Pro",
    description: "Complete toolkit for growing businesses",
    monthlyPrice: 999,
    yearlyPrice: 9999,
    originalYearlyPrice: 11988,
    features: [
      "All 268+ Premium Tools",
      "Unlimited Usage",
      "Priority WhatsApp Support",
      "Bulk Operations & Exports",
      "API Access",
      "Custom Branding",
      "Advanced GST Features",
      "Compliance Reminders"
    ],
    cta: "Start Free Trial",
    featured: true,
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    features: [
      "Everything in Pro",
      "Unlimited API Access",
      "White Label Options",
      "Dedicated Account Manager",
      "Custom Integrations",
      "On-premise Deployment",
      "SLA Guarantee",
      "Training & Onboarding"
    ],
    cta: "Contact Sales",
    featured: false
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (plan: typeof pricingPlans[0]) => {
    if (plan.id === "free") {
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        router.push("/tools");
      }
      return;
    }

    if (plan.id === "enterprise") {
      window.location.href = "mailto:sales@clientforce.io?subject=Enterprise Plan Inquiry";
      return;
    }

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      
      // Create subscription
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          planType: billingCycle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create subscription");
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: "ClientForce",
        description: `${plan.name} - ${billingCycle === "monthly" ? "Monthly" : "Yearly"} Subscription`,
        image: "/logo.png",
        handler: function (response: any) {
          // Payment successful
          console.log("Payment successful:", response);
          router.push("/dashboard");
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#FF5722"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error("Subscription error:", error);
      alert(error.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pricingPage}>
      <div className={styles.header}>
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the perfect plan for your business needs</p>
        
        <div className={styles.billingToggle}>
          <button
            className={billingCycle === "monthly" ? styles.active : ""}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={billingCycle === "yearly" ? styles.active : ""}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
            <span className={styles.saveBadge}>Save 17%</span>
          </button>
        </div>
      </div>

      <div className={styles.pricingGrid}>
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.pricingCard} ${plan.featured ? styles.featured : ""}`}
          >
            {plan.popular && (
              <div className={styles.popularBadge}>Most Popular</div>
            )}
            
            <h2>{plan.name}</h2>
            <p className={styles.description}>{plan.description}</p>
            
            <div className={styles.pricing}>
              {typeof plan.monthlyPrice === "number" ? (
                <>
                  <span className={styles.currency}>₹</span>
                  <span className={styles.price}>
                    {billingCycle === "monthly" 
                      ? plan.monthlyPrice.toLocaleString("en-IN")
                      : plan.yearlyPrice.toLocaleString("en-IN")
                    }
                  </span>
                  <span className={styles.period}>
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </>
              ) : (
                <span className={styles.customPrice}>Custom Pricing</span>
              )}
              
              {billingCycle === "yearly" && plan.originalYearlyPrice && (
                <div className={styles.originalPrice}>
                  ₹{plan.originalYearlyPrice.toLocaleString("en-IN")}
                </div>
              )}
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`${styles.ctaButton} ${plan.featured ? styles.featuredCta : ""}`}
              onClick={() => handleSubscribe(plan)}
              disabled={loading}
            >
              {loading ? "Processing..." : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>Is there a free trial?</h3>
            <p>Yes! Pro plan comes with a 7-day free trial. No credit card required to start.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Can I cancel anytime?</h3>
            <p>Absolutely! You can cancel your subscription anytime from your dashboard. No questions asked.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>What payment methods are accepted?</h3>
            <p>We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and Wallets through Razorpay.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Do prices include GST?</h3>
            <p>Yes, all prices are inclusive of 18% GST. You'll receive a GST invoice for all payments.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Can I switch plans?</h3>
            <p>Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Is there a refund policy?</h3>
            <p>We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.</p>
          </div>
        </div>
      </div>

      <div className={styles.trustSection}>
        <h3>Trusted by 50,000+ Indian Businesses</h3>
        <div className={styles.trustBadges}>
          <div className={styles.trustBadge}>
            <span>🔒</span>
            <p>256-bit SSL Encryption</p>
          </div>
          <div className={styles.trustBadge}>
            <span>🇮🇳</span>
            <p>Made in India</p>
          </div>
          <div className={styles.trustBadge}>
            <span>✅</span>
            <p>GST Compliant</p>
          </div>
          <div className={styles.trustBadge}>
            <span>🛡️</span>
            <p>Secure Payments by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}