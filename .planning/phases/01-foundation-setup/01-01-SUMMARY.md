---
phase: 01-foundation-setup
plan: 01
subsystem: infra
tags: [astro, build-config, static-assets, deep-linking]

# Dependency graph
requires:
  - phase: none
    provides: none
provides:
  - .well-known files relocated to public/ for Astro static serving
  - Build script updated for Astro compatibility
affects: [01-02, 02-routing, deployment]

# Tech tracking
tech-stack:
  added: []
  patterns: [astro-static-assets]

key-files:
  created:
    - public/.well-known/assetlinks.json
    - public/.well-known/apple-app-site-association
  modified:
    - package.json

key-decisions:
  - "Move .well-known to public/ for Astro static serving (Vite also uses public/)"
  - "Remove manual cp command from build script (static asset handling now automated)"

patterns-established:
  - "Static assets in public/ directory for framework-agnostic serving"

# Metrics
duration: 2min
completed: 2026-01-29
---

# Phase 01 Plan 01: Relocate .well-known Configuration Summary

**Deep linking configuration files moved to public/.well-known/ for Astro static asset serving**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-29T09:53:19Z
- **Completed:** 2026-01-29T09:55:00Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- Moved .well-known directory from project root to public/ for Astro compatibility
- Removed manual copy command from build script (Astro handles public/ automatically)
- Preserved Android and iOS deep linking configuration without modification

## Task Commits

Each task was committed atomically:

1. **Task 1: Move .well-known directory to public/** - `a3d07c2` (chore)

**Plan metadata:** (to be added after STATE.md update)

## Files Created/Modified
- `public/.well-known/assetlinks.json` - Android deep linking configuration (delegate_permission/common.handle_all_urls)
- `public/.well-known/apple-app-site-association` - iOS universal links configuration (applinks for /invite/accept/*)
- `package.json` - Removed manual .well-known copy from build script

## Decisions Made

**1. Move to public/ directory**
- Rationale: Astro (and current Vite setup) both serve public/ contents as static assets automatically
- Alternative considered: Keep at root and maintain manual copy - rejected because increases build complexity
- Impact: Cleaner build script, framework-agnostic static asset handling

**2. Remove manual copy command**
- Rationale: Both Vite and Astro automatically copy public/ to dist/ during build
- Impact: Simplified build process, one less manual step to maintain

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- .well-known files ready for Astro static serving
- Build script updated and ready for Astro migration
- Deep linking configuration preserved and functional
- No blockers for Phase 01 Plan 02 (Astro initialization)

**Critical note for future phases:** The apple-app-site-association file contains placeholder `YOUR_TEAM_ID` that will need to be replaced with actual Apple Team ID before iOS deep linking is tested.

---
*Phase: 01-foundation-setup*
*Completed: 2026-01-29*
