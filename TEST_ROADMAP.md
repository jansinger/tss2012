# Test Implementation Roadmap - Ein tierischer Segelsommer 2012

**Status:** Phase 1-3 Complete ✅
**Current Coverage:** 207 tests passing (100%)
**Next Steps:** Phases 4-7

---

## ✅ Completed Phases (Phase 1-3)

### Phase 1: Utils & Critical Business Logic ✅

- **Status:** Complete (68 tests)
- **Coverage:** 100%
- **Files:**
  - ✅ sortEntries.spec.ts (8 tests)
  - ✅ striphtml.spec.ts (30 tests)
  - ✅ createTooltipHTML.spec.ts (16 tests)
  - ✅ tooltip.spec.ts extended (14 tests)

### Phase 2: Component Foundation ✅

- **Status:** Complete (41 tests)
- **Coverage:** 70-100% per component
- **Files:**
  - ✅ LogbookEntries.spec.ts (19 tests)
  - ✅ LogbookEntriesOverlay.spec.ts (8 tests)
  - ✅ Overlay.spec.ts (12 tests)

### Phase 3: OpenLayers & Server Logic ✅

- **Status:** Complete (98 tests)
- **Coverage:** 80-100%
- **Files:**
  - ✅ map.spec.ts (24 tests)
  - ✅ overviewmap.spec.ts (22 tests)
  - ✅ layers.spec.ts (45 tests)
  - ✅ Server route tests (24 tests)

**Total:** 207 tests passing

---

## 📋 Upcoming Phases (4-7)

## Phase 4: Integration Tests 🔄

**Priority:** HIGH
**Estimated Tests:** ~50-70 tests
**Timeline:** 2-3 days

### Objectives

- Increase component coverage from 77.65% to 90%+
- Test component interactions and integration
- Cover uncovered code paths in existing components

### 4.1 LogbookMap Integration Tests (~20 tests)

**Current Coverage:** 42.85% → Target: 85%+

**Uncovered Lines:** 35-37, 39-46, 49, 54, 57-73

**Test Areas:**

1. **Map Initialization Flow** (5 tests)
   - Map initialization with mapElement binding
   - Map recreation on remount
   - View updates (zoom, center)
   - Layer loading and visibility
   - Error handling for missing dependencies

2. **Event Handling** (8 tests)
   - Click on logbook marker (single feature)
   - Click on cluster (multiple features)
   - Tooltip hover interactions
   - Map move/zoom events
   - Custom OpenLayers events

3. **State Management** (4 tests)
   - AppState.currentEntries updates
   - Map store synchronization
   - Reactive updates on data changes
   - Cleanup on unmount

4. **Navigation & Routing** (3 tests)
   - Navigate to entry detail (/log/{id})
   - Handle invalid entry IDs
   - URL parameter handling

### 4.2 Tooltip Event Handlers (~12 tests)

**Current Coverage:** 42.59% → Target: 75%+

**Uncovered Lines:** 42-45, 48-68, 71-83

**Test Areas:**

1. **Tooltip Display** (4 tests)
   - Show tooltip on feature hover
   - Hide tooltip on mouseout
   - Tooltip positioning
   - Tooltip content rendering

2. **Click Events** (4 tests)
   - Single feature click → navigation
   - Cluster click → overlay with entries
   - Click outside features → no action
   - Click during drag → ignore

3. **Custom Events** (4 tests)
   - Fire `clickLogbook` event
   - Event payload validation
   - Event bubbling/propagation
   - Multiple listeners handling

### 4.3 Logbook Layer Styling (~8 tests)

**Current Coverage:** 67.69% → Target: 85%+

**Uncovered Lines:** 50-70 (cluster styling function)

**Test Areas:**

1. **Cluster Style Generation** (5 tests)
   - Style for single feature (marker icon)
   - Style for cluster of 2-9 features
   - Style for cluster of 10-99 features
   - Style for cluster of 100+ features
   - Style caching behavior

2. **Marker Customization** (3 tests)
   - Icon positioning (anchor)
   - Icon size and scale
   - Color/opacity variations

### 4.4 LogbookEntry Component (~10 tests)

**Current Coverage:** 78.57% → Target: 90%+

**Uncovered Lines:** 61-68, 76-79

**Test Areas:**

1. **Navigation Controls** (4 tests)
   - Previous button (when \_prev exists)
   - Next button (when \_next exists)
   - Disabled state (first/last entry)
   - Keyboard navigation (arrow keys)

2. **Error States** (3 tests)
   - Missing entry data
   - Invalid coordinates
   - Missing pictures

3. **Wheel Tracking** (3 tests)
   - Horizontal scroll tracking
   - Navigation on wheel threshold
   - Reset on direction change

### 4.5 Pictures Component (~8 tests)

**Current Coverage:** 100% lines, but missing integration tests

