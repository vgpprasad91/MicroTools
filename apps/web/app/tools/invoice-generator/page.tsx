"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  notes: string;
  terms: string;
}

export default function InvoiceGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001`,
    invoiceDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    clientName: "",
    clientCompany: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    items: [
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    tax: 0,
    taxRate: 18,
    discount: 0,
    total: 0,
    notes: "",
    terms: "Payment is due within 30 days"
  });

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'items' || field === 'taxRate' || field === 'discount') {
        const subtotal = updated.items.reduce((sum, item) => sum + item.amount, 0);
        const tax = (subtotal * updated.taxRate) / 100;
        const total = subtotal + tax - updated.discount;
        
        return {
          ...updated,
          subtotal,
          tax,
          total
        };
      }
      
      return updated;
    });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    updateInvoiceData('items', [...invoiceData.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateInvoiceData('items', invoiceData.items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    updateInvoiceData('items', updatedItems);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice_${invoiceData.invoiceNumber}`,
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
    pdf.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Invoice Generator</h1>
        <p className={styles.heroSubtitle}>
          Create professional invoices in minutes with our easy-to-use generator
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Invoice Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Invoice Number</label>
              <input
                type="text"
                className={styles.input}
                value={invoiceData.invoiceNumber}
                onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Invoice Date</label>
              <input
                type="date"
                className={styles.input}
                value={invoiceData.invoiceDate}
                onChange={(e) => updateInvoiceData('invoiceDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Due Date</label>
              <input
                type="date"
                className={styles.input}
                value={invoiceData.dueDate}
                onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🏢</span> Your Business Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                className={styles.input}
                value={invoiceData.companyName}
                onChange={(e) => updateInvoiceData('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={invoiceData.companyEmail}
                onChange={(e) => updateInvoiceData('companyEmail', e.target.value)}
                placeholder="company@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={invoiceData.companyPhone}
                onChange={(e) => updateInvoiceData('companyPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={invoiceData.companyAddress}
                onChange={(e) => updateInvoiceData('companyAddress', e.target.value)}
                placeholder="123 Business Street&#10;City, State 12345&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>👤</span> Client Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Client Name</label>
              <input
                type="text"
                className={styles.input}
                value={invoiceData.clientName}
                onChange={(e) => updateInvoiceData('clientName', e.target.value)}
                placeholder="Client Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company</label>
              <input
                type="text"
                className={styles.input}
                value={invoiceData.clientCompany}
                onChange={(e) => updateInvoiceData('clientCompany', e.target.value)}
                placeholder="Client Company"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={invoiceData.clientEmail}
                onChange={(e) => updateInvoiceData('clientEmail', e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={invoiceData.clientPhone}
                onChange={(e) => updateInvoiceData('clientPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={invoiceData.clientAddress}
                onChange={(e) => updateInvoiceData('clientAddress', e.target.value)}
                placeholder="456 Client Avenue&#10;City, State 67890&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📦</span> Invoice Items
          </h2>
          <div className={styles.itemsSection}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Description</th>
                  <th style={{ width: '15%' }}>Quantity</th>
                  <th style={{ width: '20%' }}>Rate</th>
                  <th style={{ width: '20%' }}>Amount</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.amount}
                        readOnly
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      />
                    </td>
                    <td>
                      {invoiceData.items.length > 1 && (
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
            <button className={styles.addItemButton} onClick={addItem}>
              + Add Item
            </button>
          </div>

          <div className={styles.totalsSection}>
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${invoiceData.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax ({invoiceData.taxRate}%)</span>
                <input
                  type="number"
                  value={invoiceData.taxRate}
                  onChange={(e) => updateInvoiceData('taxRate', parseFloat(e.target.value) || 0)}
                  style={{ width: '60px', marginLeft: '8px' }}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className={styles.totalRow}>
                <span>Tax Amount</span>
                <span>${invoiceData.tax.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Discount</span>
                <input
                  type="number"
                  value={invoiceData.discount}
                  onChange={(e) => updateInvoiceData('discount', parseFloat(e.target.value) || 0)}
                  style={{ width: '100px' }}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📝</span> Additional Information
          </h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Notes</label>
              <textarea
                className={styles.textarea}
                value={invoiceData.notes}
                onChange={(e) => updateInvoiceData('notes', e.target.value)}
                placeholder="Thank you for your business!"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Terms & Conditions</label>
              <textarea
                className={styles.textarea}
                value={invoiceData.terms}
                onChange={(e) => updateInvoiceData('terms', e.target.value)}
                placeholder="Payment is due within 30 days"
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print Invoice
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef}>
          <div className={styles.previewHeader}>
            <div className={styles.companyInfo}>
              <h2>{invoiceData.companyName || 'Your Company Name'}</h2>
              <p>{invoiceData.companyAddress || 'Your Address'}</p>
              <p>{invoiceData.companyEmail || 'your@email.com'}</p>
              <p>{invoiceData.companyPhone || 'Your Phone'}</p>
            </div>
            <div className={styles.documentInfo}>
              <h1 className={styles.documentTitle}>INVOICE</h1>
              <div className={styles.documentMeta}>
                <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
                <p><strong>Date:</strong> {format(new Date(invoiceData.invoiceDate), 'MMM dd, yyyy')}</p>
                <p><strong>Due Date:</strong> {format(new Date(invoiceData.dueDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          <div className={styles.clientSection}>
            <h3>Bill To:</h3>
            <p><strong>{invoiceData.clientName || 'Client Name'}</strong></p>
            {invoiceData.clientCompany && <p>{invoiceData.clientCompany}</p>}
            <p>{invoiceData.clientAddress || 'Client Address'}</p>
            <p>{invoiceData.clientEmail || 'client@email.com'}</p>
            <p>{invoiceData.clientPhone || 'Client Phone'}</p>
          </div>

          <div className={styles.itemsPreview}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Description</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Qty</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Rate</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.filter(item => item.description).map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>${item.rate.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.totalsPreview}>
            <div className={styles.totalsPreviewBox}>
              <div className={styles.totalPreviewRow}>
                <span>Subtotal</span>
                <span>${invoiceData.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalPreviewRow}>
                <span>Tax ({invoiceData.taxRate}%)</span>
                <span>${invoiceData.tax.toFixed(2)}</span>
              </div>
              {invoiceData.discount > 0 && (
                <div className={styles.totalPreviewRow}>
                  <span>Discount</span>
                  <span>-${invoiceData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalPreviewRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>${invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {(invoiceData.notes || invoiceData.terms) && (
            <div className={styles.notesSection}>
              {invoiceData.notes && (
                <>
                  <h4>Notes</h4>
                  <p>{invoiceData.notes}</p>
                </>
              )}
              {invoiceData.terms && (
                <>
                  <h4 style={{ marginTop: '24px' }}>Terms & Conditions</h4>
                  <p>{invoiceData.terms}</p>
                </>
              )}
            </div>
          )}

          <div className={styles.signatureSection}>
            <div className={styles.signatureBox}>
              <div className={styles.signatureLine}>
                <p className={styles.signatureLabel}>Authorized Signature</p>
              </div>
            </div>
            <div className={styles.signatureBox}>
              <div className={styles.signatureLine}>
                <p className={styles.signatureLabel}>Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}