"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface ReceiptData {
  receiptNumber: string;
  receiptDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyLogo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  paymentReference: string;
  description: string;
  amount: number;
  currency: string;
  notes: string;
  signature: string;
}

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Check",
  "Online Payment",
  "UPI",
  "Digital Wallet",
  "PayPal",
  "Other"
];

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" }
];

export default function ReceiptGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    receiptNumber: `RCP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001`,
    receiptDate: format(new Date(), 'yyyy-MM-dd'),
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    companyLogo: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    paymentMethod: "Cash",
    paymentReference: "",
    description: "",
    amount: 0,
    currency: "USD",
    notes: "",
    signature: ""
  });

  const updateReceiptData = (field: keyof ReceiptData, value: any) => {
    setReceiptData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Receipt_${receiptData.receiptNumber}`,
  });

  const downloadPDF = async () => {
    if (!printRef.current) return;
    
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Receipt_${receiptData.receiptNumber}.pdf`);
  };

  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.code === receiptData.currency);
    return currency ? currency.symbol : "$";
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Receipt Generator</h1>
        <p className={styles.heroSubtitle}>
          Create professional payment receipts instantly
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🧾</span> Receipt Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Receipt Number</label>
              <input
                type="text"
                className={styles.input}
                value={receiptData.receiptNumber}
                onChange={(e) => updateReceiptData('receiptNumber', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Receipt Date</label>
              <input
                type="date"
                className={styles.input}
                value={receiptData.receiptDate}
                onChange={(e) => updateReceiptData('receiptDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Currency</label>
              <select
                className={styles.select}
                value={receiptData.currency}
                onChange={(e) => updateReceiptData('currency', e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🏢</span> Company Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                className={styles.input}
                value={receiptData.companyName}
                onChange={(e) => updateReceiptData('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={receiptData.companyEmail}
                onChange={(e) => updateReceiptData('companyEmail', e.target.value)}
                placeholder="company@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={receiptData.companyPhone}
                onChange={(e) => updateReceiptData('companyPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={receiptData.companyAddress}
                onChange={(e) => updateReceiptData('companyAddress', e.target.value)}
                placeholder="123 Business Street&#10;City, State 12345&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>👤</span> Customer Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Customer Name</label>
              <input
                type="text"
                className={styles.input}
                value={receiptData.customerName}
                onChange={(e) => updateReceiptData('customerName', e.target.value)}
                placeholder="Customer Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={receiptData.customerEmail}
                onChange={(e) => updateReceiptData('customerEmail', e.target.value)}
                placeholder="customer@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={receiptData.customerPhone}
                onChange={(e) => updateReceiptData('customerPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>💳</span> Payment Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Method</label>
              <select
                className={styles.select}
                value={receiptData.paymentMethod}
                onChange={(e) => updateReceiptData('paymentMethod', e.target.value)}
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Reference/Transaction ID</label>
              <input
                type="text"
                className={styles.input}
                value={receiptData.paymentReference}
                onChange={(e) => updateReceiptData('paymentReference', e.target.value)}
                placeholder="Transaction ID or Check Number"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              <input
                type="number"
                className={styles.input}
                value={receiptData.amount}
                onChange={(e) => updateReceiptData('amount', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={receiptData.description}
                onChange={(e) => updateReceiptData('description', e.target.value)}
                placeholder="Payment for services rendered / Product purchase / Monthly subscription..."
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Notes (Optional)</label>
              <textarea
                className={styles.textarea}
                value={receiptData.notes}
                onChange={(e) => updateReceiptData('notes', e.target.value)}
                placeholder="Thank you for your payment!"
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print Receipt
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef} style={{ maxWidth: '600px', margin: '40px auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1F2937', marginBottom: '8px' }}>
              RECEIPT
            </h1>
            <div style={{ display: 'inline-block', padding: '8px 24px', background: '#F3F4F6', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>
                Receipt #{receiptData.receiptNumber}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                From
              </h3>
              <p style={{ fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>
                {receiptData.companyName || 'Company Name'}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', whiteSpace: 'pre-line' }}>
                {receiptData.companyAddress || 'Company Address'}
              </p>
              {receiptData.companyEmail && (
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{receiptData.companyEmail}</p>
              )}
              {receiptData.companyPhone && (
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{receiptData.companyPhone}</p>
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                To
              </h3>
              <p style={{ fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>
                {receiptData.customerName || 'Customer Name'}
              </p>
              {receiptData.customerEmail && (
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{receiptData.customerEmail}</p>
              )}
              {receiptData.customerPhone && (
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{receiptData.customerPhone}</p>
              )}
            </div>
          </div>

          <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Date</p>
                <p style={{ fontWeight: '600', color: '#1F2937' }}>
                  {format(new Date(receiptData.receiptDate), 'MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Payment Method</p>
                <p style={{ fontWeight: '600', color: '#1F2937' }}>{receiptData.paymentMethod}</p>
              </div>
              {receiptData.paymentReference && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Reference</p>
                  <p style={{ fontWeight: '600', color: '#1F2937' }}>{receiptData.paymentReference}</p>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Description</p>
              <p style={{ color: '#1F2937', marginBottom: '24px' }}>
                {receiptData.description || 'Payment received'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#374151' }}>Amount Paid</span>
                <span style={{ fontSize: '2rem', fontWeight: '900', color: '#667EEA' }}>
                  {getCurrencySymbol()}{formatAmount(receiptData.amount)}
                </span>
              </div>
            </div>
          </div>

          {receiptData.notes && (
            <div style={{ marginBottom: '32px', padding: '16px', background: '#F0F9FF', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ margin: 0, color: '#1E40AF', fontSize: '0.875rem' }}>{receiptData.notes}</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>
              This is a computer-generated receipt and does not require a signature.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
              For any queries, please contact us at {receiptData.companyEmail || 'support@company.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}