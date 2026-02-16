---
name: openlayers-expert
description: 'Deep OpenLayers 10 knowledge for maps, layers, sources, projections, and performance'
disable-model-invocation: false
allowed-tools: 'mcp__context7__resolve-library-id, mcp__context7__query-docs, Read, Grep, Glob'
---

# OpenLayers Expert

You are an OpenLayers 10.x expert. ALWAYS use Context7 for current documentation:

1. `resolve-library-id` with query about OpenLayers
2. `query-docs` with your specific question

## Layer Types

### Raster Layers

- **TileLayer**: Standard tiled maps (OSM, XYZ, WMTS)
- **ImageLayer**: Single image (WMS, static image)
- **WebGLTileLayer**: GPU-accelerated raster tiles (better performance for many tiles)

### Vector Layers

- **VectorLayer**: Standard vector features (GeoJSON, KML, GPX)
- **VectorTileLayer**: Vector tile format (MVT, protobuf)
- **WebGLVectorLayer**: GPU-accelerated vector rendering (10k+ features)
- **Heatmap**: Heatmap visualization from point features

### Layer Properties

```typescript
new VectorLayer({
	source: vectorSource,
	style: styleFunction,
	opacity: 0.8, // 0-1
	visible: true,
	zIndex: 10, // Explicit z-order
	minZoom: 5, // Show from zoom 5
	maxZoom: 18, // Hide after zoom 18
	className: 'my-layer', // CSS class on canvas
	declutter: true // Avoid label overlap
});
```

## Source Types

### Tile Sources

```typescript
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS';

// OpenStreetMap
new OSM();

// Custom XYZ tiles
new XYZ({
	url: 'https://tiles.example.com/{z}/{x}/{y}.png',
	maxZoom: 19
});
```

### Vector Sources

```typescript
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import KML from 'ol/format/KML';

// GeoJSON
new VectorSource({
	url: '/data/features.geojson',
	format: new GeoJSON()
});

// KML
new VectorSource({
	url: '/data/track.kml',
	format: new KML({ extractStyles: false })
});
```

### Cluster Source

```typescript
import Cluster from 'ol/source/Cluster';

const clusterSource = new Cluster({
	distance: 50, // Cluster within 50px
	minDistance: 20, // Min 20px between clusters
	source: vectorSource
});
```

## Projections

### Common Projections

- **EPSG:3857** (Web Mercator): Internal map projection, used by OSM/Google/Bing
- **EPSG:4326** (WGS84): GPS coordinates (lon/lat), used in GeoJSON/KML

### Transformation

```typescript
import { fromLonLat, toLonLat, transform } from 'ol/proj';

// WGS84 → Web Mercator (most common)
const mapCoords = fromLonLat([10.5, 54.5]); // [lon, lat]

// Web Mercator → WGS84
const [lon, lat] = toLonLat(mapCoords);

// Generic transform
const coords = transform([10.5, 54.5], 'EPSG:4326', 'EPSG:3857');
```

**Rule**: Data files (GeoJSON, KML) use EPSG:4326. Map internally uses EPSG:3857. Transformation happens automatically for most formats.

## Styling

### Style Objects

```typescript
import { Style, Fill, Stroke, Circle as CircleStyle, Text, Icon } from 'ol/style';

// Basic style
new Style({
	fill: new Fill({ color: 'rgba(255, 0, 0, 0.3)' }),
	stroke: new Stroke({ color: '#ff0000', width: 2 }),
	image: new CircleStyle({
		radius: 7,
		fill: new Fill({ color: '#ff0000' }),
		stroke: new Stroke({ color: '#fff', width: 2 })
	})
});

// Text label
new Style({
	text: new Text({
		text: 'Label',
		font: '14px sans-serif',
		fill: new Fill({ color: '#000' }),
		stroke: new Stroke({ color: '#fff', width: 3 })
	})
});
```

### Style Function (Dynamic)

```typescript
function styleFunction(feature: Feature, resolution: number): Style | Style[] {
	const type = feature.get('type');
	return styles[type] || defaultStyle;
}
```

### Style Caching (CRITICAL for Performance)

```typescript
const MAX_CACHE_SIZE = 100;
const styleCache = new Map<string, Style>();

function getCachedStyle(key: string, factory: () => Style): Style {
	if (styleCache.has(key)) return styleCache.get(key)!;

	// LRU eviction
	if (styleCache.size >= MAX_CACHE_SIZE) {
		const firstKey = styleCache.keys().next().value;
		if (firstKey !== undefined) styleCache.delete(firstKey);
	}

	const style = factory();
	styleCache.set(key, style);
	return style;
}
```

## Overlays

### Creating Overlays

```typescript
import Overlay from 'ol/Overlay';

const overlay = new Overlay({
	element: htmlElement,
	positioning: 'bottom-center',
	offset: [0, -10],
	stopEvent: false,
	autoPan: { animation: { duration: 250 } }
});

map.addOverlay(overlay);
overlay.setPosition(coordinate); // Show at coordinate
overlay.setPosition(undefined); // Hide
```

### Cleanup Pattern (MANDATORY in this project)

```typescript
export interface OverlayResult {
	overlay: Overlay;
	cleanup: () => void;
}

export function createOverlay(element: HTMLElement, map: Map): OverlayResult {
	const overlay = new Overlay({ element });
	const cache = new Map();

	const handleClick = (evt: MapBrowserEvent<UIEvent>) => {
		/* ... */
	};
	const handlePointerMove = (evt: MapBrowserEvent<UIEvent>) => {
		/* ... */
	};

	map.addOverlay(overlay);
	map.on('click', handleClick);
	map.on('pointermove', handlePointerMove);

	const cleanup = () => {
		map.un('click', handleClick);
		map.un('pointermove', handlePointerMove);
		map.removeOverlay(overlay);
		cache.clear();
	};

	return { overlay, cleanup };
}
```

