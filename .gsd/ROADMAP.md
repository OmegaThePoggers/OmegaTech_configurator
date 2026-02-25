# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.1 (Refinement, Backend & Deployment)

## Must-Haves (from TODOs + new requirements)
- [ ] Expanded PC parts database with accurate pricing
- [ ] Enhanced compatibility checker (socket, chipset, DDR, TDP, form factor)
- [ ] Dynamic 3D viewer (visual changes based on selected components)
- [ ] Price comparison checkout across e-commerce sites
- [ ] Vercel deployment with production build

## Phases

### Phase 1: Setup & Design System
**Status**: ✅ Complete (v1.0)
**Objective**: Scaffold the Next.js application and implement the core theme/layout.
**Requirements**: REQ-01, REQ-02

### Phase 2: Component Architecture & Routing
**Status**: ✅ Complete (v1.0)
**Objective**: Migrate static pages and build reusable React UI components.
**Requirements**: REQ-03

### Phase 3: Configurator Logic & Data
**Status**: ✅ Complete (v1.0)
**Objective**: Build the config engine, update component JSON with store links, and handle compatibility.
**Requirements**: REQ-05, REQ-06, REQ-08

### Phase 4: Filtering & Shopping Cart
**Status**: ✅ Complete (v1.0)
**Objective**: Create a browsable component catalog with filtering and a shopping cart system.
**Requirements**: REQ-09, REQ-10

### Phase 5: 3D Viewer Integration
**Status**: ✅ Complete (v1.0)
**Objective**: Port and optimize the Three.js viewer into a React component.
**Requirements**: REQ-04

### Phase 6: Backend & Polish
**Status**: ✅ Complete (v1.0)
**Objective**: Implement save feature and finalize UI/UX.
**Requirements**: REQ-07

---

### Phase 7: Expanded Parts Database & Compatibility
**Status**: ⬜ Not Started
**Objective**: Populate pc-components.json with more components, accurate pricing, and detailed specs. Enhance the compatibility engine with socket, chipset, DDR generation, TDP, and form factor checks.

### Phase 8: Dynamic 3D Viewer
**Status**: ⬜ Not Started
**Objective**: Make the PCViewer reactive to selected components — change colors, highlight selected parts, show/hide components based on selection, and visually distinguish different brands/tiers.

### Phase 9: Price Comparison Checkout
**Status**: ⬜ Not Started
**Objective**: Add a "Buy" flow in the cart that compares each component's price across Amazon, Flipkart, Newegg, MD Computers, with a "Buy from OmegaTech" native option.

### Phase 10: Vercel Deployment
**Status**: ⬜ Not Started
**Objective**: Configure production build, deploy to Vercel, set up GitHub auto-deploy, and final production polish.
