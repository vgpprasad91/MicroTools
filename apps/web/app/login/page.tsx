"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
    otp: ""
  });
  
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showOTP, setShowOTP] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = authMethod === "email" 
        ? { email: formData.email, password: formData.password, name: !isLogin ? formData.name : undefined }
        : { phone: formData.phone, otp: formData.otp, name: !isLogin ? formData.name : undefined };

      console.log("Submitting to:", endpoint, payload);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Store auth token
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        
        // Also set as a cookie for middleware authentication
        document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        
        console.log("Token stored, redirecting to dashboard...");
        
        // Force a hard redirect to ensure navigation works
        window.location.href = "/dashboard";
      } else {
        throw new Error("No token received from server");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setShowOTP(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className={styles.subtitle}>
            {isLogin 
              ? "Login to access all 268+ premium tools" 
              : "Join 50,000+ Indian businesses using ClientForce"}
          </p>
        </div>

        <div className={styles.authMethodTabs}>
          <button
            className={`${styles.authTab} ${authMethod === "email" ? styles.active : ""}`}
            onClick={() => {
              setAuthMethod("email");
              setShowOTP(false);
            }}
          >
            📧 Email
          </button>
          <button
            className={`${styles.authTab} ${authMethod === "phone" ? styles.active : ""}`}
            onClick={() => setAuthMethod("phone")}
          >
            📱 Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
              />
            </div>
          )}

          {authMethod === "email" ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <div className={styles.phoneInput}>
                  <span className={styles.countryCode}>+91</span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
              {!showOTP && (
                <button
                  type="button"
                  onClick={sendOTP}
                  className={styles.otpButton}
                  disabled={isLoading || formData.phone.length !== 10}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              )}
              {showOTP && (
                <div className={styles.formGroup}>
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={sendOTP}
                    className={styles.resendLink}
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : (isLogin ? "Login" : "Create Account")}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button className={styles.googleButton}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className={styles.toggleAuth}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className={styles.toggleLink}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

        <p className={styles.terms}>
          By continuing, you agree to our{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>
        </p>

        {/* Demo credentials info */}
        <div style={{
          marginTop: "20px",
          padding: "16px",
          background: "#f0f9ff",
          borderRadius: "8px",
          fontSize: "0.875rem",
          color: "#0369a1"
        }}>
          <strong>Demo Credentials:</strong><br />
          Email: Any email + Password: 6+ characters<br />
          Phone: Any 10 digits + OTP: 123456
        </div>
      </div>

      <div className={styles.features}>
        <h2>Why Choose ClientForce?</h2>
        <div className={styles.featureList}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔒</span>
            <h3>Secure Payments</h3>
            <p>Powered by Razorpay with 256-bit encryption</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💳</span>
            <h3>Multiple Payment Options</h3>
            <p>UPI, Cards, Net Banking, Wallets & EMI</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🚀</span>
            <h3>Instant Access</h3>
            <p>Start using premium tools immediately after payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}