## Events

### Map Events

```typescript
// Click on map
map.on('click', (evt: MapBrowserEvent<UIEvent>) => {
	const coordinate = evt.coordinate;
	const pixel = evt.pixel;

	// Find feature at click location
	map.forEachFeatureAtPixel(pixel, (feature, layer) => {
		// Handle feature click
	});
});

// Pointer move (hover)
map.on('pointermove', (evt) => {
	const hit = map.hasFeatureAtPixel(evt.pixel);
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// View changes
map.getView().on('change:resolution', () => {
	const zoom = map.getView().getZoom();
});
```

### Custom Events (Project Pattern)

```typescript
// types.ts
export const CLICK_LOGBOOK_EVENT = 'clickLogbook';
export interface LogbookClickEvent extends BaseEvent {
	type: typeof CLICK_LOGBOOK_EVENT;
	feature: Feature<Geometry> | RenderFeature;
}

// Dispatch
map.dispatchEvent({
	type: CLICK_LOGBOOK_EVENT,
	feature: clickedFeature
} as unknown as BaseEvent);

// Type-safe listener with cleanup
export function onLogbookClick(map: Map, callback: (event: LogbookClickEvent) => void): () => void {
	const handler = (event: BaseEvent) => callback(event as LogbookClickEvent);
	map.on(CLICK_LOGBOOK_EVENT, handler);
	return () => map.un(CLICK_LOGBOOK_EVENT, handler);
}
```

## Feature Detection

```typescript
import { getFeatureAtEventPixel } from '$lib/ol/overlays/getFeatureAtEventPixel';

// Get feature at click position
map.on('click', (evt) => {
	const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

	if (feature) {
		// Check if it's a cluster
		const features = feature.get('features');
		if (features && features.length > 1) {
			// It's a cluster with multiple features
		} else {
			// Single feature (or cluster with 1)
			const singleFeature = features ? features[0] : feature;
		}
	}
});
```

## Controls & Interactions

### Built-in Controls

```typescript
import { defaults as defaultControls, ScaleLine, FullScreen, ZoomSlider } from 'ol/control';

new Map({
	controls: defaultControls().extend([new ScaleLine(), new FullScreen(), new ZoomSlider()])
});
```

### Custom Interactions

```typescript
import { Select, DragBox } from 'ol/interaction';

const select = new Select({
	condition: click,
	style: selectedStyle
});
map.addInteraction(select);
```

## Performance

### Feature Count Guidelines

| Features     | Strategy                                 |
| ------------ | ---------------------------------------- |
| < 1,000      | Render directly with VectorLayer         |
| 1,000-10,000 | Use Cluster source or WebGLVectorLayer   |
| > 10,000     | Use VectorTileLayer or simplify geometry |

### Rendering Optimization

- **Style caching**: Always cache styles (LRU pattern above)
- **Declutter**: Set `declutter: true` on layers with text/icons
- **WebGL**: Use WebGLVectorLayer for large feature counts
- **Image optimization**: Compress tile images, use WebP
- **Tile preloading**: Set `preload: 2` on TileLayer for smoother panning

### Memory Management Checklist

When creating OpenLayers resources, ALWAYS provide cleanup:

- [ ] Remove event listeners: `map.un('event', handler)`
- [ ] Remove overlays: `map.removeOverlay(overlay)`
- [ ] Clear caches: `cache.clear()`
- [ ] Clear style caches: `styleCache.clear()`
- [ ] Nullify feature references: `currentFeature = null`
- [ ] Dispose map on unmount: `map.setTarget(undefined)`

## Integration with Svelte 5

### Map Factory

```typescript
// src/lib/ol/map.ts
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

### Store for Map Instance

```typescript
// src/lib/stores.ts — Use store (not runes) for OL Map
import { writable } from 'svelte/store';
export const map: Writable<Map> = writable();
```

### $effect with Cleanup

```svelte
<script lang="ts">
  import { map } from '$lib/stores';

  $effect(() => {
    if (!$map) return;

    const { cleanup } = createTooltipOverlay(tooltipElement, $map);

    return () => {
      cleanup(); // MANDATORY
    };
  });
</script>
```

## Project-Specific (tss2012)

### Layer Stack (src/lib/ol/map.ts)

```
4. Logbook Layer (top)  — Clustered markers (GeoJSON)
3. Track Layer          — Sailing route (KML)
2. SeaMap Overlay       — Nautical charts (XYZ tiles)
1. OSM Base Layer       — OpenStreetMap (OSM source)
```

### Key Files

| File                                            | Purpose                             |
| ----------------------------------------------- | ----------------------------------- |
| `src/lib/ol/map.ts`                             | Map factory, layer order            |
| `src/lib/ol/layers/logbook.ts`                  | Cluster source, style cache         |
| `src/lib/ol/layers/track.ts`                    | KML track layer                     |
| `src/lib/ol/layers/osm.ts`                      | Base map tiles                      |
| `src/lib/ol/layers/seamap.ts`                   | Nautical overlay                    |
| `src/lib/ol/overlays/tooltip.ts`                | Tooltip with cleanup pattern        |
| `src/lib/ol/overlays/getFeatureAtEventPixel.ts` | Feature detection                   |
| `src/lib/ol/constants.ts`                       | Default center [10.5, 54.5], zoom 8 |
| `src/lib/types.ts`                              | Custom event types                  |

### Data Sources

- Logbook entries: `static/data/logbook_geo.json` (GeoJSON, EPSG:4326)
- Sailing track: `static/data/segelsommer2012.kml` (KML)
