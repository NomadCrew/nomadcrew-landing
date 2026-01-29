---
phase: 04-react-islands-extraction
plan: 02
subsystem: ui
tags: [react, framer-motion, lucide-react, astro, island-architecture, animations]

# Dependency graph
requires:
  - phase: 04-01
    provides: React islands directory structure and extraction pattern
  - phase: 01-foundation
    provides: React integration and BaseLayout pattern
provides:
  - HeroSection React island with fadeIn animations
  - FeatureCard React island with viewport detection and hover animations
  - Icon mapping pattern for serialization safety
  - Test pages demonstrating client:idle and client:visible hydration
affects: [04-03, 04-04, 04-05, landing-page-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Icon mapping pattern for serialization safety (no function props)
    - client:idle for hero animations (not critical for immediate interactivity)
    - client:visible for below-fold feature cards (viewport-based hydration)

key-files:
  created:
    - src/components/react/HeroSection.tsx
    - src/components/react/FeatureCard.tsx
    - src/pages/test-hero.astro
    - src/pages/test-features.astro
  modified: []

key-decisions:
  - "Icon mapping pattern for FeatureCard to avoid passing React components as props (serialization issue)"
  - "client:idle for HeroSection (animations enhance UX but not critical)"
  - "client:visible for FeatureCard (below-fold content, viewport-triggered hydration)"

patterns-established:
  - "Icon mapping: Create iconMap Record mapping string names to LucideIcon components, avoiding serialization pitfalls"
  - "Test page pattern: Verify island hydration and animations in isolation before main layout integration"
  - "Hydration strategy: client:idle for hero animations, client:visible for below-fold cards"

# Metrics
duration: 3min
completed: 2026-01-29
---

# Phase 04 Plan 02: Hero and Features Extraction Summary

**HeroSection and FeatureCard React islands with viewport animations using framer-motion and icon mapping pattern for serialization safety**

## Performance

- **Duration:** 3 min 25 sec
- **Started:** 2026-01-29T17:42:22Z
- **Completed:** 2026-01-29T17:45:46Z
- **Tasks:** 3
- **Files modified:** 4 (4 created)

## Accomplishments

- Extracted HeroSection with fadeIn animations and CTA button linking to #waitlist anchor
- Extracted FeatureCard with icon mapping pattern supporting all 4 feature icons (ClipboardList, MessagesSquare, LocateFixed, Banknote)
- Created test pages demonstrating client:idle (hero) and client:visible (features) hydration strategies
- Verified all animations work correctly: fade-in, hover lift, viewport detection

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract HeroSection component** - `5d40fb4` (feat)
2. **Task 2: Extract FeatureCard component** - `a407bd9` (feat)
3. **Task 3: Create test pages for HeroSection and FeatureCard** - `ce78b07` (feat)

## Files Created/Modified

- `src/components/react/HeroSection.tsx` - Hero section with staggered fadeIn animations, CTA button with hover/tap effects
- `src/components/react/FeatureCard.tsx` - Feature card with icon mapping, viewport detection, and hover lift animation
- `src/pages/test-hero.astro` - Test page for HeroSection with client:idle directive and #waitlist anchor
- `src/pages/test-features.astro` - Test page for FeatureCard with client:visible directive and all 4 feature cards

## Decisions Made

**1. Icon mapping pattern for FeatureCard**
- **Rationale:** Research warned against passing React components as props due to serialization issues in Astro islands. Icon mapping solves this by passing string icon names and resolving to components inside the island.
- **Implementation:** `iconMap: Record<string, LucideIcon>` maps "ClipboardList", "MessagesSquare", "LocateFixed", "Banknote" to imported components
- **Verification:** TypeScript check passes, all 4 icons render correctly in test page

**2. client:idle for HeroSection**
- **Rationale:** Hero animations enhance UX but aren't critical for immediate interactivity. client:idle hydrates during browser idle time, improving initial page load.
- **Alternative considered:** client:load would hydrate immediately but delays other critical resources
- **Trade-off:** Slight animation delay (imperceptible) vs better Core Web Vitals

**3. client:visible for FeatureCard**
- **Rationale:** Feature cards are below fold, viewport-based hydration saves initial bundle size
- **Benefit:** Cards only hydrate when scrolled into view, reducing JavaScript execution for above-fold content
- **Pattern:** Matches research-recommended best practice for below-fold interactive content

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - extraction proceeded smoothly, TypeScript checks passed, test pages loaded successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- HeroSection and FeatureCard ready for integration into main landing page (Phase 5)
- Animation patterns established and verified
- Icon mapping pattern documented for future feature card additions
- Remaining islands: Waitlist form (04-03) and Footer (04-04) to extract before integration

**Blockers:** None

**Concerns:** None - all success criteria met, animations verified working

---
*Phase: 04-react-islands-extraction*
*Completed: 2026-01-29*
