"use client";

import { useState, useRef } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import styles from "../business-docs.module.css";

interface TimeEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  startTime: string;
  endTime: string;
  hours: number;
  description: string;
}

interface TimesheetData {
  employeeName: string;
  employeeId: string;
  employeeEmail: string;
  department: string;
  supervisorName: string;
  supervisorEmail: string;
  companyName: string;
  companyAddress: string;
  weekStartDate: Date;
  payPeriod: string;
  entries: TimeEntry[];
  totalHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  notes: string;
}

const generateTimeEntries = (weekStart: Date): TimeEntry[] => {
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 })
  });

  return days.map(date => ({
    id: crypto.randomUUID(),
    date: format(date, 'yyyy-MM-dd'),
    project: "",
    task: "",
    startTime: "09:00",
    endTime: "17:00",
    hours: 0,
    description: ""
  }));
};

export default function TimesheetGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  const [timesheetData, setTimesheetData] = useState<TimesheetData>({
    employeeName: "",
    employeeId: "",
    employeeEmail: "",
    department: "",
    supervisorName: "",
    supervisorEmail: "",
    companyName: "",
    companyAddress: "",
    weekStartDate: currentWeekStart,
    payPeriod: `${format(currentWeekStart, 'MMM dd')} - ${format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM dd, yyyy')}`,
    entries: generateTimeEntries(currentWeekStart),
    totalHours: 0,
    overtimeHours: 0,
    regularRate: 0,
    overtimeRate: 0,
    notes: ""
  });

  const updateTimesheetData = (field: keyof TimesheetData, value: any) => {
    setTimesheetData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'entries') {
        const totalHours = updated.entries.reduce((sum, entry) => sum + entry.hours, 0);
        const overtimeHours = Math.max(0, totalHours - 40);
        
        return {
          ...updated,
          totalHours,
          overtimeHours
        };
      }
      
      return updated;
    });
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = direction === 'next' 
      ? addWeeks(timesheetData.weekStartDate, 1)
      : subWeeks(timesheetData.weekStartDate, 1);
    
    const newPayPeriod = `${format(newWeekStart, 'MMM dd')} - ${format(endOfWeek(newWeekStart, { weekStartsOn: 1 }), 'MMM dd, yyyy')}`;
    
    updateTimesheetData('weekStartDate', newWeekStart);
    updateTimesheetData('payPeriod', newPayPeriod);
    updateTimesheetData('entries', generateTimeEntries(newWeekStart));
  };

  const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const diffMinutes = endMinutes - startMinutes;
    return Math.max(0, diffMinutes / 60);
  };

  const updateEntry = (id: string, field: keyof TimeEntry, value: any) => {
    const updatedEntries = timesheetData.entries.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        
        if (field === 'startTime' || field === 'endTime') {
          updated.hours = calculateHours(
            field === 'startTime' ? value : entry.startTime,
            field === 'endTime' ? value : entry.endTime
          );
        }
        
        return updated;
      }
      return entry;
    });
    updateTimesheetData('entries', updatedEntries);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Timesheet_${timesheetData.employeeName}_${format(timesheetData.weekStartDate, 'yyyy-MM-dd')}`,
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
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Timesheet_${timesheetData.employeeName}_${format(timesheetData.weekStartDate, 'yyyy-MM-dd')}.pdf`);
  };

  const getDayName = (dateString: string) => {
    return format(new Date(dateString), 'EEEE');
  };

  const getRegularHours = () => Math.min(40, timesheetData.totalHours);
  const getTotalPay = () => {
    const regularPay = getRegularHours() * timesheetData.regularRate;
    const overtimePay = timesheetData.overtimeHours * timesheetData.overtimeRate;
    return regularPay + overtimePay;
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Timesheet Generator</h1>
        <p className={styles.heroSubtitle}>
          Track work hours and generate professional timesheets
        </p>
      </div>

      <div className={styles.mainContent}>
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
                value={timesheetData.employeeName}
                onChange={(e) => updateTimesheetData('employeeName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Employee ID</label>
              <input
                type="text"
                className={styles.input}
                value={timesheetData.employeeId}
                onChange={(e) => updateTimesheetData('employeeId', e.target.value)}
                placeholder="EMP001"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={timesheetData.employeeEmail}
                onChange={(e) => updateTimesheetData('employeeEmail', e.target.value)}
                placeholder="employee@example.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Department</label>
              <input
                type="text"
                className={styles.input}
                value={timesheetData.department}
                onChange={(e) => updateTimesheetData('department', e.target.value)}
                placeholder="Engineering"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Supervisor Name</label>
              <input
                type="text"
                className={styles.input}
                value={timesheetData.supervisorName}
                onChange={(e) => updateTimesheetData('supervisorName', e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Supervisor Email</label>
              <input
                type="email"
                className={styles.input}
                value={timesheetData.supervisorEmail}
                onChange={(e) => updateTimesheetData('supervisorEmail', e.target.value)}
                placeholder="supervisor@example.com"
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
                value={timesheetData.companyName}
                onChange={(e) => updateTimesheetData('companyName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Company Address</label>
              <textarea
                className={styles.textarea}
                value={timesheetData.companyAddress}
                onChange={(e) => updateTimesheetData('companyAddress', e.target.value)}
                placeholder="123 Business Street&#10;City, State 12345"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
              <span>📅</span> Week: {timesheetData.payPeriod}
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => changeWeek('prev')}
                style={{ padding: '8px 16px' }}
              >
                ← Previous Week
              </button>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => changeWeek('next')}
                style={{ padding: '8px 16px' }}
              >
                Next Week →
              </button>
            </div>
          </div>

          <div className={styles.itemsSection}>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>Date</th>
                    <th style={{ width: '10%' }}>Day</th>
                    <th style={{ width: '15%' }}>Project</th>
                    <th style={{ width: '15%' }}>Task</th>
                    <th style={{ width: '10%' }}>Start</th>
                    <th style={{ width: '10%' }}>End</th>
                    <th style={{ width: '8%' }}>Hours</th>
                    <th style={{ width: '20%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheetData.entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{format(new Date(entry.date), 'MMM dd')}</td>
                      <td>{getDayName(entry.date)}</td>
                      <td>
                        <input
                          type="text"
                          value={entry.project}
                          onChange={(e) => updateEntry(entry.id, 'project', e.target.value)}
                          placeholder="Project"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.task}
                          onChange={(e) => updateEntry(entry.id, 'task', e.target.value)}
                          placeholder="Task"
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          value={entry.startTime}
                          onChange={(e) => updateEntry(entry.id, 'startTime', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          value={entry.endTime}
                          onChange={(e) => updateEntry(entry.id, 'endTime', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={entry.hours.toFixed(2)}
                          readOnly
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', textAlign: 'center' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.description}
                          onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                          placeholder="Work done"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.totalsSection}>
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Regular Hours (≤40)</span>
                <span>{getRegularHours().toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Overtime Hours</span>
                <span>{timesheetData.overtimeHours.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total Hours</span>
                <span>{timesheetData.totalHours.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <span>💰</span> Pay Information (Optional)
          </h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Regular Rate ($/hr)</label>
              <input
                type="number"
                className={styles.input}
                value={timesheetData.regularRate}
                onChange={(e) => updateTimesheetData('regularRate', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Overtime Rate ($/hr)</label>
              <input
                type="number"
                className={styles.input}
                value={timesheetData.overtimeRate}
                onChange={(e) => updateTimesheetData('overtimeRate', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Notes</label>
              <textarea
                className={styles.textarea}
                value={timesheetData.notes}
                onChange={(e) => updateTimesheetData('notes', e.target.value)}
                placeholder="Any additional notes or comments..."
              />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handlePrint}>
            <span>🖨️</span> Print Timesheet
          </button>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={downloadPDF}>
            <span>📥</span> Download PDF
          </button>
        </div>

        <div className={styles.previewSection} ref={printRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1F2937', marginBottom: '8px' }}>
              TIMESHEET
            </h1>
            <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
              Pay Period: {timesheetData.payPeriod}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
                Employee Information
              </h3>
              <p style={{ fontWeight: '600', color: '#1F2937' }}>{timesheetData.employeeName || 'Employee Name'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>ID: {timesheetData.employeeId || 'EMP000'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{timesheetData.employeeEmail || 'email@example.com'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Department: {timesheetData.department || 'N/A'}</p>
            </div>
            <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
                Company Information
              </h3>
              <p style={{ fontWeight: '600', color: '#1F2937' }}>{timesheetData.companyName || 'Company Name'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', whiteSpace: 'pre-line' }}>
                {timesheetData.companyAddress || 'Company Address'}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '8px' }}>
                Supervisor: {timesheetData.supervisorName || 'N/A'}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '32px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F3F4F6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Day</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Project</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Task</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Start</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>End</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Hours</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {timesheetData.entries.filter(entry => entry.hours > 0).map((entry) => (
                  <tr key={entry.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                      {format(new Date(entry.date), 'MMM dd')}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280' }}>
                      {getDayName(entry.date)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                      {entry.project || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937' }}>
                      {entry.task || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280', textAlign: 'center' }}>
                      {entry.startTime}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280', textAlign: 'center' }}>
                      {entry.endTime}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#1F2937', textAlign: 'center', fontWeight: '600' }}>
                      {entry.hours.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#6B7280' }}>
                      {entry.description || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '24px', minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6B7280' }}>Regular Hours</span>
                <span style={{ fontWeight: '600', color: '#1F2937' }}>{getRegularHours().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6B7280' }}>Overtime Hours</span>
                <span style={{ fontWeight: '600', color: '#1F2937' }}>{timesheetData.overtimeHours.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px solid #E5E7EB' }}>
                <span style={{ fontWeight: '700', color: '#374151' }}>Total Hours</span>
                <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#667EEA' }}>
                  {timesheetData.totalHours.toFixed(2)}
                </span>
              </div>
              {timesheetData.regularRate > 0 && (
                <>
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Regular Pay ({getRegularHours().toFixed(2)} × ${timesheetData.regularRate})</span>
                      <span style={{ color: '#1F2937' }}>${(getRegularHours() * timesheetData.regularRate).toFixed(2)}</span>
                    </div>
                    {timesheetData.overtimeHours > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Overtime Pay ({timesheetData.overtimeHours.toFixed(2)} × ${timesheetData.overtimeRate})</span>
                        <span style={{ color: '#1F2937' }}>${(timesheetData.overtimeHours * timesheetData.overtimeRate).toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #E5E7EB' }}>
                      <span style={{ fontWeight: '700', color: '#374151' }}>Total Pay</span>
                      <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#10B981' }}>
                        ${getTotalPay().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {timesheetData.notes && (
            <div style={{ marginBottom: '32px', padding: '16px', background: '#F0F9FF', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1E40AF', marginBottom: '8px' }}>Notes</h4>
              <p style={{ margin: 0, color: '#1E40AF', fontSize: '0.875rem', whiteSpace: 'pre-line' }}>{timesheetData.notes}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginTop: '64px' }}>
            <div>
              <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Employee Signature</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                  {timesheetData.employeeName || 'Employee Name'}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '8px' }}>
                  Date: _______________________
                </p>
              </div>
            </div>
            <div>
              <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Supervisor Approval</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                  {timesheetData.supervisorName || 'Supervisor Name'}
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
  );
}