"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface POItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrderData {
  poNumber: string;
  poDate: string;
  deliveryDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyTaxId: string;
  vendorName: string;
  vendorCompany: string;
  vendorAddress: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorTaxId: string;
  shipToName: string;
  shipToAddress: string;
  shipToPhone: string;
  items: POItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  total: number;
  paymentTerms: string;
  shippingMethod: string;
  notes: string;
  authorizedBy: string;
}

const paymentTermsList = [
  "Net 30",
  "Net 15",
  "Net 60",
  "Due on Receipt",
  "50% Advance, 50% on Delivery",
  "100% Advance",
  "2/10 Net 30",
  "COD (Cash on Delivery)",
  "Letter of Credit"
];

const shippingMethods = [
  "Standard Shipping",
  "Express Shipping",
  "Overnight Delivery",
  "Air Freight",
  "Sea Freight",
  "Courier Service",
  "Pickup",
  "Rail Transport",
  "Road Transport"
];

export default function PurchaseOrderGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [poData, setPOData] = useState<PurchaseOrderData>({
    poNumber: `PO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001`,
    poDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    companyTaxId: "",
    vendorName: "",
    vendorCompany: "",
    vendorAddress: "",
    vendorEmail: "",
    vendorPhone: "",
    vendorTaxId: "",
    shipToName: "",
    shipToAddress: "",
    shipToPhone: "",
    items: [
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ],
    subtotal: 0,
    tax: 0,
    taxRate: 18,
    shipping: 0,
    total: 0,
    paymentTerms: "Net 30",
    shippingMethod: "Standard Shipping",
    notes: "",
    authorizedBy: ""
  });

  const updatePOData = (field: keyof PurchaseOrderData, value: any) => {
    setPOData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'items' || field === 'taxRate' || field === 'shipping') {
        const subtotal = updated.items.reduce((sum, item) => sum + item.total, 0);
        const tax = (subtotal * updated.taxRate) / 100;
        const total = subtotal + tax + updated.shipping;
        
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
    const newItem: POItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    updatePOData('items', [...poData.items, newItem]);
  };

  const removeItem = (id: string) => {
    updatePOData('items', poData.items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof POItem, value: any) => {
    const updatedItems = poData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    updatePOData('items', updatedItems);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `PurchaseOrder_${poData.poNumber}`,
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
    pdf.save(`PurchaseOrder_${poData.poNumber}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Purchase Order Generator</h1>
        <p className={styles.heroSubtitle}>
          Create professional purchase orders for your suppliers
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Purchase Order Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>PO Number</label>
              <input
                type="text"
                className={styles.input}
                value={poData.poNumber}
                onChange={(e) => updatePOData('poNumber', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>PO Date</label>
              <input
                type="date"
                className={styles.input}
                value={poData.poDate}
                onChange={(e) => updatePOData('poDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Expected Delivery Date</label>
              <input
                type="date"
                className={styles.input}
                value={poData.deliveryDate}
                onChange={(e) => updatePOData('deliveryDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🏢</span> Buyer Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                className={styles.input}
                value={poData.companyName}
                onChange={(e) => updatePOData('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={poData.companyEmail}
                onChange={(e) => updatePOData('companyEmail', e.target.value)}
                placeholder="company@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={poData.companyPhone}
                onChange={(e) => updatePOData('companyPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tax ID / GST Number</label>
              <input
                type="text"
                className={styles.input}
                value={poData.companyTaxId}
                onChange={(e) => updatePOData('companyTaxId', e.target.value)}
                placeholder="Tax ID"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Billing Address</label>
              <textarea
                className={styles.textarea}
                value={poData.companyAddress}
                onChange={(e) => updatePOData('companyAddress', e.target.value)}
                placeholder="123 Business Street&#10;City, State 12345&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🏭</span> Vendor Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Person</label>
              <input
                type="text"
                className={styles.input}
                value={poData.vendorName}
                onChange={(e) => updatePOData('vendorName', e.target.value)}
                placeholder="Vendor Contact Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Vendor Company</label>
              <input
                type="text"
                className={styles.input}
                value={poData.vendorCompany}
                onChange={(e) => updatePOData('vendorCompany', e.target.value)}
                placeholder="Vendor Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={poData.vendorEmail}
                onChange={(e) => updatePOData('vendorEmail', e.target.value)}
                placeholder="vendor@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={poData.vendorPhone}
                onChange={(e) => updatePOData('vendorPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Vendor Tax ID</label>
              <input
                type="text"
                className={styles.input}
                value={poData.vendorTaxId}
                onChange={(e) => updatePOData('vendorTaxId', e.target.value)}
                placeholder="Vendor Tax ID"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Vendor Address</label>
              <textarea
                className={styles.textarea}
                value={poData.vendorAddress}
                onChange={(e) => updatePOData('vendorAddress', e.target.value)}
                placeholder="456 Vendor Street&#10;City, State 67890&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🚚</span> Shipping Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ship To Name</label>
              <input
                type="text"
                className={styles.input}
                value={poData.shipToName}
                onChange={(e) => updatePOData('shipToName', e.target.value)}
                placeholder="Shipping Contact Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Shipping Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={poData.shipToPhone}
                onChange={(e) => updatePOData('shipToPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Shipping Method</label>
              <select
                className={styles.select}
                value={poData.shippingMethod}
                onChange={(e) => updatePOData('shippingMethod', e.target.value)}
              >
                {shippingMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Shipping Address</label>
              <textarea
                className={styles.textarea}
                value={poData.shipToAddress}
                onChange={(e) => updatePOData('shipToAddress', e.target.value)}
                placeholder="789 Warehouse Road&#10;City, State 54321&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📦</span> Order Items
          </h2>
          <div className={styles.itemsSection}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Item Description</th>
                  <th style={{ width: '15%' }}>Quantity</th>
                  <th style={{ width: '20%' }}>Unit Price</th>
                  <th style={{ width: '20%' }}>Total</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {poData.items.map((item) => (
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
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.total}
                        readOnly
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      />
                    </td>
                    <td>
                      {poData.items.length > 1 && (
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
                <span>${poData.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Tax ({poData.taxRate}%)</span>
                <input
                  type="number"
                  value={poData.taxRate}
                  onChange={(e) => updatePOData('taxRate', parseFloat(e.target.value) || 0)}
                  style={{ width: '60px', marginLeft: '8px' }}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className={styles.totalRow}>
                <span>Tax Amount</span>
                <span>${poData.tax.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <input
                  type="number"
                  value={poData.shipping}
                  onChange={(e) => updatePOData('shipping', parseFloat(e.target.value) || 0)}
                  style={{ width: '100px' }}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${poData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📝</span> Additional Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Terms</label>
              <select
                className={styles.select}
                value={poData.paymentTerms}
                onChange={(e) => updatePOData('paymentTerms', e.target.value)}
              >
                {paymentTermsList.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Authorized By</label>
              <input
                type="text"
                className={styles.input}
                value={poData.authorizedBy}
                onChange={(e) => updatePOData('authorizedBy', e.target.value)}
                placeholder="Name of Authorizing Person"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Notes / Special Instructions</label>
              <textarea
                className={styles.textarea}
                value={poData.notes}
                onChange={(e) => updatePOData('notes', e.target.value)}
                placeholder="Add any special instructions, quality requirements, packaging details, etc."
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print PO
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef}>
          <div className={styles.previewHeader}>
            <div className={styles.companyInfo}>
              <h2>{poData.companyName || 'Your Company Name'}</h2>
              <p>{poData.companyAddress || 'Your Address'}</p>
              <p>{poData.companyEmail || 'your@email.com'}</p>
              <p>{poData.companyPhone || 'Your Phone'}</p>
              {poData.companyTaxId && <p>Tax ID: {poData.companyTaxId}</p>}
            </div>
            <div className={styles.documentInfo}>
              <h1 className={styles.documentTitle}>PURCHASE ORDER</h1>
              <div className={styles.documentMeta}>
                <p><strong>PO Number:</strong> {poData.poNumber}</p>
                <p><strong>Date:</strong> {format(new Date(poData.poDate), 'MMM dd, yyyy')}</p>
                <p><strong>Delivery Date:</strong> {format(new Date(poData.deliveryDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div className={styles.clientSection}>
              <h3>Vendor Details:</h3>
              <p><strong>{poData.vendorCompany || 'Vendor Company'}</strong></p>
              <p>{poData.vendorName || 'Contact Name'}</p>
              <p>{poData.vendorAddress || 'Vendor Address'}</p>
              <p>{poData.vendorEmail || 'vendor@email.com'}</p>
              <p>{poData.vendorPhone || 'Vendor Phone'}</p>
              {poData.vendorTaxId && <p>Tax ID: {poData.vendorTaxId}</p>}
            </div>
            <div className={styles.clientSection}>
              <h3>Ship To:</h3>
              <p><strong>{poData.shipToName || poData.companyName || 'Shipping Name'}</strong></p>
              <p>{poData.shipToAddress || poData.companyAddress || 'Shipping Address'}</p>
              <p>{poData.shipToPhone || poData.companyPhone || 'Phone'}</p>
              <p style={{ marginTop: '12px' }}><strong>Shipping Method:</strong> {poData.shippingMethod}</p>
            </div>
          </div>

          <div className={styles.itemsPreview}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Item #</th>
                  <th style={{ width: '40%' }}>Description</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Qty</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {poData.items.filter(item => item.description).map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.description}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.totalsPreview}>
            <div className={styles.totalsPreviewBox}>
              <div className={styles.totalPreviewRow}>
                <span>Subtotal</span>
                <span>${poData.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalPreviewRow}>
                <span>Tax ({poData.taxRate}%)</span>
                <span>${poData.tax.toFixed(2)}</span>
              </div>
              {poData.shipping > 0 && (
                <div className={styles.totalPreviewRow}>
                  <span>Shipping</span>
                  <span>${poData.shipping.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalPreviewRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>${poData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 8px', color: '#374151' }}><strong>Payment Terms:</strong> {poData.paymentTerms}</p>
          </div>

          {poData.notes && (
            <div className={styles.notesSection}>
              <h4>Notes / Special Instructions</h4>
              <p>{poData.notes}</p>
            </div>
          )}

          <div className={styles.signatureSection}>
            <div className={styles.signatureBox}>
              <div className={styles.signatureLine}>
                <p className={styles.signatureLabel}>Authorized By: {poData.authorizedBy || 'Purchasing Manager'}</p>
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