---
description: 'OpenLayers integration patterns for map features'
globs: ['src/lib/ol/**/*.ts', 'src/lib/components/*Map*.svelte']
alwaysApply: false
---

# OpenLayers Integration Patterns

This document covers OpenLayers patterns specific to the **Ein tierischer Segelsommer 2012** project.

---

## Layer Stack (Order Matters!)

Layers are rendered bottom-to-top. The order in `createMap()` determines visibility:

```
4. Logbook Layer  (top)     - Clustered markers (GeoJSON)
3. Track Layer              - Sailing route (KML)
2. SeaMap Overlay           - Nautical charts
1. OSM Base Layer (bottom)  - OpenStreetMap tiles
```

**File**: [src/lib/ol/map.ts](../../src/lib/ol/map.ts)

```typescript
layers: [
	osmLayer, // 1. Base
	seamapLayer, // 2. Nautical overlay
	trackLayer, // 3. Route
	logbookLayer // 4. Markers (on top)
];
```

---

## Layer Files

| File                                             | Purpose                  | Source       |
| ------------------------------------------------ | ------------------------ | ------------ |
| [osm.ts](../../src/lib/ol/layers/osm.ts)         | OpenStreetMap base tiles | Remote tiles |
| [seamap.ts](../../src/lib/ol/layers/seamap.ts)   | Nautical chart overlay   | Remote tiles |
| [track.ts](../../src/lib/ol/layers/track.ts)     | Sailing route line       | KML file     |
| [logbook.ts](../../src/lib/ol/layers/logbook.ts) | Clustered entry markers  | GeoJSON file |

---

## Clustering Strategy

**File**: [src/lib/ol/layers/logbook.ts](../../src/lib/ol/layers/logbook.ts)

### Configuration

```typescript
const clusterSource = new Cluster({
	distance: 50, // Cluster features within 50px
	minDistance: 20, // Minimum 20px between clusters
	source: vectorSource
});
```

### Style Caching (LRU Pattern)

Styles are cached by cluster size to prevent memory leaks:

```typescript
const MAX_CACHE_SIZE = 100;
const styleCache = new Map<number, Style>();

function getClusterStyle(size: number): Style {
	if (styleCache.has(size)) {
		return styleCache.get(size)!;
	}

	// LRU eviction
	if (styleCache.size >= MAX_CACHE_SIZE) {
		const firstKey = styleCache.keys().next().value;
		styleCache.delete(firstKey);
	}

	const style = createStyle(size);
	styleCache.set(size, style);
	return style;
}
```

### Single vs Cluster Styling

```typescript
function styleFunction(feature: Feature): Style {
	const features = feature.get('features');
	const size = features?.length || 1;

	if (size === 1) {
		// Single feature - use marker icon
		return singleMarkerStyle;
	} else {
		// Cluster - use circle with count
		return getClusterStyle(size);
	}
}
```

---

## Custom Events

### CLICK_LOGBOOK_EVENT Pattern

**Type Definition**: [src/lib/types.ts](../../src/lib/types.ts)

```typescript
export const CLICK_LOGBOOK_EVENT = 'clickLogbook';

export interface LogbookClickEvent extends BaseEvent {
	type: typeof CLICK_LOGBOOK_EVENT;
	feature: Feature<Geometry> | RenderFeature;
}
```

### Dispatching Events

**File**: [src/lib/ol/overlays/tooltip.ts](../../src/lib/ol/overlays/tooltip.ts)

```typescript
map.dispatchEvent({
	type: CLICK_LOGBOOK_EVENT,
	feature: newFeature
} as unknown as BaseEvent);
```

### Handling Events (Type-Safe)

**File**: [src/lib/types.ts](../../src/lib/types.ts)

```typescript
export function onLogbookClick(
	map: OLMap,
	callback: (event: LogbookClickEvent) => void
): () => void {
	const handler = (event: BaseEvent) => {
		callback(event as LogbookClickEvent);
	};
	map.on(CLICK_LOGBOOK_EVENT, handler);
	return () => map.un(CLICK_LOGBOOK_EVENT, handler);
}
```

**Usage in Component**:

```typescript
$effect(() => {
	if (!$map) return;

	const unsubscribe = onLogbookClick($map, (event) => {
		const features = event.feature.get('features');
		// Handle click...
	});

	return unsubscribe;
});
```

---

## Memory Management

### Cleanup Function Pattern

**File**: [src/lib/ol/overlays/tooltip.ts](../../src/lib/ol/overlays/tooltip.ts)