**Test Areas:**

1. **Swiper Integration** (4 tests)
   - Swiper initialization
   - Navigation between images
   - Thumbnail gallery sync
   - Lazy loading behavior

2. **Accessibility** (4 tests)
   - Keyboard navigation (arrow keys)
   - ARIA labels and roles
   - Screen reader announcements
   - Focus management

### 4.6 OverviewMap Component (~5 tests)

**Current Coverage:** 87.5% → Target: 95%+

**Uncovered Lines:** 18-19

**Test Areas:**

1. **Map Sync** (3 tests)
   - Overview map follows main map
   - Marker position updates
   - View synchronization

2. **Controls** (2 tests)
   - FullScreen control
   - Zoom controls

---

## Phase 5: End-to-End Tests 🎯

**Priority:** HIGH
**Estimated Tests:** ~25-35 tests
**Timeline:** 3-4 days

### Setup

- **Framework:** Playwright
- **Browsers:** Chromium, Firefox, WebKit
- **Viewports:** Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)

### 5.1 Installation & Configuration (~1 day)

```bash
npm install -D @playwright/test
npx playwright install
```

**Configuration:**

- Create `playwright.config.ts`
- Set up test directories
- Configure CI/CD integration
- Set up screenshot/video recording

### 5.2 User Journey Tests (~15 tests)

#### Journey 1: Browse Map → View Entry (~5 tests)

1. Load homepage with map
2. Click on logbook marker
3. Navigate to entry detail page
4. View pictures in gallery
5. Return to map

#### Journey 2: Timeline Navigation (~5 tests)

1. Navigate to timeline page
2. Browse grouped entries
3. Click on entry
4. Navigate between entries (prev/next)
5. Return to timeline

#### Journey 3: Logbook List (~5 tests)

1. Navigate to logbook list
2. Scroll through entries
3. Click on entry
4. View details
5. Navigate to another entry

### 5.3 Interaction Tests (~10 tests)

1. **Map Interactions** (4 tests)
   - Zoom in/out
   - Pan/drag map
   - Click cluster → expand
   - Toggle layer visibility

2. **Form Interactions** (2 tests)
   - Search/filter (if exists)
   - Settings/preferences

3. **Navigation** (4 tests)
   - Browser back/forward
   - Direct URL access
   - 404 error handling
   - Deep linking to entries

### 5.4 Responsive/Mobile Tests (~5 tests)

1. Mobile viewport navigation
2. Touch gestures (swipe, pinch)
3. Mobile menu interactions
4. Landscape/portrait orientation
5. Cross-device consistency

---

## Phase 6: Visual Regression Tests 🎨

**Priority:** MEDIUM
**Estimated Tests:** ~20-30 screenshots
**Timeline:** 2-3 days

### Setup

- **Tool:** Playwright Visual Comparisons
- **Storage:** Git LFS or dedicated service (Percy, Chromatic)

### 6.1 Component Screenshots (~15 tests)

1. LogbookEntry - various states
2. LogbookEntries - list view
3. Overlay - open/closed states
4. Pictures - gallery view
5. Map - different zoom levels
6. Timeline - grouped entries
7. Error pages - 404, 500

### 6.2 Page Screenshots (~10 tests)

1. Homepage - full map view
2. Timeline page - desktop
3. Timeline page - mobile
4. Logbook list - desktop
5. Logbook list - mobile
6. Entry detail - desktop
7. Entry detail - mobile
8. Impressum page
9. Barrierefreiheit page
10. Error page

### 6.3 Interaction States (~5 tests)

1. Hover states (buttons, links)
2. Focus states (accessibility)
3. Active/pressed states
4. Disabled states
5. Loading states

---

## Phase 7: Performance & Accessibility Tests ⚡

**Priority:** MEDIUM
**Estimated Tests:** ~15-20 tests
**Timeline:** 2-3 days

### 7.1 Performance Tests (~10 tests)

#### Lighthouse CI Integration

```bash
npm install -D @lhci/cli
```

**Metrics to Track:**

1. **Core Web Vitals** (5 tests)
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1
   - TTFB (Time to First Byte) < 800ms
   - FCP (First Contentful Paint) < 1.8s

2. **Bundle Size** (3 tests)
   - Main bundle < 500KB
   - Lazy chunks < 200KB each
   - Total page weight < 2MB

3. **Runtime Performance** (2 tests)
   - Map rendering < 1s
   - Image loading (lazy) optimized

#### Performance Budget

```json
{
	"timings": {
		"firstContentfulPaint": 1800,
		"interactive": 3500,
		"speedIndex": 2500
	},
	"resourceSizes": {
		"script": 500000,
		"stylesheet": 50000,
		"image": 2000000
	}
}
```

### 7.2 Accessibility Tests (~10 tests)

#### axe-core Integration

