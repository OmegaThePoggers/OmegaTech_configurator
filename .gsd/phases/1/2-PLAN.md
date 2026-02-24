---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Core UI Layout & Navigation

## Objective
Establish the primary application layout consisting of the Navbar, Main Content Area, and Footer, adhering to the dark tech aesthetic.

## Context
- .gsd/SPEC.md
- .gsd/phases/1/RESEARCH.md
- legacy/index.html (for structural reference)

## Tasks

<task type="auto">
  <name>Generate Base shadcn/ui Components</name>
  <files>
    components/ui/button.tsx
    components/ui/card.tsx
    components/ui/separator.tsx
    components/ui/progress.tsx
    components/ui/badge.tsx
  </files>
  <action>
    - Run `npx shadcn-ui@latest add button card separator progress badge`.
    - Ensure all components are installed successfully in the `components/ui` directory.
  </action>
  <verify>ls components/ui/button.tsx</verify>
  <done>The 5 specified core UI components are generated via the CLI.</done>
</task>

<task type="auto">
  <name>Build App Layout Shell</name>
  <files>
    app/layout.tsx
    components/layout/navbar.tsx
    components/layout/footer.tsx
  </files>
  <action>
    - Create `components/layout/navbar.tsx`. Replicate the links from the legacy `index.html` (OmegaTech brand, Build PC, Saved Configs, About, Contact). Make it a sleek, dark sticky header with border-bottom (`border-zinc-800`).
    - Create `components/layout/footer.tsx` with simple copyright text.
    - Update `app/layout.tsx` to include the `<Navbar />` at the top, a `<main>` wrapper for `children` in the center, and the `<Footer />` at the bottom.
    - Apply a global flex column layout to ensure the footer sticks to the bottom (`min-h-screen flex flex-col`).
  </action>
  <verify>npm run build</verify>
  <done>Layout compiles successfully and the Navbar/Footer components are integrated.</done>
</task>

## Success Criteria
- [ ] Essential shadcn UI components (buttons, cards, progress) are installed.
- [ ] Top-level layout establishes a consistent dark mode shell with navigation.
- [ ] Build passes without TypeScript/ESLint errors.
