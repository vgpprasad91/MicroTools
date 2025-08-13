"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

interface Milestone {
  id: string;
  phase: string;
  duration: string;
  deliverables: string;
}

interface ProposalData {
  proposalNumber: string;
  proposalDate: string;
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
  projectTitle: string;
  executiveSummary: string;
  sections: ProposalSection[];
  milestones: Milestone[];
  totalCost: number;
  currency: string;
  terms: string;
  signature: string;
}

const defaultSections: ProposalSection[] = [
  {
    id: crypto.randomUUID(),
    title: "Project Overview",
    content: ""
  },
  {
    id: crypto.randomUUID(),
    title: "Scope of Work",
    content: ""
  },
  {
    id: crypto.randomUUID(),
    title: "Methodology",
    content: ""
  },
  {
    id: crypto.randomUUID(),
    title: "Deliverables",
    content: ""
  }
];

export default function BusinessProposalGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [proposalData, setProposalData] = useState<ProposalData>({
    proposalNumber: `PROP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}001`,
    proposalDate: format(new Date(), 'yyyy-MM-dd'),
    validUntil: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
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
    projectTitle: "",
    executiveSummary: "",
    sections: defaultSections,
    milestones: [
      {
        id: crypto.randomUUID(),
        phase: "",
        duration: "",
        deliverables: ""
      }
    ],
    totalCost: 0,
    currency: "USD",
    terms: "This proposal is valid for 30 days from the date of issue. 50% advance payment required to commence work.",
    signature: ""
  });

  const updateProposalData = (field: keyof ProposalData, value: any) => {
    setProposalData(prev => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    const newSection: ProposalSection = {
      id: crypto.randomUUID(),
      title: "",
      content: ""
    };
    updateProposalData('sections', [...proposalData.sections, newSection]);
  };

  const removeSection = (id: string) => {
    updateProposalData('sections', proposalData.sections.filter(section => section.id !== id));
  };

  const updateSection = (id: string, field: keyof ProposalSection, value: string) => {
    const updatedSections = proposalData.sections.map(section => {
      if (section.id === id) {
        return { ...section, [field]: value };
      }
      return section;
    });
    updateProposalData('sections', updatedSections);
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      phase: "",
      duration: "",
      deliverables: ""
    };
    updateProposalData('milestones', [...proposalData.milestones, newMilestone]);
  };

  const removeMilestone = (id: string) => {
    updateProposalData('milestones', proposalData.milestones.filter(milestone => milestone.id !== id));
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    const updatedMilestones = proposalData.milestones.map(milestone => {
      if (milestone.id === id) {
        return { ...milestone, [field]: value };
      }
      return milestone;
    });
    updateProposalData('milestones', updatedMilestones);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Proposal_${proposalData.proposalNumber}`,
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
    
    pdf.save(`Proposal_${proposalData.proposalNumber}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Business Proposal Generator</h1>
        <p className={styles.heroSubtitle}>
          Create compelling business proposals that win clients
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Proposal Details
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Proposal Number</label>
              <input
                type="text"
                className={styles.input}
                value={proposalData.proposalNumber}
                onChange={(e) => updateProposalData('proposalNumber', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Proposal Date</label>
              <input
                type="date"
                className={styles.input}
                value={proposalData.proposalDate}
                onChange={(e) => updateProposalData('proposalDate', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Valid Until</label>
              <input
                type="date"
                className={styles.input}
                value={proposalData.validUntil}
                onChange={(e) => updateProposalData('validUntil', e.target.value)}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Project Title</label>
              <input
                type="text"
                className={styles.input}
                value={proposalData.projectTitle}
                onChange={(e) => updateProposalData('projectTitle', e.target.value)}
                placeholder="Website Redesign and Development"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>🏢</span> Your Company Information
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                className={styles.input}
                value={proposalData.companyName}
                onChange={(e) => updateProposalData('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={proposalData.companyEmail}
                onChange={(e) => updateProposalData('companyEmail', e.target.value)}
                placeholder="company@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={proposalData.companyPhone}
                onChange={(e) => updateProposalData('companyPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Website</label>
              <input
                type="url"
                className={styles.input}
                value={proposalData.companyWebsite}
                onChange={(e) => updateProposalData('companyWebsite', e.target.value)}
                placeholder="www.example.com"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={proposalData.companyAddress}
                onChange={(e) => updateProposalData('companyAddress', e.target.value)}
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
                value={proposalData.clientName}
                onChange={(e) => updateProposalData('clientName', e.target.value)}
                placeholder="Client Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company</label>
              <input
                type="text"
                className={styles.input}
                value={proposalData.clientCompany}
                onChange={(e) => updateProposalData('clientCompany', e.target.value)}
                placeholder="Client Company"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={proposalData.clientEmail}
                onChange={(e) => updateProposalData('clientEmail', e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                value={proposalData.clientPhone}
                onChange={(e) => updateProposalData('clientPhone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Address</label>
              <textarea
                className={styles.textarea}
                value={proposalData.clientAddress}
                onChange={(e) => updateProposalData('clientAddress', e.target.value)}
                placeholder="456 Client Avenue&#10;City, State 67890&#10;Country"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📝</span> Executive Summary
          </h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <textarea
                className={styles.textarea}
                value={proposalData.executiveSummary}
                onChange={(e) => updateProposalData('executiveSummary', e.target.value)}
                placeholder="Provide a brief overview of the proposal, highlighting key benefits and outcomes..."
                style={{ minHeight: '150px' }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📑</span> Proposal Sections
          </h2>
          {proposalData.sections.map((section) => (
            <div key={section.id} style={{ marginBottom: '24px', padding: '20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Section Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    placeholder="e.g., Project Overview, Methodology, Timeline"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Content</label>
                  <textarea
                    className={styles.textarea}
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    placeholder="Detailed content for this section..."
                    style={{ minHeight: '120px' }}
                  />
                </div>
              </div>
              {proposalData.sections.length > 1 && (
                <button
                  className={styles.removeItemButton}
                  onClick={() => removeSection(section.id)}
                  style={{ marginTop: '12px' }}
                >
                  Remove Section
                </button>
              )}
            </div>
          ))}
          <button className={styles.addItemButton} onClick={addSection}>
            + Add Section
          </button>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>📅</span> Timeline & Milestones
          </h2>
          <div className={styles.itemsSection}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Phase</th>
                  <th style={{ width: '20%' }}>Duration</th>
                  <th style={{ width: '45%' }}>Deliverables</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {proposalData.milestones.map((milestone) => (
                  <tr key={milestone.id}>
                    <td>
                      <input
                        type="text"
                        value={milestone.phase}
                        onChange={(e) => updateMilestone(milestone.id, 'phase', e.target.value)}
                        placeholder="Phase name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={milestone.duration}
                        onChange={(e) => updateMilestone(milestone.id, 'duration', e.target.value)}
                        placeholder="2 weeks"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={milestone.deliverables}
                        onChange={(e) => updateMilestone(milestone.id, 'deliverables', e.target.value)}
                        placeholder="Key deliverables"
                      />
                    </td>
                    <td>
                      {proposalData.milestones.length > 1 && (
                        <button
                          className={styles.removeItemButton}
                          onClick={() => removeMilestone(milestone.id)}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={styles.addItemButton} onClick={addMilestone}>
              + Add Milestone
            </button>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>💰</span> Investment & Terms
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Total Project Cost</label>
              <input
                type="number"
                className={styles.input}
                value={proposalData.totalCost}
                onChange={(e) => updateProposalData('totalCost', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Currency</label>
              <select
                className={styles.select}
                value={proposalData.currency}
                onChange={(e) => updateProposalData('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Terms & Conditions</label>
              <textarea
                className={styles.textarea}
                value={proposalData.terms}
                onChange={(e) => updateProposalData('terms', e.target.value)}
                placeholder="Payment terms, conditions, and other important notes..."
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print Proposal
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef}>
          {/* Cover Page */}
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', pageBreakAfter: 'always' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#667EEA', marginBottom: '32px' }}>
              BUSINESS PROPOSAL
            </h1>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '48px' }}>
              {proposalData.projectTitle || 'Project Title'}
            </h2>
            <div style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '1.25rem', color: '#6B7280', marginBottom: '8px' }}>Prepared for</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
                {proposalData.clientCompany || 'Client Company'}
              </p>
              <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
                {proposalData.clientName || 'Client Name'}
              </p>
            </div>
            <div style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '1.25rem', color: '#6B7280', marginBottom: '8px' }}>Prepared by</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
                {proposalData.companyName || 'Your Company'}
              </p>
            </div>
            <div style={{ fontSize: '1rem', color: '#6B7280' }}>
              <p>Proposal #{proposalData.proposalNumber}</p>
              <p>{format(new Date(proposalData.proposalDate), 'MMMM dd, yyyy')}</p>
            </div>
          </div>

          {/* Executive Summary */}
          {proposalData.executiveSummary && (
            <div style={{ marginBottom: '48px', pageBreakInside: 'avoid' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
                Executive Summary
              </h2>
              <p style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {proposalData.executiveSummary}
              </p>
            </div>
          )}

          {/* Dynamic Sections */}
          {proposalData.sections.filter(section => section.title && section.content).map((section, index) => (
            <div key={section.id} style={{ marginBottom: '48px', pageBreakInside: 'avoid' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
                {index + 1}. {section.title}
              </h2>
              <p style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {section.content}
              </p>
            </div>
          ))}

          {/* Timeline */}
          {proposalData.milestones.filter(m => m.phase).length > 0 && (
            <div style={{ marginBottom: '48px', pageBreakInside: 'avoid' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
                Project Timeline
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>Phase</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>Duration</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #E5E7EB', color: '#374151' }}>Deliverables</th>
                  </tr>
                </thead>
                <tbody>
                  {proposalData.milestones.filter(m => m.phase).map((milestone, index) => (
                    <tr key={milestone.id}>
                      <td style={{ padding: '16px 12px', borderBottom: '1px solid #E5E7EB', color: '#1F2937' }}>
                        <strong>Phase {index + 1}:</strong> {milestone.phase}
                      </td>
                      <td style={{ padding: '16px 12px', borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                        {milestone.duration}
                      </td>
                      <td style={{ padding: '16px 12px', borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                        {milestone.deliverables}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Investment */}
          <div style={{ marginBottom: '48px', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
              Investment
            </h2>
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '16px' }}>Total Project Investment</p>
              <p style={{ fontSize: '3rem', fontWeight: '900', color: '#667EEA' }}>
                {proposalData.currency === 'USD' && '$'}
                {proposalData.currency === 'EUR' && '€'}
                {proposalData.currency === 'GBP' && '£'}
                {proposalData.currency === 'INR' && '₹'}
                {proposalData.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Terms */}
          {proposalData.terms && (
            <div style={{ marginBottom: '48px', pageBreakInside: 'avoid' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
                Terms & Conditions
              </h2>
              <p style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {proposalData.terms}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div style={{ marginTop: '64px', padding: '32px', background: '#F9FAFB', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
              Next Steps
            </h3>
            <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '24px' }}>
              We're excited about the opportunity to work with you on this project. Please feel free to contact us with any questions or to discuss this proposal further.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <p style={{ fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>{proposalData.companyName || 'Your Company'}</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{proposalData.companyEmail || 'email@example.com'}</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{proposalData.companyPhone || 'Phone'}</p>
                {proposalData.companyWebsite && (
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{proposalData.companyWebsite}</p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Valid Until</p>
                <p style={{ fontWeight: '600', color: '#1F2937' }}>
                  {format(new Date(proposalData.validUntil), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}