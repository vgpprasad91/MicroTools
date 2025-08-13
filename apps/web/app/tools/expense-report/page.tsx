"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface ExpenseItem {
  id: string;
  date: string;
  category: string;
  description: string;
  vendor: string;
  amount: number;
  paymentMethod: string;
  hasReceipt: boolean;
  notes: string;
}

interface ExpenseReportData {
  reportTitle: string;
  reportNumber: string;
  reportDate: string;
  periodStart: string;
  periodEnd: string;
  employeeName: string;
  employeeId: string;
  employeeEmail: string;
  department: string;
  approverName: string;
  approverEmail: string;
  companyName: string;
  companyAddress: string;
  purpose: string;
  items: ExpenseItem[];
  totalAmount: number;
  advanceReceived: number;
  amountDue: number;
  currency: string;
  notes: string;
  bankAccount: string;
}

const expenseCategories = [
  "Travel - Air",
  "Travel - Ground",
  "Travel - Lodging",
  "Meals & Entertainment",
  "Office Supplies",
  "Equipment",
  "Communication",
  "Professional Services",
  "Training & Education",
  "Marketing",
  "Software & Subscriptions",
  "Other"
];

const paymentMethods = [
  "Company Credit Card",
  "Personal Credit Card",
  "Cash",
  "Debit Card",
  "Bank Transfer",
  "Company Account",
  "Check"
];

