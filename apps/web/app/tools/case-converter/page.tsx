"use client";
import { useState } from "react";

function toTitleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
function toSentenceCase(s: string) {
  return s.toLowerCase().replace(/(^\s*[a-z]|[\.\!\?]\s+[a-z])/g, c => c.toUpperCase());
}

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <h1>Bulk Text Case Converter</h1>
      <textarea value={input} onChange={e => setInput(e.target.value)} rows={10} style={{ width: "100%" }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={() => setOutput(input.toUpperCase())}>UPPERCASE</button>
        <button onClick={() => setOutput(input.toLowerCase())} style={{ marginLeft: 8 }}>lowercase</button>
        <button onClick={() => setOutput(toTitleCase(input))} style={{ marginLeft: 8 }}>Title Case</button>
        <button onClick={() => setOutput(toSentenceCase(input))} style={{ marginLeft: 8 }}>Sentence case</button>
        <button onClick={() => {navigator.clipboard.writeText(output)}} disabled={!output} style={{ marginLeft: 8 }}>Copy</button>
      </div>
      <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{output}</pre>
    </div>
  );
}