```typescript
export interface TooltipOverlayResult {
	overlay: Overlay;
	cleanup: () => void;
}

export const createTooltipOverlay = (element: HTMLElement, map: OLMap): TooltipOverlayResult => {
	const overlay = new Overlay({ element /* ... */ });

	// Track resources
	const tooltipCache = new Map<string, string>();

	// Event handlers
	const handleClick = (evt) => {
		/* ... */
	};
	const handlePointerMove = (evt) => {
		/* ... */
	};

	// Setup
	map.addOverlay(overlay);
	map.on('click', handleClick);
	map.on('pointermove', handlePointerMove);

	// Cleanup function
	const cleanup = () => {
		map.un('click', handleClick);
		map.un('pointermove', handlePointerMove);
		map.removeOverlay(overlay);
		tooltipCache.clear();
	};

	return { overlay, cleanup };
};
```

### Memory Management Checklist

- [ ] Return cleanup function from factories
- [ ] Clear caches on cleanup (`tooltipCache.clear()`)
- [ ] Remove event listeners (`map.un()`)
- [ ] Remove overlays (`map.removeOverlay()`)
- [ ] Set cache size limits (LRU eviction)
- [ ] Nullify references (`currentFeature = null`)

---

## Map Factory Pattern

**File**: [src/lib/ol/map.ts](../../src/lib/ol/map.ts)

```typescript
export function createMap(target: HTMLElement): Map {
	return new Map({
		target,
		layers: [osmLayer, seamapLayer, trackLayer, logbookLayer],
		view: new View({
			center: fromLonLat(DEFAULTS.center),
			zoom: DEFAULTS.zoom,
			projection: 'EPSG:3857'
		})
	});
}
```

### Overview Map Factory

**File**: [src/lib/ol/overviewmap.ts](../../src/lib/ol/overviewmap.ts)

```typescript
export function createOverviewMap(target: HTMLElement, mainMap: Map): Map {
	return new Map({
		target,
		layers: [
			/* subset of layers */
		],
		view: new View({
			// Sync with main map or independent
		})
	});
}
```

---

## Adding a New Layer

### Step-by-Step

1. **Create layer file** in `src/lib/ol/layers/`

```typescript
// src/lib/ol/layers/newlayer.ts
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

export const newLayer = new VectorLayer({
    source: new VectorSource({
        url: '/data/newdata.geojson',
        format: new GeoJSON()
    }),
    style: /* style function or Style object */
});
```

2. **Export from layers index** (if exists) or import directly

3. **Add to map.ts**

```typescript
import { newLayer } from './layers/newlayer';

export function createMap(target: HTMLElement): Map {
	return new Map({
		layers: [
			osmLayer,
			seamapLayer,
			trackLayer,
			newLayer, // Add in correct z-order
			logbookLayer
		]
		// ...
	});
}
```

---

## Map Constants

**File**: [src/lib/ol/constants.ts](../../src/lib/ol/constants.ts)

```typescript
export const DEFAULTS = {
	center: [10.5, 54.5], // Longitude, Latitude (Baltic Sea)
	zoom: 8
};
```

### Projection

- **Internal**: EPSG:3857 (Web Mercator)
- **Data files**: EPSG:4326 (WGS84) - transformed on load

```typescript
import { fromLonLat } from 'ol/proj';

// Convert WGS84 to Web Mercator
const center = fromLonLat([10.5, 54.5]);
```

---

## Troubleshooting

### Map Not Rendering

1. Check `mapElement` is bound correctly with `bind:this`
2. Verify `map.setTarget()` called after DOM ready
3. Call `map.updateSize()` after container resize
4. Check browser console for OpenLayers errors

### Features Not Clickable

1. Verify layer is on top of other layers
2. Check `getFeatureAtEventPixel()` is working
3. Ensure feature has correct geometry type

### Memory Leaks

1. Ensure cleanup function is called on unmount
2. Check all event listeners are removed
3. Verify caches are cleared
4. Use browser DevTools Memory tab to profile

---

## Key Files Reference

| File                                                                             | Purpose                      |
| -------------------------------------------------------------------------------- | ---------------------------- |
| [map.ts](../../src/lib/ol/map.ts)                                                | Main map factory             |
| [overviewmap.ts](../../src/lib/ol/overviewmap.ts)                                | Overview map factory         |
| [constants.ts](../../src/lib/ol/constants.ts)                                    | Default center, zoom         |
| [tooltip.ts](../../src/lib/ol/overlays/tooltip.ts)                               | Tooltip overlay with cleanup |
| [createTooltipHTML.ts](../../src/lib/ol/overlays/createTooltipHTML.ts)           | Tooltip HTML generation      |
| [getFeatureAtEventPixel.ts](../../src/lib/ol/overlays/getFeatureAtEventPixel.ts) | Feature detection            |
