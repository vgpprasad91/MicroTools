"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface ContractClause {
  id: string;
  title: string;
  content: string;
}

interface ContractData {
  contractTitle: string;
  contractDate: string;
  effectiveDate: string;
  expirationDate: string;
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1Address: string;
  party1Email: string;
  party1Phone: string;
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2Address: string;
  party2Email: string;
  party2Phone: string;
  contractType: string;
  clauses: ContractClause[];
  governingLaw: string;
  disputeResolution: string;
  signatory1: string;
  signatory2: string;
}

const contractTypes = [
  "Service Agreement",
  "Employment Contract",
  "Non-Disclosure Agreement",
  "Partnership Agreement",
  "Vendor Agreement",
  "Consultancy Agreement",
  "License Agreement",
  "Lease Agreement",
  "Sales Agreement",
  "Freelance Contract"
];

const defaultClauses: ContractClause[] = [
  {
    id: crypto.randomUUID(),
    title: "Scope of Work",
    content: ""
  },
  {
    id: crypto.randomUUID(),
    title: "Payment Terms",
    content: ""
  },
  {
    id: crypto.randomUUID(),
    title: "Confidentiality",
    content: ""
  },
  {
    id: crypto.randomUUID(),
    title: "Termination",
    content: ""
  }
];

export default function ContractGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [contractData, setContractData] = useState<ContractData>({
    contractTitle: "",
    contractDate: format(new Date(), 'yyyy-MM-dd'),
    effectiveDate: format(new Date(), 'yyyy-MM-dd'),
    expirationDate: format(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    party1Name: "",
    party1Title: "",
    party1Company: "",
    party1Address: "",
    party1Email: "",
    party1Phone: "",
    party2Name: "",
    party2Title: "",
    party2Company: "",
    party2Address: "",
    party2Email: "",
    party2Phone: "",
    contractType: "Service Agreement",
    clauses: defaultClauses,
    governingLaw: "",
    disputeResolution: "All disputes arising out of or in connection with this agreement shall be resolved through good faith negotiations between the parties.",
    signatory1: "",
    signatory2: ""
  });

  const updateContractData = (field: keyof ContractData, value: any) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  const addClause = () => {
    const newClause: ContractClause = {
      id: crypto.randomUUID(),
      title: "",
      content: ""
    };
    updateContractData('clauses', [...contractData.clauses, newClause]);
  };

  const removeClause = (id: string) => {
    updateContractData('clauses', contractData.clauses.filter(clause => clause.id !== id));
  };

  const updateClause = (id: string, field: keyof ContractClause, value: string) => {
    const updatedClauses = contractData.clauses.map(clause => {
      if (clause.id === id) {
        return { ...clause, [field]: value };
      }
      return clause;
    });
    updateContractData('clauses', updatedClauses);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Contract_${contractData.contractTitle.replace(/\s+/g, '_')}`,
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
    
    pdf.save(`Contract_${contractData.contractTitle.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Contract & Agreement Generator</h1>
        <p className={styles.heroSubtitle}>
          Create legally structured contracts and agreements
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Contract Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contract Type</label>
              <select
                className={styles.select}
                value={contractData.contractType}
                onChange={(e) => updateContractData('contractType', e.target.value)}
              >
                {contractTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contract Title</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.contractTitle}
                onChange={(e) => updateContractData('contractTitle', e.target.value)}
                placeholder="e.g., Website Development Agreement"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contract Date</label>
              <input
                type="date"
                className={styles.input}
                value={contractData.contractDate}
                onChange={(e) => updateContractData('contractDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Effective Date</label>
              <input
                type="date"
                className={styles.input}
                value={contractData.effectiveDate}
                onChange={(e) => updateContractData('effectiveDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Expiration Date</label>
              <input
                type="date"
                className={styles.input}
                value={contractData.expirationDate}
                onChange={(e) => updateContractData('expirationDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>👤</span> First Party Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.party1Name}
                onChange={(e) => updateContractData('party1Name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title/Position</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.party1Title}
                onChange={(e) => updateContractData('party1Title', e.target.value)}
                placeholder="CEO"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.party1Company}
                onChange={(e) => updateContractData('party1Company', e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={contractData.party1Email}
                onChange={(e) => updateContractData('party1Email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={contractData.party1Phone}
                onChange={(e) => updateContractData('party1Phone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={contractData.party1Address}
                onChange={(e) => updateContractData('party1Address', e.target.value)}
                placeholder="123 Business Street&#10;City, State 12345&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>👥</span> Second Party Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.party2Name}
                onChange={(e) => updateContractData('party2Name', e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title/Position</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.party2Title}
                onChange={(e) => updateContractData('party2Title', e.target.value)}
                placeholder="Director"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.party2Company}
                onChange={(e) => updateContractData('party2Company', e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={contractData.party2Email}
                onChange={(e) => updateContractData('party2Email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={contractData.party2Phone}
                onChange={(e) => updateContractData('party2Phone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={contractData.party2Address}
                onChange={(e) => updateContractData('party2Address', e.target.value)}
                placeholder="456 Client Avenue&#10;City, State 67890&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📑</span> Contract Clauses
          </h2>
          {contractData.clauses.map((clause, index) => (
            <div key={clause.id} style={{ marginBottom: '24px', padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Clause {index + 1} Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={clause.title}
                    onChange={(e) => updateClause(clause.id, 'title', e.target.value)}
                    placeholder="e.g., Scope of Work, Payment Terms, Confidentiality"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Content</label>
                  <textarea
                    className={styles.textarea}
                    value={clause.content}
                    onChange={(e) => updateClause(clause.id, 'content', e.target.value)}
                    placeholder="Detailed clause content..."
                    style={{ minHeight: '150px' }}
                  />
                </div>
              </div>
              {contractData.clauses.length > 1 && (
                <button
                  className={styles.removeItemButton}
                  onClick={() => removeClause(clause.id)}
                  style={{ marginTop: '12px' }}
                >
                  Remove Clause
                </button>
              )}
            </div>
          ))}
          <button className={styles.addItemButton} onClick={addClause}>
            + Add Clause
          </button>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>⚖️</span> Legal Terms
          </h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Governing Law</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.governingLaw}
                onChange={(e) => updateContractData('governingLaw', e.target.value)}
                placeholder="e.g., State of California, United States"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Dispute Resolution</label>
              <textarea
                className={styles.textarea}
                value={contractData.disputeResolution}
                onChange={(e) => updateContractData('disputeResolution', e.target.value)}
                placeholder="How disputes will be resolved..."
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Signatory 1 Name</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.signatory1}
                onChange={(e) => updateContractData('signatory1', e.target.value)}
                placeholder="Name of person signing"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Signatory 2 Name</label>
              <input
                type="text"
                className={styles.input}
                value={contractData.signatory2}
                onChange={(e) => updateContractData('signatory2', e.target.value)}
                placeholder="Name of person signing"
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print Contract
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1F2937', marginBottom: '16px', textTransform: 'uppercase' }}>
              {contractData.contractType}
            </h1>
            {contractData.contractTitle && (
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#374151' }}>
                {contractData.contractTitle}
              </h2>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ color: '#374151', lineHeight: '1.8' }}>
              This {contractData.contractType} ("Agreement") is entered into as of{' '}
              <strong>{format(new Date(contractData.contractDate), 'MMMM dd, yyyy')}</strong>{' '}
              ("Agreement Date"), with an effective date of{' '}
              <strong>{format(new Date(contractData.effectiveDate), 'MMMM dd, yyyy')}</strong>{' '}
              ("Effective Date"), by and between:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
            <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
                First Party
              </h3>
              <p style={{ fontWeight: '600', color: '#374151' }}>
                {contractData.party1Name || 'Party Name'}
                {contractData.party1Title && `, ${contractData.party1Title}`}
              </p>
              {contractData.party1Company && (
                <p style={{ color: '#6B7280' }}>{contractData.party1Company}</p>
              )}
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '8px' }}>
                {contractData.party1Address || 'Address'}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                {contractData.party1Email || 'email@example.com'}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                {contractData.party1Phone || 'Phone'}
              </p>
            </div>
            <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
                Second Party
              </h3>
              <p style={{ fontWeight: '600', color: '#374151' }}>
                {contractData.party2Name || 'Party Name'}
                {contractData.party2Title && `, ${contractData.party2Title}`}
              </p>
              {contractData.party2Company && (
                <p style={{ color: '#6B7280' }}>{contractData.party2Company}</p>
              )}
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '8px' }}>
                {contractData.party2Address || 'Address'}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                {contractData.party2Email || 'email@example.com'}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                {contractData.party2Phone || 'Phone'}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ color: '#374151', lineHeight: '1.8' }}>
              WHEREAS, the parties desire to enter into this Agreement on the terms and conditions set forth herein;
            </p>
            <p style={{ color: '#374151', lineHeight: '1.8', marginTop: '16px' }}>
              NOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:
            </p>
          </div>

          {contractData.clauses.filter(clause => clause.title && clause.content).map((clause, index) => (
            <div key={clause.id} style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
                {index + 1}. {clause.title}
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {clause.content}
              </p>
            </div>
          ))}

          <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              {contractData.clauses.length + 1}. Term and Termination
            </h3>
            <p style={{ color: '#374151', lineHeight: '1.8' }}>
              This Agreement shall commence on the Effective Date and shall continue until{' '}
              <strong>{format(new Date(contractData.expirationDate), 'MMMM dd, yyyy')}</strong>,
              unless earlier terminated in accordance with the provisions of this Agreement.
            </p>
          </div>

          {contractData.governingLaw && (
            <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
                {contractData.clauses.length + 2}. Governing Law
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.8' }}>
                This Agreement shall be governed by and construed in accordance with the laws of {contractData.governingLaw}.
              </p>
            </div>
          )}

          {contractData.disputeResolution && (
            <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
                {contractData.clauses.length + 3}. Dispute Resolution
              </h3>
              <p style={{ color: '#374151', lineHeight: '1.8' }}>
                {contractData.disputeResolution}
              </p>
            </div>
          )}

          <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              {contractData.clauses.length + 4}. Entire Agreement
            </h3>
            <p style={{ color: '#374151', lineHeight: '1.8' }}>
              This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether written or oral, relating to such subject matter.
            </p>
          </div>

          <div style={{ marginTop: '64px' }}>
            <p style={{ color: '#374151', marginBottom: '48px' }}>
              IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
              <div>
                <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '8px', marginTop: '80px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {contractData.signatory1 || contractData.party1Name || 'First Party'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {contractData.party1Title && `${contractData.party1Title}, `}
                    {contractData.party1Company || 'Company'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '8px' }}>
                    Date: _______________________
                  </p>
                </div>
              </div>
              <div>
                <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '8px', marginTop: '80px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {contractData.signatory2 || contractData.party2Name || 'Second Party'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {contractData.party2Title && `${contractData.party2Title}, `}
                    {contractData.party2Company || 'Company'}
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