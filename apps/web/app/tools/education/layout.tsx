"use client";
import { EducationSidebar } from "@ms/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
      <EducationSidebar />
      <div>{children}</div>
    </div>
  );
}

