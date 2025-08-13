import Link from "next/link";

const tools = [
  { href: "/tools/education/fee-receipt", title: "Fee Receipt Generator", desc: "School/college fee receipts" },
  { href: "/tools/education/tc-generator", title: "TC Generator", desc: "Transfer certificate format" },
  { href: "/tools/education/bonafide", title: "Bonafide Certificate", desc: "Student bonafide certificate" },
  { href: "/tools/education/marksheet", title: "Marksheet Generator", desc: "Create academic marksheets" },
  { href: "/tools/education/cgpa-calculator", title: "CGPA Calculator", desc: "Calculate CGPA/SGPA" },
  { href: "/tools/education/percentage-calculator", title: "Percentage Calculator", desc: "Convert CGPA to percentage" },
  { href: "/tools/education/admission-form", title: "Admission Form Template", desc: "School admission forms" },
  { href: "/tools/education/leaving-certificate", title: "Leaving Certificate", desc: "School leaving certificate" },
  { href: "/tools/education/character-certificate", title: "Character Certificate", desc: "Generate character certificates" },
  { href: "/tools/education/migration-certificate", title: "Migration Certificate", desc: "University migration format" }
];

export default function Page() {
  return (
    <div>
      <h1>Education Tools</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {tools.map((t) => (
          <Link key={t.href} href={t.href} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, textDecoration: "none" }}>
            <div style={{ fontWeight: 600 }}>{t.title}</div>
            <div style={{ color: "#666", marginTop: 4 }}>{t.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

