"use client";
import { useMemo, useState } from "react";
import { numberToIndianWords } from "@ms/utils";

type FeeRow = { head: string; amount: number };

function fmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Page() {
  const [inst, setInst] = useState({ name: "ABC Public School", address: "123, Main Road, City, State - 000000" });
  const [student, setStudent] = useState({ name: "Student Name", class: "Class 10", roll: "23" });
  const [receipt, setReceipt] = useState({ number: "RCPT-001", date: new Date().toISOString().slice(0,10), mode: "Cash", ref: "" });
  const [rows, setRows] = useState<FeeRow[]>([
    { head: "Tuition Fee", amount: 1000 },
    { head: "Library Fee", amount: 200 },
  ]);

  const total = useMemo(() => rows.reduce((a, r) => a + (Number(r.amount) || 0), 0), [rows]);
  const words = useMemo(() => {
    const rupees = Math.round(total);
    return `${numberToIndianWords(rupees)} rupees only`;
  }, [total]);

  return (
    <div>
      <h1>Fee Receipt Generator</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <fieldset>
          <legend>Institution</legend>
          <input value={inst.name} onChange={e => setInst({ ...inst, name: e.target.value })} placeholder="Name" style={{ width: "100%", marginBottom: 6 }} />
          <textarea value={inst.address} onChange={e => setInst({ ...inst, address: e.target.value })} placeholder="Address" rows={3} style={{ width: "100%" }} />
        </fieldset>
        <fieldset>
          <legend>Student</legend>
          <input value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} placeholder="Student Name" style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={student.class} onChange={e => setStudent({ ...student, class: e.target.value })} placeholder="Class" />
            <input value={student.roll} onChange={e => setStudent({ ...student, roll: e.target.value })} placeholder="Roll No" />
          </div>
        </fieldset>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input value={receipt.number} onChange={e => setReceipt({ ...receipt, number: e.target.value })} placeholder="Receipt No" />
        <input type="date" value={receipt.date} onChange={e => setReceipt({ ...receipt, date: e.target.value })} />
        <input value={receipt.mode} onChange={e => setReceipt({ ...receipt, mode: e.target.value })} placeholder="Payment Mode" />
        <input value={receipt.ref} onChange={e => setReceipt({ ...receipt, ref: e.target.value })} placeholder="Reference/Txn ID" />
      </div>

      <h2 style={{ marginTop: 12 }}>Fee Heads</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Head</th>
            <th style={th}>Amount (₹)</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={tdCenter}>{i+1}</td>
              <td style={td}><input value={r.head} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, head: e.target.value }: x))} style={{ width: "100%" }} /></td>
              <td style={tdRight}><input type="number" step="0.01" value={r.amount} onChange={e => setRows(xs => xs.map((x,j)=> j===i? { ...x, amount: +e.target.value }: x))} /></td>
              <td style={tdCenter}><button onClick={() => setRows(xs => xs.filter((_,j)=>j!==i))}>✕</button></td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} style={{ padding: 6 }}>
              <button onClick={() => setRows(xs => [...xs, { head: "New Head", amount: 0 }])}>+ Add Row</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div id="print-receipt" style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <div style={{ padding: 16 }}>
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>{inst.name}</div>
          <div style={{ textAlign: "center", color: "#666" }}>{inst.address}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <div>
              <div><b>Receipt No:</b> {receipt.number}</div>
              <div><b>Date:</b> {receipt.date}</div>
            </div>
            <div>
              <div><b>Mode:</b> {receipt.mode}</div>
              {receipt.ref && <div><b>Ref:</b> {receipt.ref}</div>}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div><b>Received from:</b> {student.name} | <b>Class:</b> {student.class} | <b>Roll:</b> {student.roll}</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thPrint}>#</th>
                <th style={thPrint}>Particulars</th>
                <th style={thPrintRight}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i) => (
                <tr key={i}>
                  <td style={tdPrintCenter}>{i+1}</td>
                  <td style={tdPrint}>{r.head}</td>
                  <td style={tdPrintRight}>{fmt(r.amount)}</td>
                </tr>
              ))}
              <tr>
                <td style={tdPrint}></td>
                <td style={{ ...tdPrint, fontWeight: 700 }}>Total</td>
                <td style={{ ...tdPrintRight, fontWeight: 700 }}>{fmt(total)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 10 }}><b>Amount in Words:</b> {words}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>Receiver Signature</div>
            <div>Authorised Signatory</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      <style>{`@media print { body * { visibility: hidden; } #print-receipt, #print-receipt * { visibility: visible; } #print-receipt { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 6, background: "#fafafa" };
const td: React.CSSProperties = { borderBottom: "1px solid #f0f0f0", padding: 6 };
const tdCenter: React.CSSProperties = { ...td, textAlign: "center" };
const tdRight: React.CSSProperties = { ...td, textAlign: "right" };

const thPrint: React.CSSProperties = { ...th, background: "#f7f7f7" };
const thPrintRight: React.CSSProperties = { ...thPrint, textAlign: "right" };
const tdPrint: React.CSSProperties = { ...td };
const tdPrintCenter: React.CSSProperties = { ...td, textAlign: "center" };
const tdPrintRight: React.CSSProperties = { ...td, textAlign: "right" };

