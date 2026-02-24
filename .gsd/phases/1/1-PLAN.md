---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Base Next.js Scaffolding & Theme

## Objective
Initialize the Next.js application, configure Tailwind CSS, and set up the foundation for the "dark tech minimalist" UI using shadcn/ui. 

## Context
- .gsd/SPEC.md
- .gsd/phases/1/RESEARCH.md

## Tasks

<task type="auto">
  <name>Initialize Next.js App</name>
  <files>
    package.json
    next.config.mjs
    tsconfig.json
    app/layout.tsx
    app/page.tsx
  </files>
  <action>
    - Ensure you are in `/home/omegafied/projects/OmegaTech_configurator`.
    - Note: The current directory has existing vanilla JS/PHP/HTML code. Do NOT delete the legacy code yet. We will build the Next.js app around it or move legacy files to a `legacy/` folder if there are conflicts.
    - Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*"` (force it if necessary, or move conflicting files to a `legacy` folder first).
    - If `package.json` creation conflicts with legacy files, create a `legacy/` dir, `git mv` the `*.html`, `*.js`, `*.php`, `*.css`, and `assets/` into it before running the Next.js init command.
    - Validate Next.js starts up successfully.
  </action>
  <verify>npm run build</verify>
  <done>Next.js app compiles successfully with NO typescript or ESLint errors.</done>
</task>

<task type="auto">
  <name>Install shadcn/ui and Force Dark Theme</name>
  <files>
    components.json
    tailwind.config.ts
    app/globals.css
    app/layout.tsx
  </files>
  <action>
    - Run `npx shadcn-ui@latest init` configured for New York style, Zinc color, css variables true.
    - Modify `app/globals.css` to rigidly enforce a "dark tech minimalist" aesthetic. Set the background to a very dark gray/black (e.g. `bg-zinc-950`) and text to a high-contrast white/gray (e.g. `text-zinc-50`).
    - Remove the light mode CSS variables entirely or force the `dark` class on the `<html>` tag in `app/layout.tsx` so the app is permanently in dark mode.
    - Update `layout.tsx` metadata to title "OmegaTech Configurator" and description "Build Your PC".
  </action>
  <verify>grep -q 'class="dark"' app/layout.tsx || grep -q 'className="dark"' app/layout.tsx</verify>
  <done>shadcn/ui is configured, `globals.css` contains strict dark mode variables, and `layout.tsx` forces the dark theme.</done>
</task>

## Success Criteria
- [ ] A functioning Next.js 14+ App Router project exists in the root.
- [ ] Legacy code is safely stashed in a `legacy/` directory to prevent conflicts.
- [ ] Tailwind CSS and shadcn/ui are fully configured.
- [ ] The application is permanently set to a dark theme.
