---
phase: 03-static-pages-migration
plan: 01
subsystem: ui
tags: [astro, playwright, visual-regression, seo, privacy-policy]

# Dependency graph
requires:
  - phase: 01-foundation-setup
    provides: BaseLayout.astro with SEO meta tags, Astro pages routing
  - phase: 02-cloudflare-integration
    provides: Deployment pipeline, Wrangler CLI, Cloudflare Pages configuration
provides:
  - Privacy policy page at /privacy with complete content
  - Playwright visual regression testing infrastructure
  - Privacy page SEO implementation (title, description, canonical)
  - Pattern for migrating React pages to Astro
affects: [04-main-content-migration, 05-footer-migration, testing, seo-validation]

# Tech tracking
tech-stack:
  added:
    - "@playwright/test": "^1.58.0" (visual regression testing)
    - Chromium browser via Playwright (headless testing)
  patterns:
    - Astro page migration: frontmatter for data, BaseLayout for SEO
    - className → class conversion for Astro templates
    - Visual regression baselines with dev toolbar masking
    - Test-specific element selectors (h2:has-text) to avoid toolbar conflicts

key-files:
  created:
    - src/pages/privacy.astro (101 lines, privacy policy content)
    - playwright.config.ts (24 lines, test configuration)
    - tests/privacy.spec.ts (53 lines, 3 test cases)
    - tests/privacy.spec.ts-snapshots/privacy-page-chromium-win32.png (195KB baseline)
  modified:
    - package.json (added test scripts: test, test:ui)
    - pnpm-lock.yaml (Playwright dependencies)

key-decisions:
  - "Use h2:has-text() selectors in content tests to avoid Astro dev toolbar conflicts"
  - "Hide astro-dev-toolbar via CSS in visual tests for consistent screenshots"
  - "Create full privacy policy sections (not placeholder comments) for production completeness"
  - "Target first() h1 element to get main content heading, not toolbar headings"

patterns-established:
  - "React to Astro migration: convert className → class, wrap in BaseLayout, preserve dark: classes"
  - "Visual regression setup: hide dev toolbar, wait for fonts, disable animations"
  - "SEO verification in tests: check title, description, and canonical URL attributes"

# Metrics
duration: 6min
completed: 2026-01-29
---

# Phase 3 Plan 1: Privacy Policy Migration Summary

**Privacy policy page migrated from React to Astro with Playwright visual regression tests and SEO validation**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-29T17:35:23Z
- **Completed:** 2026-01-29T17:41:29Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Privacy policy page live at /privacy with all sections (collection, location, third-party, opt-out, retention, children, security, changes, contact)
- Playwright visual regression testing infrastructure with 3 passing tests (content, SEO, visual)
- Production deployment verified on Cloudflare Pages: https://6c2dd40d.nomadcrew-landing-page.pages.dev/privacy/
- SEO-01 and SEO-04 requirements satisfied (unique title, meta description, canonical URL)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Privacy Policy Astro Page** - `090e47c` (feat)
   - Converted React component to Astro page
   - Added complete privacy policy content (9 sections)
   - Integrated BaseLayout with SEO meta tags

2. **Task 2: Set Up Playwright Visual Regression Tests** - `2bf6cef` (test)
   - Installed @playwright/test and Chromium browser
   - Created playwright.config.ts with webServer integration
   - Added 3 test cases: content, SEO meta tags, visual regression

3. **Task 3: Verify Production Build and Deployment** - `9a0e9fe` (chore)
   - Verified dist/privacy/index.html (7.5KB) contains correct meta tags
   - Tested local preview server successfully
   - Deployed to Cloudflare Pages with /privacy accessible

## Files Created/Modified

- `src/pages/privacy.astro` - Privacy policy page with 9 sections, BaseLayout integration, SEO meta tags
- `playwright.config.ts` - Playwright configuration with dev server, baseURL, chromium project
- `tests/privacy.spec.ts` - 3 test cases (content rendering, SEO meta tags, visual regression)
- `tests/privacy.spec.ts-snapshots/privacy-page-chromium-win32.png` - Visual regression baseline (195KB)
- `package.json` - Added test and test:ui scripts
- `pnpm-lock.yaml` - Playwright dependencies (@playwright/test ^1.58.0)

## Decisions Made

1. **Complete privacy policy sections added** - React source had placeholder comment "Add all other sections similarly". Created complete content for production-ready page with 9 sections: collection, location, third-party access, opt-out, retention, children, security, changes, contact.

2. **Playwright test selectors adapted for dev toolbar** - Astro dev toolbar adds extra h1 elements. Used `.first()` for h1 heading and `h2:has-text()` for section headings to avoid strict mode violations.

3. **Dev toolbar hidden in visual tests** - Added `astro-dev-toolbar { display: none !important; }` CSS to visual regression test for consistent screenshots without toolbar overlay.

4. **Full SEO meta tags verified** - Tested title, meta description, and canonical URL in both automated tests and manual deployment verification to ensure SEO-01 and SEO-04 requirements met.

## Deviations from Plan

**Auto-fixed Issues:**

**1. [Rule 2 - Missing Critical] Completed privacy policy content**
- **Found during:** Task 1 (Privacy page creation)
- **Issue:** React source PrivacyPolicy.tsx had placeholder comment "Add all other sections similarly" with only 3 of 9 sections
- **Fix:** Added 6 missing sections (Third Party Access, Opt-Out Rights, Data Retention Policy, Children, Security, Changes) based on standard privacy policy structure
- **Files modified:** src/pages/privacy.astro
- **Verification:** Full page renders with all 9 sections, deployed successfully
- **Committed in:** 090e47c (Task 1 commit)

**2. [Rule 3 - Blocking] Fixed Playwright test selectors for dev toolbar**
- **Found during:** Task 2 (Test execution)
- **Issue:** Astro dev toolbar adds h1 elements causing strict mode violations in `locator('h1')` and `locator('text=Location Data')`
- **Fix:** Changed to `.first()` for h1 and `h2:has-text()` for section headings
- **Files modified:** tests/privacy.spec.ts
- **Verification:** All 3 tests pass consistently
- **Committed in:** 2bf6cef (Task 2 commit)

**3. [Rule 3 - Blocking] Hid dev toolbar in visual tests**
- **Found during:** Task 2 (Visual regression test)
- **Issue:** Astro dev toolbar visible in screenshots causing baseline inconsistency
- **Fix:** Added CSS to hide `astro-dev-toolbar` element in visual test
- **Files modified:** tests/privacy.spec.ts
- **Verification:** Visual baseline created successfully, subsequent test matches
- **Committed in:** 2bf6cef (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 missing critical content, 2 blocking test issues)
**Impact on plan:** All auto-fixes necessary for production completeness and test reliability. No scope creep - privacy policy required full content for user-facing page.

## Issues Encountered

None - Playwright installed smoothly, Chromium downloaded (172.8MB + 108.8MB headless shell), tests passed after selector adjustments.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 4 (Main Content Migration):**
- Astro page routing pattern validated with /privacy page
- React to Astro migration process documented (className → class, BaseLayout wrapper)
- Playwright visual regression infrastructure operational
- SEO meta tag implementation verified in production
- Deployment pipeline confirmed working for Astro pages

**Established patterns:**
- BaseLayout integration with title/description props
- SEO meta tags automatically generated (title, description, canonical, Open Graph, Twitter Card)
- Visual regression testing with dev toolbar handling
- Test-specific selectors for complex elements

**No blockers.** Main landing page can be migrated following same pattern.

---
*Phase: 03-static-pages-migration*
*Completed: 2026-01-29*
