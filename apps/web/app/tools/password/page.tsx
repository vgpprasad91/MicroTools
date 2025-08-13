"use client";
import { useState } from "react";

function generatePassword(len: number, opts: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean; noAmbig: boolean; }) {
  const lowers = "abcdefghijkmnopqrstuvwxyz"; // skip l if noAmbig
  const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";  // skip O/I if noAmbig
  const digits = "23456789";                  // skip 0/1 if noAmbig
  const symbols = "!@#$%^&*()-_=+[]{};:,.?";
  let pool = "";
  if (opts.lower) pool += opts.noAmbig ? lowers : "abcdefghijklmnopqrstuvwxyz";
  if (opts.upper) pool += opts.noAmbig ? uppers : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.digits) pool += opts.noAmbig ? digits : "0123456789";
  if (opts.symbols) pool += symbols;
  if (!pool) pool = "abcdefghijklmnopqrstuvwxyz";
  const arr = crypto.getRandomValues(new Uint32Array(len));
  return Array.from({ length: len }, (_, i) => pool[arr[i] % pool.length]).join("");
}

export default function Page() {
  const [len, setLen] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: false, noAmbig: true });
  const [out, setOut] = useState("");

  return (
    <div>
      <h1>Password Generator</h1>
      <div>
        <label>Length <input type="number" min={6} max={64} value={len} onChange={e => setLen(+e.target.value)} /></label>
        {(["lower","upper","digits","symbols","noAmbig"] as const).map(k => (
          <label key={k} style={{ marginLeft: 12 }}>
            <input type="checkbox" checked={opts[k]} onChange={e => setOpts({ ...opts, [k]: e.target.checked })} /> {k}
          </label>
        ))}
        <button onClick={() => setOut(generatePassword(len, opts))} style={{ marginLeft: 12 }}>Generate</button>
      </div>
      <pre style={{ marginTop: 12, userSelect: "all" }}>{out}</pre>
      <button onClick={() => navigator.clipboard.writeText(out)} disabled={!out}>Copy</button>
    </div>
  );
}

