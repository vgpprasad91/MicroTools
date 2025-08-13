"use client";
import { useMemo, useState } from "react";

export default function Page() {
  const [cgpa, setCgpa] = useState(8.5);
  const [factor, setFactor] = useState(9.5); // CBSE common
  const [marks, setMarks] = useState({ obtained: 450, outOf: 500 });

  const percentageFromCgpa = useMemo(() => cgpa * factor, [cgpa, factor]);
  const percentageFromMarks = useMemo(() => marks.outOf ? (marks.obtained / marks.outOf) * 100 : 0, [marks]);

  return (
    <div>
      <h1>Percentage Calculator</h1>
      <fieldset>
        <legend>CGPA → Percentage</legend>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" step="0.01" value={cgpa} onChange={e => setCgpa(+e.target.value)} placeholder="CGPA" />
          <input type="number" step="0.1" value={factor} onChange={e => setFactor(+e.target.value)} placeholder="Factor (e.g., 9.5)" />
          <div>= {percentageFromCgpa.toFixed(2)}%</div>
        </div>
        <div style={{ color: "#666", marginTop: 6 }}>Note: Factor varies by board/university; confirm your scheme.</div>
      </fieldset>

      <fieldset style={{ marginTop: 12 }}>
        <legend>Marks → Percentage</legend>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" value={marks.obtained} onChange={e => setMarks({ ...marks, obtained: +e.target.value })} placeholder="Obtained" />
          <input type="number" value={marks.outOf} onChange={e => setMarks({ ...marks, outOf: +e.target.value })} placeholder="Out of" />
          <div>= {percentageFromMarks.toFixed(2)}%</div>
        </div>
      </fieldset>
    </div>
  );
}

