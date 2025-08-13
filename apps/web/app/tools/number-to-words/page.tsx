"use client";
import { useState } from "react";
import { numberToIndianWords } from "@ms/utils";

export default function Page() {
  const [val, setVal] = useState("12345678");
  const num = Number(val.replace(/[, ]/g, ""));
  const words = Number.isFinite(num) ? numberToIndianWords(num) : "Invalid input";
  return (
    <div>
      <h1>Number to Words (Indian)</h1>
      <input value={val} onChange={e => setVal(e.target.value)} />
      <div style={{ marginTop: 8 }}>{words}</div>
      <button onClick={() => navigator.clipboard.writeText(words)} disabled={!words}>Copy</button>
    </div>
  );
}