```bash
npm install -D @axe-core/playwright
```

**WCAG 2.1 Level AA Compliance:**

1. **Keyboard Navigation** (3 tests)
   - All interactive elements focusable
   - Focus indicators visible
   - Tab order logical

2. **Screen Reader** (3 tests)
   - ARIA landmarks present
   - Alt text on images
   - Form labels associated

3. **Color Contrast** (2 tests)
   - Text contrast ratio ≥ 4.5:1
   - Interactive elements ≥ 3:1

4. **Semantic HTML** (2 tests)
   - Proper heading hierarchy
   - Valid HTML structure

---

## Implementation Priority Matrix

| Phase   | Priority | Impact | Effort | Order |
| ------- | -------- | ------ | ------ | ----- |
| Phase 4 | HIGH     | HIGH   | MEDIUM | 1st   |
| Phase 5 | HIGH     | HIGH   | HIGH   | 2nd   |
| Phase 6 | MEDIUM   | MEDIUM | MEDIUM | 3rd   |
| Phase 7 | MEDIUM   | HIGH   | LOW    | 4th   |

---

## Coverage Goals

| Category       | Current | Phase 4 Target | Final Target |
| -------------- | ------- | -------------- | ------------ |
| **Overall**    | 77.65%  | 90%+           | 95%+         |
| **Components** | 77.65%  | 90%+           | 95%+         |
| **Utils**      | 100%    | 100%           | 100%         |
| **OpenLayers** | 94.91%  | 95%+           | 98%+         |
| **Server**     | 89.47%  | 95%+           | 100%         |

---

## Testing Infrastructure Improvements

### 1. Test Utilities (~2 hours)

Create shared test helpers:

- `createMockLogEntry(overrides)` - Factory for test data
- `renderWithRouter(component, props)` - Router context
- `waitForMap(timeout)` - Async map loading
- `createMockMap()` - OpenLayers mock

### 2. CI/CD Integration (~1 day)

- **GitHub Actions Workflow:**
  ```yaml
  - Run unit tests (all 207+)
  - Run E2E tests (Playwright)
  - Generate coverage report
  - Upload to Codecov
  - Run Lighthouse CI
  - Visual regression checks
  ```

### 3. Documentation (~1 day)

- **TESTING.md** - Testing guide
- **CONTRIBUTING.md** - How to add tests
- Test naming conventions
- Best practices

---

## Success Metrics

### Quantitative

- ✅ 207+ unit/integration tests passing
- 🎯 25+ E2E tests passing
- 🎯 90%+ code coverage
- 🎯 100% critical paths tested
- 🎯 Lighthouse score ≥ 90

### Qualitative

- ✅ Regression prevention
- 🎯 Faster development feedback
- 🎯 Improved code quality
- 🎯 Better documentation
- 🎯 Easier onboarding

---

## Risks & Mitigation

| Risk                 | Impact | Probability | Mitigation                              |
| -------------------- | ------ | ----------- | --------------------------------------- |
| Flaky E2E tests      | HIGH   | MEDIUM      | Implement retry logic, stable selectors |
| Slow test execution  | MEDIUM | HIGH        | Parallelize, optimize fixtures          |
| Maintenance overhead | MEDIUM | MEDIUM      | Clear documentation, DRY principles     |
| CI/CD costs          | LOW    | LOW         | Use GitHub Actions free tier            |

---

## Resources Needed

### Tools & Services

- ✅ Vitest (installed)
- ✅ @testing-library/svelte (installed)
- 🔜 Playwright (~100MB download)
- 🔜 Lighthouse CI (free)
- 🔜 axe-core (free)
- 📋 Visual regression service (optional: Percy/Chromatic)

### Time Estimate

- **Phase 4:** 2-3 days (50-70 tests)
- **Phase 5:** 3-4 days (25-35 tests + setup)
- **Phase 6:** 2-3 days (20-30 screenshots)
- **Phase 7:** 2-3 days (15-20 tests + CI)

**Total:** ~10-13 days (2 work weeks)

---

## Next Steps (Phase 4)

### Immediate Actions

1. **Start with LogbookMap integration tests**
   - Highest impact (42.85% → 85%+)
   - Most complex component
   - Covers critical user path

2. **Create test utilities**
   - Mock factories
   - Shared fixtures
   - Helper functions

3. **Set up test data**
   - Realistic logbook entries
   - Various map states
   - Edge cases

### Phase 4 Kickoff Checklist

- [ ] Review uncovered code paths
- [ ] Create test utilities file
- [ ] Set up OpenLayers test mocks
- [ ] Write first LogbookMap integration test
- [ ] Run coverage report baseline
- [ ] Document testing patterns

---

**Last Updated:** 2025-10-06
**Author:** Testing Roadmap
**Status:** Planning Complete - Ready for Phase 4
