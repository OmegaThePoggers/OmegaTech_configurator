# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
To rebuild the OmegaTech PC Configurator into a modern, highly performant React/Next.js application featuring a minimalist, dark tech UI. The system will retain and improve the 3D PC viewer, expand component selection, and offer manual, store-linked pricing (with future scope for live API integration) while maintaining a simple, Firebase-ready backend.

## Goals
1. **Modern Rewrite:** Port the vanilla HTML/JS/PHP codebase into a structured Next.js application using React components.
2. **UI Revamp:** Implement a premium "minimalist tech" dark mode aesthetic.
3. **Improved 3D Viewer:** Optimize and visually improve the existing Three.js PC builder preview.
4. **Expanded Components & Pricing:** Enhance the component list and implement manual pricing entry combined with external links to Amazon, Flipkart, and MD Computers.
5. **Backend Scalability:** Keep the backend as a simple JSON-based or lightweight local implementation for now, architected to seamlessly migrate to Firebase in the future.

## Non-Goals (Out of Scope)
- Real-time automated web scraping (anti-bot protections make this unreliable; prioritizing manual entry with API scopes).
- Implementing Firebase in Phase 1 (staying with the simplest local implementation to start).
- E-commerce checkout capabilities directly on the site.

## Users
PC enthusiasts, gamers, and customers looking to visualize and price out custom PC builds before purchasing parts from major Indian retailers (Amazon, Flipkart, MD Computers).

## Constraints
- **Technical:** Must use Next.js, React, and Three.js. 
- **Design:** Rigid requirement for a minimalist, dark tech visual style.
- **Pricing Data:** Manual entry must be easily updateable without deep code changes.

## Success Criteria
- [ ] Application successfully runs on Next.js without legacy PHP/vanilla JS dependencies.
- [ ] UI reflects a fully integrated dark tech minimalist theme across all views (Home, Builder, Summary).
- [ ] 3D viewer loads faster and looks cleaner than the legacy version.
- [ ] Component list includes pricing and direct outbound links to Amazon, Flipkart, and MD Computers.
- [ ] Configurations can be saved and loaded using a simple backend structure cleanly separated from the frontend to allow future Firebase integration.
