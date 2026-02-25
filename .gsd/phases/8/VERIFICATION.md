## Phase 8 Verification

### Must-Haves
- [x] PCViewer accepts `selectedComponents` prop — VERIFIED (PCViewerProps type with optional selectedComponents)
- [x] Each internal component shows/hides via ghost state — VERIFIED (active=false → 15% opacity, active=true → solid with emissive)
- [x] Brand-specific colors — VERIFIED (NVIDIA=0x76b900, AMD=0xed1c24, Intel=0x0071c5, default=cyan)
- [x] GPU scales by length — VERIFIED (length/240 * 1.2, clamped [1.0, 1.8])
- [x] PSU scales by wattage — VERIFIED (wattage/650 * 0.8, clamped [0.6, 1.2])
- [x] RAM renders correct # of sticks — VERIFIED (checks modules field, renders 1 or 2)
- [x] /build wires selectedComponents to PCViewer — VERIFIED (viewerComponents useMemo)
- [x] Homepage PCViewer works without props — VERIFIED (no selectedComponents = all ghosted)

### Verdict: PASS
