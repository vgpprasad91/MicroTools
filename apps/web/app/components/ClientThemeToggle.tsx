"use client";

import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(
  () => import('./ThemeToggle'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ width: '60px', height: '30px' }} />
    )
  }
);

export default function ClientThemeToggle() {
  return <ThemeToggle />;
}