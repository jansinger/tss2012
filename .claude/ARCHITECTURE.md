# Architecture & Design Patterns

This document describes the architectural patterns and design principles used in the **Ein tierischer Segelsommer 2012** project.

---

## Layered Architecture

```
┌─────────────────────────────────────────┐
│  Presentation Layer (Svelte Components) │
│  - LogbookMap, LogbookEntry, Overlay    │
├─────────────────────────────────────────┤
│  Business Logic (Utils, Helpers)        │
│  - sortEntries, striphtml               │
├─────────────────────────────────────────┤
│  Data Layer (JSON, Stores, Types)       │
│  - stores.ts, AppState.svelte.ts        │
├─────────────────────────────────────────┤
│  Infrastructure (OpenLayers, Vite)      │
│  - map.ts, layers/, overlays/           │
└─────────────────────────────────────────┘
```

---

## Design Patterns

### 1. Factory Pattern

Used for creating OpenLayers map instances with consistent configuration.

**Files**:
- [src/lib/ol/map.ts](../src/lib/ol/map.ts) - `createMap()` factory
- [src/lib/ol/overviewmap.ts](../src/lib/ol/overviewmap.ts) - `createOverviewMap()` factory

**Benefits**:
- Centralized configuration
- Consistent defaults
- Easy testing with dependency injection
- DRY principle applied

### 2. Module Pattern

OpenLayers layers and overlays are exported as modules with encapsulated configuration.

**Files**:
- [src/lib/ol/layers/logbook.ts](../src/lib/ol/layers/logbook.ts) - Clustered markers
- [src/lib/ol/layers/track.ts](../src/lib/ol/layers/track.ts) - Sailing route (KML)
- [src/lib/ol/layers/osm.ts](../src/lib/ol/layers/osm.ts) - Base map tiles
- [src/lib/ol/layers/seamap.ts](../src/lib/ol/layers/seamap.ts) - Nautical overlay

### 3. Singleton Pattern

Used for global state management via Svelte stores.

**File**: [src/lib/stores.ts](../src/lib/stores.ts)
```typescript
export const map: Writable<Map> = writable();
```

### 4. State Management

#### Svelte 5 Runes (`$state`)

**File**: [src/lib/AppState.svelte.ts](../src/lib/AppState.svelte.ts)
```typescript
export const AppState = $state({
    currentEntries: []
});
```

**When to use**:
- Svelte 5 runes (`$state`) - For reactive component/app state
- Svelte stores - For values shared across components (like the map instance)

---

## Data Flow Diagrams

### Map Initialization Flow

```
+page.svelte
    ↓
LogbookMap.svelte (bind elements)
    ↓
initMap() → createMap()
    ↓
map.set(newMap) → stores.ts
    ↓
createTooltipOverlay()
    ↓
Event listeners attached
```

### Logbook Entry Selection Flow

```
User clicks map marker
    ↓
clickLogbook event handler
    ↓
If single feature → goto('/log/{id}')
If cluster → AppState.currentEntries = features
    ↓
LogbookEntriesOverlay reacts to state change
    ↓
Displays overlay with entries
```

### Data Loading Flow

```
Static JSON files in /static/data/
    ↓
OpenLayers vector sources (GeoJSON, KML)
    ↓
Layers render on map
    ↓
Features accessible via map events
```

---

## SOLID Principles

### Single Responsibility Principle (SRP)

Each module has one reason to change:

| Module Type | Responsibility |
|-------------|---------------|
| Components | UI rendering only |
| Layers | Map rendering only |
| Utils | Specific transformations |
| Stores | State management only |

### Open/Closed Principle (OCP)

- New map layers can be added without modifying existing layers
- OpenLayers configuration is extensible
- Components accept props for customization

### Dependency Inversion Principle (DIP)

- Components depend on stores (abstractions), not concrete implementations
- Factory functions accept parameters for flexibility
- TypeScript interfaces define contracts ([src/lib/types.ts](../src/lib/types.ts))

---

## Key Architectural Guidelines

### DRY (Don't Repeat Yourself)

**Applied**:
- Factory functions for map creation (`createMap`, `createOverviewMap`)
- Shared types in [src/lib/types.ts](../src/lib/types.ts)
- Reusable components (`Overlay.svelte`, `Pictures.svelte`)
- Centralized constants in [src/lib/ol/constants.ts](../src/lib/ol/constants.ts)
- Style caching in logbook layer

### KISS (Keep It Simple, Stupid)

**Applied**:
- Straightforward component hierarchy
- Clear naming conventions
- Minimal abstractions where not needed
- Direct data flow (props, events)
- Simple state management (stores + runes)

### Idempotency

**Applied**:
- Map initialization checks if map already exists before creating
```typescript
if ($map) {
    $map.setTarget(mapElement);
    $map.updateSize();
    return;
}
```
- Layer creation functions can be called multiple times safely
- Component mounting/unmounting handled safely

### Immutability

**Preferred patterns**:
- TypeScript readonly interfaces where appropriate
- Functional utilities (sort, filter, map) instead of mutations
- Svelte's reactive declarations create new values

### Separation of Concerns

| Concern | Location |
|---------|----------|
| UI | Svelte components |
| Map Logic | OpenLayers modules (`src/lib/ol/`) |
| Data | JSON files + TypeScript types |
| Styling | SCSS files |
| Routing | SvelteKit file structure |
| Testing | Separate `.spec.ts` files |

---

## File-Based Routing

SvelteKit's convention-based routing:

| File | Purpose |
|------|---------|
| `+page.svelte` | Page components |
| `+layout.svelte` | Layout wrappers |
| `+page.ts` / `+layout.ts` | Data loading |
| `[id]` | Dynamic route parameters |

**Current Routes**:
- `/` - Home page (map view)
- `/log` - Logbook list
- `/log/[id]` - Individual entry
- `/timeline` - Timeline view
- `/impressum` - Legal imprint

---

## Component Architecture

### Component-Based Design

- **Single Responsibility**: Each component has a clear, focused purpose
- **Composition over Inheritance**: Components compose smaller components
- **Separation of Concerns**: Business logic separated from presentation

**Examples**:
- `LogbookMap.svelte` - Handles map initialization and events
- `LogbookEntry.svelte` - Displays a single entry
- `LogbookEntriesOverlay.svelte` - Manages overlay display logic

### Component Hierarchy

```
+page.svelte (route)
└── LogbookMap.svelte
    ├── OverviewMap.svelte
    └── LogbookEntriesOverlay.svelte
        └── LogbookEntries.svelte
            └── LogbookEntry.svelte
```

---

## Performance Considerations

### Optimization Techniques

1. **Code Splitting**: Vite automatic chunking
2. **Lazy Loading**: Map creation is dynamic import
3. **Style Caching**: OpenLayers styles cached by cluster size (LRU, max 100)
4. **Static Generation**: Pre-rendered at build time
5. **Image Optimization**: Images served from static directory

### Best Practices

- Use `bind:this` for DOM references
- Defer map initialization until DOM ready
- Cache frequently used computations
- Use OpenLayers view recycling
- Minimize re-renders with reactive declarations
