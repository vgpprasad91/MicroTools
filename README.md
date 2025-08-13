# Micro SaaS Tools Monorepo

Browser-only utilities suite (Next.js + pnpm workspaces). No database; optional tiny paywall.

## Apps & Packages
- `apps/web`: Next.js app hosting all tool routes
- `packages/ui`: Shared UI (nav, etc.)
- `packages/utils`: Shared utilities (e.g., Indian number words)

## Quick Start
1. Install pnpm: https://pnpm.io/installation
2. From repo root:
   - `pnpm install`
   - `pnpm --filter @ms/web dev`
3. Open http://localhost:3000

## Structure
```
apps/
  web/
    app/
      layout.tsx
      page.tsx
      tools/
        bill-splitter/
        case-converter/
        number-to-words/
        password/
packages/
  ui/
  utils/
```

## Education Tools
- Visit `/tools/education` after unlocking access to see 10 education utilities:
  - Fee Receipt, TC, Bonafide, Marksheet, CGPA Calculator, Percentage Calculator, Admission Form, Leaving Certificate, Character Certificate, Migration Certificate.

## Paywall (Client-side demo)
Tools are wrapped in `app/tools/layout.tsx` which checks `localStorage.ms_access` with expiry.
- Click "Unlock 24h Demo" to simulate access.
- Replace with Stripe/Razorpay callback to set access post-checkout.

## Deploy
- Vercel/Netlify supported. Add your domain, set build to `pnpm --filter @ms/web build` and start `pnpm --filter @ms/web start` (or Vercel auto).
