"use client";
import Link from "next/link";
import React from "react";

export function Nav() {
  const items = [
    { href: "/", label: "Home" },
    { href: "/tools/password", label: "Password" },
    { href: "/tools/case-converter", label: "Case Converter" },
    { href: "/tools/number-to-words", label: "Number → Words" },
    { href: "/tools/bill-splitter", label: "Bill Splitter" },
    { href: "/tools/gst-invoice", label: "GST Invoice" },
    { href: "/tools/education", label: "Education" }
  ];
  return (
    <nav style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #eee" }}>
      {items.map((i) => (
        <Link key={i.href} href={i.href} style={{ textDecoration: "none" }}>{i.label}</Link>
      ))}
    </nav>
  );
}
