"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { numberToIndianWords } from "@ms/utils";

type Party = {
  name: string;
  address: string;
  state: string;
  stateCode: string; // 2-digit
  gstin: string;
};

type Item = {
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number; // per unit
  discount: number; // absolute
  gstRate: number; // %
};

function fmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function amountInWords(n: number) {
  const rupees = Math.floor(n + 0.00001);
  const paise = Math.round((n - rupees) * 100);
  const base = numberToIndianWords(rupees);
  if (paise > 0) {
    return `${base} rupees and ${numberToIndianWords(paise)} paise only`;
  }
  return `${base} rupees only`;
}

type PartyPreset = { name: string; party: Party };

export default function GSTInvoicePage() {
  const [seller, setSeller] = useState<Party>({
    name: "Your Company Pvt Ltd",
    address: "123, MG Road, Bengaluru, Karnataka, 560001",
    state: "Karnataka",
    stateCode: "29",
    gstin: "29ABCDE1234F1Z5"
  });
  const [sellerLogo, setSellerLogo] = useState<string | null>(null);
  const [buyer, setBuyer] = useState<Party>({
    name: "Customer Name",
    address: "Customer Address, City, State, 000000",
    state: "Karnataka",
    stateCode: "29",
    gstin: ""
  });
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [placeOfSupply, setPlaceOfSupply] = useState("Karnataka");
  const [items, setItems] = useState<Item[]>([
    { description: "Service/Item A", hsn: "9983", qty: 1, unit: "Nos", rate: 1000, discount: 0, gstRate: 18 },
  ]);

  // Local presets for seller/buyer
  const [sellerPresets, setSellerPresets] = useState<PartyPreset[]>([]);
  const [buyerPresets, setBuyerPresets] = useState<PartyPreset[]>([]);
  const [selSellerPresetIdx, setSelSellerPresetIdx] = useState<number>(-1);
  const [selBuyerPresetIdx, setSelBuyerPresetIdx] = useState<number>(-1);

  useEffect(() => {
    try {
      const sp = JSON.parse(localStorage.getItem("gst_seller_presets") || "[]");
      const bp = JSON.parse(localStorage.getItem("gst_buyer_presets") || "[]");
      setSellerPresets(Array.isArray(sp) ? sp : []);
      setBuyerPresets(Array.isArray(bp) ? bp : []);
    } catch {}
  }, []);

  const isInterState = useMemo(() => seller.stateCode.trim() !== buyer.stateCode.trim(), [seller.stateCode, buyer.stateCode]);

  const rows = items.map((it) => {
    const gross = it.qty * it.rate;
    const taxable = Math.max(0, gross - (it.discount || 0));
    const tax = (taxable * it.gstRate) / 100;
    const cgst = isInterState ? 0 : tax / 2;
    const sgst = isInterState ? 0 : tax / 2;
    const igst = isInterState ? tax : 0;
    const total = taxable + cgst + sgst + igst;
    return { ...it, gross, taxable, cgst, sgst, igst, total };
  });

  const totals = rows.reduce(
    (a, r) => ({
      taxable: a.taxable + r.taxable,
      cgst: a.cgst + r.cgst,
      sgst: a.sgst + r.sgst,
      igst: a.igst + r.igst,
      amount: a.amount + r.total,
    }),
    { taxable: 0, cgst: 0, sgst: 0, igst: 0, amount: 0 }
  );
  const rounded = Math.round(totals.amount);
  const roundOff = rounded - totals.amount;

  // File input refs for import & logo
  const importRef = useRef<HTMLInputElement | null>(null);
  const logoRef = useRef<HTMLInputElement | null>(null);

  function savePreset(type: "seller" | "buyer") {
    const name = prompt(`Name this ${type} preset`);
    if (!name) return;
    const preset: PartyPreset = { name, party: type === "seller" ? seller : buyer };
    if (type === "seller") {
      const next = [...sellerPresets, preset];
      setSellerPresets(next);
      localStorage.setItem("gst_seller_presets", JSON.stringify(next));
    } else {
      const next = [...buyerPresets, preset];
      setBuyerPresets(next);
      localStorage.setItem("gst_buyer_presets", JSON.stringify(next));
    }
  }

  function deletePreset(type: "seller" | "buyer") {
    const idx = type === "seller" ? selSellerPresetIdx : selBuyerPresetIdx;
    if (idx < 0) return;
    if (!confirm("Delete selected preset?")) return;
    if (type === "seller") {
      const next = sellerPresets.filter((_, i) => i !== idx);
      setSellerPresets(next);
      setSelSellerPresetIdx(-1);
      localStorage.setItem("gst_seller_presets", JSON.stringify(next));
    } else {
      const next = buyerPresets.filter((_, i) => i !== idx);
      setBuyerPresets(next);
      setSelBuyerPresetIdx(-1);
      localStorage.setItem("gst_buyer_presets", JSON.stringify(next));
    }
  }

  function exportJSON() {
    const data = { seller, buyer, invoiceNo, invoiceDate, placeOfSupply, items, sellerLogo };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceNo || "invoice"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file: File) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const obj = JSON.parse(String(fr.result || "{}"));
        if (obj.seller) setSeller(obj.seller);
        if (obj.buyer) setBuyer(obj.buyer);
        if (obj.invoiceNo) setInvoiceNo(obj.invoiceNo);
        if (obj.invoiceDate) setInvoiceDate(obj.invoiceDate);
        if (obj.placeOfSupply) setPlaceOfSupply(obj.placeOfSupply);
        if (Array.isArray(obj.items)) setItems(obj.items);
        if (typeof obj.sellerLogo === "string" || obj.sellerLogo === null) setSellerLogo(obj.sellerLogo);
      } catch {
        alert("Invalid JSON file");
      }
    };
    fr.readAsText(file);
  }

  function onLogoSelected(file: File) {
    const fr = new FileReader();
    fr.onload = () => setSellerLogo(String(fr.result));
    fr.readAsDataURL(file);
  }

  return (
    <div>
      <h1>GST Invoice Generator</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <fieldset>
          <legend>Seller</legend>
          <input placeholder="Name" value={seller.name} onChange={e => setSeller({ ...seller, name: e.target.value })} style={{ width: "100%", marginBottom: 6 }} />
          <textarea placeholder="Address" value={seller.address} onChange={e => setSeller({ ...seller, address: e.target.value })} rows={3} style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="State" value={seller.state} onChange={e => setSeller({ ...seller, state: e.target.value })} />
            <input placeholder="State Code" value={seller.stateCode} onChange={e => setSeller({ ...seller, stateCode: e.target.value })} />
            <input placeholder="GSTIN" value={seller.gstin} onChange={e => setSeller({ ...seller, gstin: e.target.value.toUpperCase() })} style={{ flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
            <button onClick={() => logoRef.current?.click()}>Upload Logo</button>
            {sellerLogo && <img src={sellerLogo} alt="logo" style={{ height: 36 }} />}
            <input ref={logoRef} type="file" accept="image/*" onChange={e => e.target.files?.[0] && onLogoSelected(e.target.files[0])} style={{ display: "none" }} />
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <select value={selSellerPresetIdx} onChange={e => { const idx = +e.target.value; setSelSellerPresetIdx(idx); if (idx>=0) setSeller(sellerPresets[idx].party); }}>
              <option value={-1}>Seller Presets</option>
              {sellerPresets.map((p, i) => <option value={i} key={i}>{p.name}</option>)}
            </select>
            <button onClick={() => savePreset("seller")}>Save as Preset</button>
            <button onClick={() => deletePreset("seller")} disabled={selSellerPresetIdx<0}>Delete</button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Buyer</legend>
          <input placeholder="Name" value={buyer.name} onChange={e => setBuyer({ ...buyer, name: e.target.value })} style={{ width: "100%", marginBottom: 6 }} />
          <textarea placeholder="Address" value={buyer.address} onChange={e => setBuyer({ ...buyer, address: e.target.value })} rows={3} style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="State" value={buyer.state} onChange={e => setBuyer({ ...buyer, state: e.target.value })} />
            <input placeholder="State Code" value={buyer.stateCode} onChange={e => setBuyer({ ...buyer, stateCode: e.target.value })} />
            <input placeholder="GSTIN (optional)" value={buyer.gstin} onChange={e => setBuyer({ ...buyer, gstin: e.target.value.toUpperCase() })} style={{ flex: 1 }} />
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <select value={selBuyerPresetIdx} onChange={e => { const idx = +e.target.value; setSelBuyerPresetIdx(idx); if (idx>=0) setBuyer(buyerPresets[idx].party); }}>
              <option value={-1}>Buyer Presets</option>
              {buyerPresets.map((p, i) => <option value={i} key={i}>{p.name}</option>)}
            </select>
            <button onClick={() => savePreset("buyer")}>Save as Preset</button>
            <button onClick={() => deletePreset("buyer")} disabled={selBuyerPresetIdx<0}>Delete</button>
          </div>
        </fieldset>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input placeholder="Invoice No." value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
        <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
        <input placeholder="Place of Supply" value={placeOfSupply} onChange={e => setPlaceOfSupply(e.target.value)} style={{ flex: 1 }} />
      </div>

      <h2 style={{ marginTop: 16 }}>Items</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={th}>Description</th>
              <th style={th}>HSN/SAC</th>
              <th style={th}>Qty</th>
              <th style={th}>Unit</th>
              <th style={th}>Rate</th>
              <th style={th}>Discount</th>
              <th style={th}>GST %</th>
              <th style={th}>Taxable</th>
              {isInterState ? <th style={th}>IGST</th> : (<><th style={th}>CGST</th><th style={th}>SGST</th></>)}
              <th style={th}>Total</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td style={tdCenter}>{i + 1}</td>
                <td style={td}><input value={it.description} onChange={e => setItems(xs => xs.map((x, j) => j===i ? { ...x, description: e.target.value } : x))} style={{ width: "100%" }} /></td>
                <td style={td}><input value={it.hsn} onChange={e => setItems(xs => xs.map((x, j) => j===i ? { ...x, hsn: e.target.value } : x))} style={{ width: "100%" }} /></td>
                <td style={tdNum}><input type="number" value={it.qty} min={0} step="0.01" onChange={e => setItems(xs => xs.map((x, j) => j===i ? { ...x, qty: +e.target.value } : x))} style={{ width: 90 }} /></td>
                <td style={td}><input value={it.unit} onChange={e => setItems(xs => xs.map((x, j) => j===i ? { ...x, unit: e.target.value } : x))} style={{ width: 90 }} /></td>
                <td style={tdNum}><input type="number" value={it.rate} min={0} step="0.01" onChange={e => setItems(xs => xs.map((x, j) => j===i ? { ...x, rate: +e.target.value } : x))} style={{ width: 110 }} /></td>
                <td style={tdNum}><input type="number" value={it.discount} min={0} step="0.01" onChange={e => setItems(xs => xs.map((x, j) => j===i ? { ...x, discount: +e.target.value } : x))} style={{ width: 110 }} /></td>
                <td style={tdNum}><input type="number" value={it.gstRate} min={0} step="0.1" onChange={e => setItems(xs => xs.map((x, j) => j===i ? { ...x, gstRate: +e.target.value } : x))} style={{ width: 90 }} /></td>
                <td style={tdNum}>{fmt(rows[i].taxable)}</td>
                {isInterState ? (
                  <td style={tdNum}>{fmt(rows[i].igst)}</td>
                ) : (
                  <>
                    <td style={tdNum}>{fmt(rows[i].cgst)}</td>
                    <td style={tdNum}>{fmt(rows[i].sgst)}</td>
                  </>
                )}
                <td style={tdNum}>{fmt(rows[i].total)}</td>
                <td style={tdCenter}><button onClick={() => setItems(xs => xs.filter((_, j) => j !== i))}>✕</button></td>
              </tr>
            ))}
            <tr>
              <td colSpan={12} style={{ padding: 8 }}>
                <button onClick={() => setItems(xs => [...xs, { description: "New Item", hsn: "", qty: 1, unit: "Nos", rate: 0, discount: 0, gstRate: 18 }])}>+ Add Item</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="invoice-print" style={{ marginTop: 20, border: "1px solid #ddd", borderRadius: 8 }}>
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>TAX INVOICE</div>
              <div>Invoice No: {invoiceNo}</div>
              <div>Date: {invoiceDate}</div>
              <div>Place of Supply: {placeOfSupply}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              {sellerLogo && <img src={sellerLogo} alt="logo" style={{ maxHeight: 60, marginBottom: 6, objectFit: "contain" }} />}
              <div style={{ fontWeight: 600 }}>{seller.name}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{seller.address}</div>
              <div>State: {seller.state} ({seller.stateCode})</div>
              <div>GSTIN: {seller.gstin}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
            <div style={{ border: "1px solid #eee", borderRadius: 6, padding: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Bill To</div>
              <div>{buyer.name}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{buyer.address}</div>
              <div>State: {buyer.state} ({buyer.stateCode})</div>
              {buyer.gstin ? <div>GSTIN: {buyer.gstin}</div> : <div>GSTIN: Unregistered</div>}
            </div>
            <div style={{ border: "1px solid #eee", borderRadius: 6, padding: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Ship To</div>
              <div>{buyer.name}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{buyer.address}</div>
              <div>State: {buyer.state} ({buyer.stateCode})</div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr>
                <th style={thPrint}>#</th>
                <th style={thPrint}>Description</th>
                <th style={thPrint}>HSN/SAC</th>
                <th style={thPrint}>Qty</th>
                <th style={thPrint}>Unit</th>
                <th style={thPrint}>Rate</th>
                <th style={thPrint}>Taxable</th>
                {isInterState ? <th style={thPrint}>IGST</th> : (<><th style={thPrint}>CGST</th><th style={thPrint}>SGST</th></>)}
                <th style={thPrint}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={tdPrintCenter}>{i + 1}</td>
                  <td style={tdPrint}>{r.description}</td>
                  <td style={tdPrintCenter}>{r.hsn}</td>
                  <td style={tdPrintCenter}>{r.qty}</td>
                  <td style={tdPrintCenter}>{r.unit}</td>
                  <td style={tdPrintRight}>₹ {fmt(r.rate)}</td>
                  <td style={tdPrintRight}>₹ {fmt(r.taxable)}</td>
                  {isInterState ? (
                    <td style={tdPrintRight}>₹ {fmt(r.igst)}</td>
                  ) : (
                    <>
                      <td style={tdPrintRight}>₹ {fmt(r.cgst)}</td>
                      <td style={tdPrintRight}>₹ {fmt(r.sgst)}</td>
                    </>
                  )}
                  <td style={tdPrintRight}>₹ {fmt(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, alignItems: "start" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 6, padding: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Amount in Words</div>
              <div style={{ minHeight: 24, fontStyle: "italic" }}>{amountInWords(rounded)}</div>
              <div style={{ marginTop: 12, fontWeight: 600 }}>Bank Details</div>
              <div>Account Name: {seller.name}</div>
              <div>Account No: __________</div>
              <div>IFSC: __________</div>
              <div>Bank: __________</div>
            </div>
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={tdPrint}>Taxable Value</td><td style={tdPrintRight}>₹ {fmt(totals.taxable)}</td></tr>
                  {!isInterState && <tr><td style={tdPrint}>Add: CGST</td><td style={tdPrintRight}>₹ {fmt(totals.cgst)}</td></tr>}
                  {!isInterState && <tr><td style={tdPrint}>Add: SGST</td><td style={tdPrintRight}>₹ {fmt(totals.sgst)}</td></tr>}
                  {isInterState && <tr><td style={tdPrint}>Add: IGST</td><td style={tdPrintRight}>₹ {fmt(totals.igst)}</td></tr>}
                  <tr><td style={tdPrint}>Round Off</td><td style={tdPrintRight}>₹ {fmt(roundOff)}</td></tr>
                  <tr><td style={{ ...tdPrint, fontWeight: 700 }}>Grand Total</td><td style={{ ...tdPrintRight, fontWeight: 700 }}>₹ {fmt(rounded)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Notes</div>
              <div>1. Goods once sold will not be taken back.</div>
              <div>2. E.&O.E</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: 40 }}>For {seller.name}</div>
              <div>Authorised Signatory</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={() => window.print()}>Print / Save PDF</button>
        <button onClick={exportJSON}>Export JSON</button>
        <button onClick={() => importRef.current?.click()}>Import JSON</button>
        <input ref={importRef} type="file" accept="application/json" style={{ display: "none" }} onChange={e => e.target.files?.[0] && importJSON(e.target.files[0])} />
      </div>

      <style>{`@media print {
        body * { visibility: hidden; }
        #invoice-print, #invoice-print * { visibility: visible; }
        #invoice-print { position: fixed; left: 0; top: 0; width: 100%; }
        a[href]:after { content: none !important; }
        button { display: none !important; }
      }`}</style>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 6, background: "#fafafa" };
const td: React.CSSProperties = { borderBottom: "1px solid #f0f0f0", padding: 6 };
const tdNum: React.CSSProperties = { ...td, textAlign: "right", whiteSpace: "nowrap" };
const tdCenter: React.CSSProperties = { ...td, textAlign: "center" };

const thPrint: React.CSSProperties = { ...th, background: "#f7f7f7" };
const tdPrint: React.CSSProperties = { ...td };
const tdPrintRight: React.CSSProperties = { ...td, textAlign: "right" };
const tdPrintCenter: React.CSSProperties = { ...td, textAlign: "center" };
