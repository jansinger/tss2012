---
description: 'Critical OpenLayers patterns — auto-loaded for map files'
paths:
  - 'src/lib/ol/**/*.ts'
  - 'src/lib/components/*Map*.svelte'
---

# OpenLayers Critical Patterns

> For deep OL knowledge, layer types, sources, and projections: use `/openlayers-expert` skill.

## CRITICAL: Layer Stack Order

Layers render bottom-to-top. Order in `createMap()` determines visibility.

```
4. Logbook Layer (top)  — Clustered markers (GeoJSON)
3. Track Layer          — Sailing route (KML)
2. SeaMap Overlay       — Nautical charts
1. OSM Base Layer       — OpenStreetMap tiles
```

**File**: `src/lib/ol/map.ts`

```typescript
layers: [
	osmLayer, // 1. Base
	seamapLayer, // 2. Nautical overlay
	trackLayer, // 3. Route
	logbookLayer // 4. Markers (on top)
];
```

⚠️ Changing this order WILL break visual hierarchy.

## MANDATORY: Cleanup Pattern

ALWAYS export cleanup function from factory functions.

```typescript
export interface OverlayResult {
	overlay: Overlay;
	cleanup: () => void;
}

export function createOverlay(element: HTMLElement, map: Map): OverlayResult {
	const overlay = new Overlay({ element });
	const cache = new Map();

	const handleClick = (evt) => {
		/* ... */
	};
	map.addOverlay(overlay);
	map.on('click', handleClick);

	const cleanup = () => {
		map.un('click', handleClick);
		map.removeOverlay(overlay);
		cache.clear();
	};

	return { overlay, cleanup };
}
```

**Reference**: `src/lib/ol/overlays/tooltip.ts`

### Cleanup Checklist

- [ ] `map.un()` — remove event listeners
- [ ] `map.removeOverlay()` — remove overlays
- [ ] `cache.clear()` — clear caches
- [ ] `currentFeature = null` — nullify references

## Style Caching (LRU)

ALWAYS cache styles to prevent memory leaks.

```typescript
const MAX_CACHE_SIZE = 100;
const styleCache = new Map<number, Style>();

function getClusterStyle(size: number): Style {
	if (styleCache.has(size)) return styleCache.get(size)!;

	if (styleCache.size >= MAX_CACHE_SIZE) {
		const firstKey = styleCache.keys().next().value;
		if (firstKey !== undefined) styleCache.delete(firstKey);
	}

	const style = createStyle(size);
	styleCache.set(size, style);
	return style;
}
```

## Custom Events

Type-safe custom event pattern from `src/lib/types.ts`:

```typescript
export const CLICK_LOGBOOK_EVENT = 'clickLogbook';

export function onLogbookClick(map: Map, callback: (event: LogbookClickEvent) => void): () => void {
	const handler = (event: BaseEvent) => callback(event as LogbookClickEvent);
	map.on(CLICK_LOGBOOK_EVENT, handler);
	return () => map.un(CLICK_LOGBOOK_EVENT, handler); // Returns cleanup
}
```

## Svelte 5 Integration

```svelte
$effect(() => {
  if (!$map || !mapElement) return;

  const { cleanup } = createTooltipOverlay(tooltipElement, $map);

  return () => {
    cleanup(); // ALWAYS cleanup
  };
});
```

Map instance stored in Svelte store (not runes) for OL interop:

```typescript
// src/lib/stores.ts
export const map: Writable<Map> = writable();
```

## Key Files

| File                             | Purpose                      |
| -------------------------------- | ---------------------------- |
| `src/lib/ol/map.ts`              | Map factory, layer order     |
| `src/lib/ol/layers/logbook.ts`   | Cluster + style cache        |
| `src/lib/ol/overlays/tooltip.ts` | Cleanup pattern reference    |
| `src/lib/types.ts`               | Custom event types + helpers |
| `src/lib/ol/constants.ts`        | Center [10.5, 54.5], zoom 8  |
