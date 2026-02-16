---
name: performance-check
description: 'Performance analysis for bundle size, rendering, map performance, and Core Web Vitals'
disable-model-invocation: true
allowed-tools: 'Read, Glob, Bash'
---

# Performance Check

Invoked with: `/performance-check`

## 1. Bundle Size Analysis

### Build and measure

```bash
npm run build
du -sh build/
ls -lhS build/_app/immutable/chunks/ | head -20
```

### Size thresholds

| Asset                  | Target (gzipped) |
| ---------------------- | ---------------- |
| Main bundle            | < 500KB          |
| Map chunk (OpenLayers) | < 300KB          |
| Per-route chunks       | < 100KB          |

### Check for dynamic imports

```bash
grep -rn "import(" src/ --include="*.ts" --include="*.svelte" | grep -v "node_modules\|type"
```

Verify:

- [ ] Large libraries dynamically imported where possible
- [ ] Routes properly code-split

## 2. Component Rendering Performance

### $derived optimization

```bash
grep -rn "\$derived" src/lib/components/ --include="*.svelte"
```

Check:

- [ ] Derivations are cheap (no heavy computation without `$derived.by()`)
- [ ] No infinite derivation loops

### $effect optimization

```bash
grep -rn "\$effect" src/lib/components/ --include="*.svelte"
```

Check:

- [ ] All effects have cleanup functions
- [ ] No unnecessary effect re-runs
- [ ] `untrack()` used for non-reactive reads where appropriate

### List rendering

```bash
grep -rn "{#each" src/ --include="*.svelte"
```

Verify:

- [ ] All lists use keys: `{#each items as item (item.id)}`
- [ ] Keys are stable (not array indexes)

## 3. OpenLayers Map Performance

### Layer count

```bash
grep -c "Layer\|layer" src/lib/ol/map.ts
```

Current: 4 layers (OSM, SeaMap, Track, Logbook). Target: < 10 layers.

### Feature count

```bash
grep -c '"type": "Feature"' static/data/logbook_geo.json
```

Thresholds:

- < 1,000: Direct rendering OK
- 1,000-10,000: Requires clustering (currently implemented)
- > 10,000: Needs VectorTile

### Style caching

```bash
grep -A 10 "styleCache\|style_cache" src/lib/ol/layers/logbook.ts
```

Verify:

- [ ] LRU eviction implemented
- [ ] Max cache size bounded
- [ ] Cache cleared on cleanup

### Cluster configuration

```bash
grep -A 5 "new Cluster" src/lib/ol/layers/logbook.ts
```

## 4. Core Web Vitals Checklist

### Largest Contentful Paint (LCP) — Target: < 2.5s

- [ ] Critical resources preloaded
- [ ] Images optimized (WebP, lazy loading)
- [ ] Render-blocking resources minimized
- [ ] Pre-rendered pages (adapter-static)

### Interaction to Next Paint (INP) — Target: < 200ms

- [ ] JavaScript execution minimized
- [ ] Code splitting implemented
- [ ] No long tasks (> 50ms)

### Cumulative Layout Shift (CLS) — Target: < 0.1

- [ ] Image dimensions set
- [ ] Map container has reserved height
- [ ] No dynamic content injection above fold

## 5. Asset Optimization

### Images

```bash
find static/images/ -type f -exec ls -lh {} \; | sort -k5 -h -r | head -20
```

Check:

- [ ] Images compressed
- [ ] No images > 500KB without reason
- [ ] Lazy loading for below-fold images

### Build output analysis

```bash
ls -lhS build/_app/immutable/chunks/ 2>/dev/null | head -10
```

## 6. Network & Caching

Netlify auto-handles:

- [x] Gzip/Brotli compression
- [x] Immutable asset caching (hashed filenames)
- [x] CDN distribution

Verify in `netlify.toml`:

- [ ] Cache headers configured appropriately

## Report Template

```markdown
# Performance Report — <date>

## Bundle Size

- Total build: <size>
- Largest chunks: <list>
- Status: PASS / WARNING / FAIL

## Rendering

- Keyed lists: YES/NO
- Effect cleanup: YES/NO
- Derived optimization: YES/NO

## Map Performance

- Layers: <count> (threshold: 10)
- Features: <count> (clustering: YES/NO)
- Style cache: YES/NO (max: <size>)

## Core Web Vitals (Estimated)

- LCP: <estimate>
- INP: <estimate>
- CLS: <estimate>

## Recommendations

1. <priority optimization>
2. <secondary optimization>
```
