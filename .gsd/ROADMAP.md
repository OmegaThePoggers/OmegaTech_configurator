# ROADMAP.md

> **Current Phase**: 12
> **Milestone**: v1.2 (Liquid Glass UI Redesign)

## Must-Haves (from TODOs + new requirements)
- [x] Expanded PC parts database with accurate pricing
- [x] Enhanced compatibility checker (socket, chipset, DDR, TDP, form factor)
- [x] Dynamic 3D viewer (visual changes based on selected components)
- [x] Price comparison checkout across e-commerce sites
- [x] Razorpay payment gateway integration
- [x] Vercel deployment with production build
- [ ] Liquid Glass global UI aesthetics & responsive nav

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
**Status**: ✅ Complete
**Objective**: Populate pc-components.json with more components, accurate pricing, and detailed specs. Enhance the compatibility engine with socket, chipset, DDR generation, TDP, and form factor checks.

### Phase 8: Dynamic 3D Viewer
**Status**: ✅ Complete
**Objective**: Make the PCViewer reactive to selected components — change colors, highlight selected parts, show/hide components based on selection, and visually distinguish different brands/tiers.

### Phase 9: Price Comparison Checkout
**Status**: ✅ Complete
**Objective**: Add a "Buy" flow in the cart that compares each component's price across Amazon, Flipkart, MD Computers.

### Phase 10: Razorpay Payment Integration
**Status**: ✅ Complete
**Objective**: Integrate Razorpay payment gateway with order creation API route, checkout button, payment verification, and order confirmation page. Uses test mode keys via environment variables.

### Phase 11: Vercel Deployment
**Status**: ✅ Complete
**Objective**: Configure production build, deploy to Vercel, set up GitHub auto-deploy, and final production polish.

---

### Phase 12: Liquid Glass UI Redesign (v1.2)
**Status**: 🚧 In Progress
**Objective**: Overhaul the frontend aesthetic to feature the new "Liquid Glass" distortion effect. Implement the refractive cursor on the homepage, apply glassmorphism to components, and prepare a unified visual system.
