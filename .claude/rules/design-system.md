---
description: 'Design system tokens and patterns — auto-loaded for style files'
paths:
  - 'src/**/*.svelte'
  - 'src/**/*.scss'
  - 'src/**/*.css'
---

# Design System Rules

> Tokens defined in `src/lib/scss/_tokens.scss`. Mixins in `src/lib/scss/_mixins.scss`.

## MANDATORY: Use Design Tokens

NEVER hardcode colors, spacing, shadows, borders, z-index, or transitions.
ALWAYS use CSS custom properties from `_tokens.scss`.

### FORBIDDEN

```css
color: #2e6287;
padding: 16px;
z-index: 50;
border-radius: 12px;
box-shadow: 0 8px 32px 0 rgba(33, 70, 97, 0.37);
```

### REQUIRED

```css
color: var(--color-primary);
padding: var(--space-4);
z-index: var(--z-content);
border-radius: var(--radius-3xl);
box-shadow: var(--shadow-glass);
```

### Exceptions (allowed hardcoded)

- `0` and `none` values
- `100%`, `50%` for layouts
- `1px` borders defined in tokens (`--glass-border`)
- OpenLayers control overrides (require `!important`)
- Swiper `--swiper-*` custom properties (external API)

## Breakpoints

Use ONLY the defined breakpoint mixins from `_mixins.scss` (mobile-first):

```scss
@include bp-sm { }   // min-width: 480px
@include bp-md { }   // min-width: 768px
@include bp-lg { }   // min-width: 1024px
```

**Exception**: Timeline grid breakpoint at `800px` — architectural decision, coupled to grid math.

## Glass Morphism

Use the `.glass` utility class or `@include glass` mixin. Do NOT manually write backdrop-filter/glass properties.

## Accessibility

- All color pairs MUST meet WCAG 2.2 AA contrast (4.5:1 text, 3:1 large text/UI)
- All CSS transitions MUST respect `prefers-reduced-motion: reduce` (global rule in `_layout.scss`)
- Svelte transitions (`fly`, `fade`) MUST use `prefersReducedMotion()` from `$lib/utils/a11y`
- Interactive elements MUST have visible focus indicators via `--focus-outline`
- Use `@include visually-hidden` for screen-reader-only content

## Z-Index Scale

ALWAYS use token z-index values. The layer order is:

```
--z-base: 0          (map)
--z-map-overlays: 2  (OL overlay containers)
--z-navigation: 5    (navigation, impressum link)
--z-map-tooltip: 10  (map tooltips)
--z-content: 50      (article containers, timeline)
--z-nav-bar: 100     (sticky sub-navigation)
--z-skip-link: 9999  (skip-to-main)
```

## New Token Request

If a value does not exist as a token, add it to `_tokens.scss` following the naming convention:
`--{category}-{property}-{variant}` (e.g., `--color-surface-new`, `--radius-pill`).
