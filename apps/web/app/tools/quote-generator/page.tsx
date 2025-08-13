"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface QuoteData {
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite: string;
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  notes: string;
  terms: string;
  validity: string;
}

export default function QuoteGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoteNumber: `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001`,
    quoteDate: format(new Date(), 'yyyy-MM-dd'),
    validUntil: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    clientName: "",
    clientCompany: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    projectName: "",
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
    terms: "This quotation is valid for 15 days from the date of issue.",
    validity: "15 days"
  });

  const updateQuoteData = (field: keyof QuoteData, value: any) => {
    setQuoteData(prev => {
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
    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    updateQuoteData('items', [...quoteData.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateQuoteData('items', quoteData.items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    const updatedItems = quoteData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    updateQuoteData('items', updatedItems);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Quote_${quoteData.quoteNumber}`,
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
    pdf.save(`Quote_${quoteData.quoteNumber}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Quote & Estimate Generator</h1>
        <p className={styles.heroSubtitle}>
          Create professional quotes and estimates to win more business
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Quote Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Quote Number</label>
              <input
                type="text"
                className={styles.input}
                value={quoteData.quoteNumber}
                onChange={(e) => updateQuoteData('quoteNumber', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Quote Date</label>
              <input
                type="date"
                className={styles.input}
                value={quoteData.quoteDate}
                onChange={(e) => updateQuoteData('quoteDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Valid Until</label>
              <input
                type="date"
                className={styles.input}
                value={quoteData.validUntil}
                onChange={(e) => updateQuoteData('validUntil', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Project Name</label>
              <input
                type="text"
                className={styles.input}
                value={quoteData.projectName}
                onChange={(e) => updateQuoteData('projectName', e.target.value)}
                placeholder="Website Redesign Project"
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
                value={quoteData.companyName}
                onChange={(e) => updateQuoteData('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={quoteData.companyEmail}
                onChange={(e) => updateQuoteData('companyEmail', e.target.value)}
                placeholder="company@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={quoteData.companyPhone}
                onChange={(e) => updateQuoteData('companyPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Website</label>
              <input
                type="url"
                className={styles.input}
                value={quoteData.companyWebsite}
                onChange={(e) => updateQuoteData('companyWebsite', e.target.value)}
                placeholder="www.example.com"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={quoteData.companyAddress}
                onChange={(e) => updateQuoteData('companyAddress', e.target.value)}
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
              <label className={styles.label}>Contact Person</label>
              <input
                type="text"
                className={styles.input}
                value={quoteData.clientName}
                onChange={(e) => updateQuoteData('clientName', e.target.value)}
                placeholder="Client Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company</label>
              <input
                type="text"
                className={styles.input}
                value={quoteData.clientCompany}
                onChange={(e) => updateQuoteData('clientCompany', e.target.value)}
                placeholder="Client Company"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={quoteData.clientEmail}
                onChange={(e) => updateQuoteData('clientEmail', e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={quoteData.clientPhone}
                onChange={(e) => updateQuoteData('clientPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={quoteData.clientAddress}
                onChange={(e) => updateQuoteData('clientAddress', e.target.value)}
                placeholder="456 Client Avenue&#10;City, State 67890&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📦</span> Services / Products
          </h2>
          <div className={styles.itemsSection}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Description</th>
                  <th style={{ width: '15%' }}>Quantity</th>
                  <th style={{ width: '20%' }}>Unit Price</th>
                  <th style={{ width: '20%' }}>Amount</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {quoteData.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Service/Product description"
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
                      {quoteData.items.length > 1 && (
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
                <span>${quoteData.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax ({quoteData.taxRate}%)</span>
                <input
                  type="number"
                  value={quoteData.taxRate}
                  onChange={(e) => updateQuoteData('taxRate', parseFloat(e.target.value) || 0)}
                  style={{ width: '60px', marginLeft: '8px' }}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className={styles.totalRow}>
                <span>Tax Amount</span>
                <span>${quoteData.tax.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Discount</span>
                <input
                  type="number"
                  value={quoteData.discount}
                  onChange={(e) => updateQuoteData('discount', parseFloat(e.target.value) || 0)}
                  style={{ width: '100px' }}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${quoteData.total.toFixed(2)}</span>
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
              <label className={styles.label}>Notes / Special Instructions</label>
              <textarea
                className={styles.textarea}
                value={quoteData.notes}
                onChange={(e) => updateQuoteData('notes', e.target.value)}
                placeholder="Add any special notes, timeline, deliverables, etc."
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Terms & Conditions</label>
              <textarea
                className={styles.textarea}
                value={quoteData.terms}
                onChange={(e) => updateQuoteData('terms', e.target.value)}
                placeholder="This quotation is valid for 15 days from the date of issue."
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print Quote
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef}>
          <div style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', padding: '40px', marginBottom: '40px', borderRadius: '16px 16px 0 0' }}>
            <div className={styles.previewHeader} style={{ background: 'transparent' }}>
              <div className={styles.companyInfo}>
                <h2 style={{ color: 'white' }}>{quoteData.companyName || 'Your Company Name'}</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{quoteData.companyAddress || 'Your Address'}</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{quoteData.companyEmail || 'your@email.com'}</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{quoteData.companyPhone || 'Your Phone'}</p>
                {quoteData.companyWebsite && <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{quoteData.companyWebsite}</p>}
              </div>
              <div className={styles.documentInfo}>
                <h1 className={styles.documentTitle} style={{ color: 'white' }}>QUOTATION</h1>
                <div className={styles.documentMeta} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <p><strong style={{ color: 'white' }}>Quote #:</strong> {quoteData.quoteNumber}</p>
                  <p><strong style={{ color: 'white' }}>Date:</strong> {format(new Date(quoteData.quoteDate), 'MMM dd, yyyy')}</p>
                  <p><strong style={{ color: 'white' }}>Valid Until:</strong> {format(new Date(quoteData.validUntil), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>

          {quoteData.projectName && (
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ color: '#667EEA', fontSize: '1.75rem', fontWeight: '700' }}>
                {quoteData.projectName}
              </h2>
            </div>
          )}

          <div className={styles.clientSection}>
            <h3>Prepared For:</h3>
            <p><strong>{quoteData.clientName || 'Client Name'}</strong></p>
            {quoteData.clientCompany && <p>{quoteData.clientCompany}</p>}
            <p>{quoteData.clientAddress || 'Client Address'}</p>
            <p>{quoteData.clientEmail || 'client@email.com'}</p>
            <p>{quoteData.clientPhone || 'Client Phone'}</p>
          </div>

          <div className={styles.itemsPreview}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Description</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Qty</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {quoteData.items.filter(item => item.description).map((item) => (
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
                <span>${quoteData.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalPreviewRow}>
                <span>Tax ({quoteData.taxRate}%)</span>
                <span>${quoteData.tax.toFixed(2)}</span>
              </div>
              {quoteData.discount > 0 && (
                <div className={styles.totalPreviewRow}>
                  <span>Discount</span>
                  <span>-${quoteData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalPreviewRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>${quoteData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {(quoteData.notes || quoteData.terms) && (
            <div className={styles.notesSection}>
              {quoteData.notes && (
                <>
                  <h4>Notes</h4>
                  <p>{quoteData.notes}</p>
                </>
              )}
              {quoteData.terms && (
                <>
                  <h4 style={{ marginTop: '24px' }}>Terms & Conditions</h4>
                  <p>{quoteData.terms}</p>
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
                <p className={styles.signatureLabel}>Client Acceptance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}