export default function ExpenseReportGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [expenseData, setExpenseData] = useState<ExpenseReportData>({
    reportTitle: "Monthly Expense Report",
    reportNumber: `EXP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001`,
    reportDate: format(new Date(), 'yyyy-MM-dd'),
    periodStart: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    periodEnd: format(new Date(), 'yyyy-MM-dd'),
    employeeName: "",
    employeeId: "",
    employeeEmail: "",
    department: "",
    approverName: "",
    approverEmail: "",
    companyName: "",
    companyAddress: "",
    purpose: "",
    items: [
      {
        id: crypto.randomUUID(),
        date: format(new Date(), 'yyyy-MM-dd'),
        category: "Travel - Air",
        description: "",
        vendor: "",
        amount: 0,
        paymentMethod: "Company Credit Card",
        hasReceipt: true,
        notes: ""
      }
    ],
    totalAmount: 0,
    advanceReceived: 0,
    amountDue: 0,
    currency: "USD",
    notes: "",
    bankAccount: ""
  });

  const updateExpenseData = (field: keyof ExpenseReportData, value: any) => {
    setExpenseData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'items' || field === 'advanceReceived') {
        const totalAmount = updated.items.reduce((sum, item) => sum + item.amount, 0);
        const amountDue = totalAmount - updated.advanceReceived;
        
        return {
          ...updated,
          totalAmount,
          amountDue
        };
      }
      
      return updated;
    });
  };

  const addItem = () => {
    const newItem: ExpenseItem = {
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd'),
      category: "Travel - Air",
      description: "",
      vendor: "",
      amount: 0,
      paymentMethod: "Company Credit Card",
      hasReceipt: true,
      notes: ""
    };
    updateExpenseData('items', [...expenseData.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateExpenseData('items', expenseData.items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ExpenseItem, value: any) => {
    const updatedItems = expenseData.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateExpenseData('items', updatedItems);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `ExpenseReport_${expenseData.reportNumber}`,
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
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`ExpenseReport_${expenseData.reportNumber}.pdf`);
  };

  const getCurrencySymbol = () => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹"
    };
    return symbols[expenseData.currency] || "$";
  };

  const getCategoryTotals = () => {
    const totals: Record<string, number> = {};
    expenseData.items.forEach(item => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
    });
    return totals;
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Expense Report Generator</h1>
        <p className={styles.heroSubtitle}>
          Create detailed expense reports for reimbursement
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Report Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Report Title</label>
              <input
                type="text"
                className={styles.input}
                value={expenseData.reportTitle}
                onChange={(e) => updateExpenseData('reportTitle', e.target.value)}
                placeholder="Monthly Expense Report"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Report Number</label>
              <input
                type="text"
                className={styles.input}
                value={expenseData.reportNumber}
                onChange={(e) => updateExpenseData('reportNumber', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Report Date</label>
              <input
                type="date"
                className={styles.input}
                value={expenseData.reportDate}
                onChange={(e) => updateExpenseData('reportDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Period Start</label>
              <input
                type="date"
                className={styles.input}
                value={expenseData.periodStart}
                onChange={(e) => updateExpenseData('periodStart', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Period End</label>
              <input
                type="date"
                className={styles.input}
                value={expenseData.periodEnd}
                onChange={(e) => updateExpenseData('periodEnd', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Currency</label>
              <select
                className={styles.select}
                value={expenseData.currency}
                onChange={(e) => updateExpenseData('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Purpose / Business Reason</label>
              <textarea
                className={styles.textarea}
                value={expenseData.purpose}
                onChange={(e) => updateExpenseData('purpose', e.target.value)}
                placeholder="Client meeting in New York, Project kickoff, Conference attendance..."
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>👤</span> Employee Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee Name</label>
              <input
                type="text"
                className={styles.input}
                value={expenseData.employeeName}
                onChange={(e) => updateExpenseData('employeeName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID</label>
              <input
                type="text"
                className={styles.input}
                value={expenseData.employeeId}
                onChange={(e) => updateExpenseData('employeeId', e.target.value)}
                placeholder="EMP001"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={expenseData.employeeEmail}
                onChange={(e) => updateExpenseData('employeeEmail', e.target.value)}
                placeholder="employee@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Department</label>
              <input
                type="text"
                className={styles.input}
                value={expenseData.department}
                onChange={(e) => updateExpenseData('department', e.target.value)}
                placeholder="Sales"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Approver Name</label>
              <input
                type="text"
                className={styles.input}
                value={expenseData.approverName}
                onChange={(e) => updateExpenseData('approverName', e.target.value)}
                placeholder="Manager Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Approver Email</label>
              <input
                type="email"
                className={styles.input}
                value={expenseData.approverEmail}
                onChange={(e) => updateExpenseData('approverEmail', e.target.value)}
                placeholder="manager@example.com"
              />
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
                value={expenseData.companyName}
                onChange={(e) => updateExpenseData('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Company Address</label>
              <textarea
                className={styles.textarea}
                value={expenseData.companyAddress}
                onChange={(e) => updateExpenseData('companyAddress', e.target.value)}
                placeholder="123 Business Street&#10;City, State 12345"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>💸</span> Expense Items
          </h2>
          <div className={styles.itemsSection}>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>Date</th>
                    <th style={{ width: '15%' }}>Category</th>
                    <th style={{ width: '20%' }}>Description</th>
                    <th style={{ width: '15%' }}>Vendor</th>
                    <th style={{ width: '10%' }}>Amount</th>
                    <th style={{ width: '12%' }}>Payment</th>
                    <th style={{ width: '8%' }}>Receipt</th>
                    <th style={{ width: '15%' }}>Notes</th>
                    <th style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </td>
                      <td>
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                          style={{ width: '100%', padding: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'var(--foreground)' }}
                        >
                          {expenseCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Expense description"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.vendor}
                          onChange={(e) => updateItem(item.id, 'vendor', e.target.value)}
                          placeholder="Vendor name"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td>
                        <select
                          value={item.paymentMethod}
                          onChange={(e) => updateItem(item.id, 'paymentMethod', e.target.value)}
                          style={{ width: '100%', padding: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'var(--foreground)' }}
                        >
                          {paymentMethods.map(method => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={item.hasReceipt}
                          onChange={(e) => updateItem(item.id, 'hasReceipt', e.target.checked)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                          placeholder="Notes"
                        />
                      </td>
                      <td>
                        {expenseData.items.length > 1 && (
                          <button
                            className={styles.removeItemButton}
                            onClick={() => removeItem(item.id)}
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className={styles.addItemButton} onClick={addItem}>
              + Add Expense
            </button>
          </div>

          <div className={styles.totalsSection}>
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Total Expenses</span>
                <span>{getCurrencySymbol()}{expenseData.totalAmount.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Advance Received</span>
                <input
                  type="number"
                  value={expenseData.advanceReceived}
                  onChange={(e) => updateExpenseData('advanceReceived', parseFloat(e.target.value) || 0)}
                  style={{ width: '120px' }}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={styles.totalRow}>
                <span>{expenseData.amountDue >= 0 ? 'Amount Due' : 'Amount to Return'}</span>
                <span style={{ color: expenseData.amountDue >= 0 ? '#10B981' : '#EF4444' }}>
                  {getCurrencySymbol()}{Math.abs(expenseData.amountDue).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🏦</span> Reimbursement Information
          </h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Bank Account Details (for reimbursement)</label>
              <textarea
                className={styles.textarea}
                value={expenseData.bankAccount}
                onChange={(e) => updateExpenseData('bankAccount', e.target.value)}
                placeholder="Bank Name: XYZ Bank&#10;Account Number: 1234567890&#10;Routing Number: 123456789"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Additional Notes</label>
              <textarea
                className={styles.textarea}
                value={expenseData.notes}
                onChange={(e) => updateExpenseData('notes', e.target.value)}
                placeholder="Any additional information or special instructions..."
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print Report
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1F2937', marginBottom: '8px' }}>
              EXPENSE REPORT
            </h1>
            <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
              {expenseData.reportTitle}
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Report #{expenseData.reportNumber}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
                Employee Information
              </h3>
              <p style={{ fontWeight: '600', color: '#1F2937' }}>{expenseData.employeeName || 'Employee Name'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>ID: {expenseData.employeeId || 'EMP000'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{expenseData.employeeEmail || 'email@example.com'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Department: {expenseData.department || 'N/A'}</p>
            </div>
            <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
                Report Details
              </h3>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Period: {format(new Date(expenseData.periodStart), 'MMM dd, yyyy')} - {format(new Date(expenseData.periodEnd), 'MMM dd, yyyy')}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Report Date: {format(new Date(expenseData.reportDate), 'MMM dd, yyyy')}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Approver: {expenseData.approverName || 'Manager'}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Company: {expenseData.companyName || 'Company Name'}
              </p>
            </div>
          </div>

          {expenseData.purpose && (
            <div style={{ marginBottom: '32px', padding: '16px', background: '#F0F9FF', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1E40AF', marginBottom: '8px' }}>Purpose / Business Reason</h4>
              <p style={{ margin: 0, color: '#1E40AF', fontSize: '0.875rem' }}>{expenseData.purpose}</p>
            </div>
          )}

          <div style={{ marginBottom: '32px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F3F4F6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Vendor</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.items.filter(item => item.amount > 0).map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                      {format(new Date(item.date), 'MMM dd')}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                      {item.description || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280' }}>
                      {item.vendor || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937', textAlign: 'right', fontWeight: '600' }}>
                      {getCurrencySymbol()}{item.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#10B981', textAlign: 'center' }}>
                      {item.hasReceipt ? '✓' : '✗'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
                Expense Summary by Category
              </h3>
              <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '16px' }}>
                {Object.entries(getCategoryTotals()).map(([category, total]) => (
                  <div key={category} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{category}</span>
                    <span style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '600' }}>
                      {getCurrencySymbol()}{total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
                Payment Summary
              </h3>
              <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#6B7280' }}>Total Expenses</span>
                  <span style={{ fontWeight: '600', color: '#1F2937' }}>
                    {getCurrencySymbol()}{expenseData.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#6B7280' }}>Advance Received</span>
                  <span style={{ fontWeight: '600', color: '#1F2937' }}>
                    {getCurrencySymbol()}{expenseData.advanceReceived.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #E5E7EB' }}>
                  <span style={{ fontWeight: '700', color: '#374151' }}>
                    {expenseData.amountDue >= 0 ? 'Amount Due' : 'Amount to Return'}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: '1.25rem', color: expenseData.amountDue >= 0 ? '#10B981' : '#EF4444' }}>
                    {getCurrencySymbol()}{Math.abs(expenseData.amountDue).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {expenseData.bankAccount && expenseData.amountDue > 0 && (
            <div style={{ marginBottom: '32px', padding: '16px', background: '#F0FDF4', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#047857', marginBottom: '8px' }}>Reimbursement Details</h4>
              <p style={{ margin: 0, color: '#047857', fontSize: '0.875rem', whiteSpace: 'pre-line' }}>{expenseData.bankAccount}</p>
            </div>
          )}

          {expenseData.notes && (
            <div style={{ marginBottom: '32px', padding: '16px', background: '#FEF3C7', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>Additional Notes</h4>
              <p style={{ margin: 0, color: '#92400E', fontSize: '0.875rem', whiteSpace: 'pre-line' }}>{expenseData.notes}</p>
            </div>
          )}

          <div style={{ marginTop: '64px' }}>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '48px' }}>
              I certify that the above expenses were incurred for business purposes and that all information provided is accurate and complete.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
              <div>
                <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '8px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Employee Signature</p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                    {expenseData.employeeName || 'Employee Name'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '8px' }}>
                    Date: _______________________
                  </p>
                </div>
              </div>
              <div>
                <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '8px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Approver Signature</p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                    {expenseData.approverName || 'Approver Name'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '8px' }}>
                    Date: _______________________
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}