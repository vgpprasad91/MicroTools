"use client";
import Link from "next/link";

const eduTools = [
  { href: "/tools/education/fee-receipt", label: "Fee Receipt Generator" },
  { href: "/tools/education/tc-generator", label: "TC Generator" },
  { href: "/tools/education/bonafide", label: "Bonafide Certificate" },
  { href: "/tools/education/marksheet", label: "Marksheet Generator" },
  { href: "/tools/education/cgpa-calculator", label: "CGPA Calculator" },
  { href: "/tools/education/percentage-calculator", label: "Percentage Calculator" },
  { href: "/tools/education/admission-form", label: "Admission Form Template" },
  { href: "/tools/education/leaving-certificate", label: "Leaving Certificate" },
  { href: "/tools/education/character-certificate", label: "Character Certificate" },
  { href: "/tools/education/migration-certificate", label: "Migration Certificate" }
];

export function EducationSidebar() {
  return (
    <aside style={{ minWidth: 260, borderRight: "1px solid #eee", paddingRight: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Education Tools</div>
      <div style={{ display: "grid", gap: 6 }}>
        {eduTools.map((t) => (
          <Link key={t.href} href={t.href} style={{ textDecoration: "none" }}>{t.label}</Link>
        ))}
      </div>
    </aside>
  );
}

