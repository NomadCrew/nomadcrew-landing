---
phase: 05-landing-page-assembly
plan: 02
subsystem: seo
tags: [json-ld, schema-org, structured-data, seo, playwright]

# Dependency graph
requires:
  - phase: 01-foundation-setup
    provides: BaseLayout.astro with SEO meta tags
  - phase: 03-static-pages-migration
    provides: Playwright testing infrastructure
provides:
  - JSON-LD Organization schema (SEO-07)
  - JSON-LD WebSite schema (SEO-08)
  - Conditional schema injection (isHomepage prop)
  - OG image dimensions meta tags
  - Playwright tests for schema validation
affects: [05-03-homepage-assembly, seo-validation, rich-results-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "isHomepage prop pattern for conditional schema injection"
    - "JSON-LD schema objects defined in layout frontmatter"
    - "set:html directive for JSON-LD script injection"

key-files:
  created:
    - src/pages/test-json-ld.astro
    - tests/seo.spec.ts
  modified:
    - src/layouts/BaseLayout.astro

key-decisions:
  - "isHomepage prop controls schema injection (defaults false)"
  - "Organization and WebSite schemas only on homepage"
  - "SearchAction omitted - no search functionality in Phase 5"
  - "OG image dimensions added (1200x630) per best practices"

patterns-established:
  - "Pattern 1: isHomepage prop pattern enables page-specific schema injection"
  - "Pattern 2: JSON-LD objects defined in frontmatter, injected with set:html"
  - "Pattern 3: Test pages verify conditional rendering before production use"

# Metrics
duration: 5min
completed: 2026-01-31
---

# Phase 05 Plan 02: JSON-LD Structured Data Summary

**BaseLayout.astro enhanced with conditional JSON-LD Organization and WebSite schemas, validated with Playwright tests**

## Performance

- **Duration:** 5 minutes
- **Started:** 2026-01-31T04:57:25Z
- **Completed:** 2026-01-31T05:01:45Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Added JSON-LD Organization schema (SEO-07) with name, url, logo, description
- Added JSON-LD WebSite schema (SEO-08) with name, url, description
- Implemented conditional schema injection via isHomepage prop (defaults false)
- Added og:image:width and og:image:height meta tags (1200x630)
- Created test page to verify JSON-LD rendering
- Created Playwright tests for schema validation (4 test cases)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add JSON-LD schemas to BaseLayout** - `5c6721a` (feat)
2. **Task 2: Create test page to verify JSON-LD conditional rendering** - `19b5098` (test)
3. **Task 3: Add Playwright test for JSON-LD schemas** - `da0fd8d` (test)

**Plan metadata:** Will be committed after summary creation

## Files Created/Modified

- `src/layouts/BaseLayout.astro` - Added isHomepage prop, organizationSchema, websiteSchema objects, conditional JSON-LD injection, OG image dimensions
- `src/pages/test-json-ld.astro` - Test page with isHomepage=true to verify JSON-LD rendering in HTML
- `tests/seo.spec.ts` - 4 Playwright tests: Organization schema, WebSite schema, non-homepage exclusion, OG dimensions

## Decisions Made

**1. isHomepage prop pattern (optional, defaults false)**
- Rationale: Only homepage needs Organization/WebSite schemas; other pages should not have them
- Pattern: `isHomepage?: boolean` in Props interface, defaults to false for safety
- Usage: Pages explicitly set `isHomepage={true}` to enable schema injection

**2. SearchAction omitted from WebSite schema**
- Rationale: No search functionality exists in Phase 5 (deferred to Phase 7 per research)
- Impact: Cleaner schema, avoids Google Search Console warnings for missing functionality
- Future: Will add SearchAction in Phase 7 when search is implemented

**3. OG image dimensions added (1200x630)**
- Rationale: Best practice for Open Graph images, prevents layout shift in social previews
- Standard size: 1200x630 recommended by Facebook/Twitter/LinkedIn
- Implementation: Added og:image:width and og:image:height meta tags

**4. Test page created for verification**
- Rationale: Verify JSON-LD renders in actual HTML before relying on it
- Pattern: Temporary test pages enable manual and automated verification
- Location: /test-json-ld/ (may be kept for debugging or removed after Plan 03)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without problems.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Plan 03 (Homepage Assembly):**
- BaseLayout.astro has JSON-LD infrastructure
- index.astro will set `isHomepage={true}` to enable schemas
- Playwright tests will verify schemas on live homepage
- Test page demonstrates schemas work correctly

**Schemas validated:**
- Organization schema renders with correct @context, @type, name, url, logo
- WebSite schema renders with correct @context, @type, name, url, description
- Non-homepage pages correctly exclude schemas (tested with /privacy/)
- OG image dimensions present and correct (1200x630)

**Testing infrastructure complete:**
- 4 Playwright tests ready to validate homepage schemas
- Tests will pass once index.astro sets isHomepage=true (Plan 03)
- Role-based selectors avoid dev toolbar conflicts

**No blockers or concerns.**

---
*Phase: 05-landing-page-assembly*
*Completed: 2026-01-31*
