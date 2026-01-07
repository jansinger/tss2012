# CLAUDE.md - Ein tierischer Segelsommer 2012

## Project Overview

**Ein tierischer Segelsommer 2012** is a SvelteKit-based web application that visualizes a 2012 sailing journey through an interactive map and timeline. The application combines OpenLayers for mapping capabilities with a blog-style logbook to display the sailing route, waypoints, and journal entries on an interactive map.

**Live URL**: https://www.ein-tierischer-segelsommer.de
**Deployment**: Netlify (static site)

---

## Technology Stack

### Core Framework

- **SvelteKit 2.x** (v2.48.5) - Full-stack framework with static adapter
- **Svelte 5.x** (v5.43.0) - UI component framework with runes API
- **TypeScript** (v5.9.3) - Type-safe development
- **Vite 7.x** (v7.1.12) - Build tool and dev server

### Mapping & Visualization

- **OpenLayers** (v10.7.0) - Interactive map rendering
  - Vector layers (KML, GeoJSON)
  - Clustering for logbook entries
  - Custom overlays and tooltips
  - Multiple tile layers (OSM, SeaMap)

### UI & Styling

- **SASS/SCSS** (v1.93.2) - CSS preprocessing
- **Bootstrap Icons** (v1.13.1) - Icon library
- **Swiper** (v12.0.3) - Image carousel/slider

### Testing

- **Vitest** (v4.0.15) - Unit testing framework
- **@testing-library/svelte** (v5.2.9) - Component testing
- **@testing-library/jest-dom** (v6.9.1) - DOM matchers
- **jsdom** (v27.0.0) - DOM implementation for testing

### Code Quality

- **ESLint** (v9.39.1) + TypeScript plugin - Linting
- **Prettier** (v3.6.2) + Svelte plugin - Code formatting
- **svelte-check** (v4.3.3) - TypeScript/Svelte validation

### Deployment

- **@sveltejs/adapter-static** - Static site generation
- **Netlify** - Hosting and CI/CD

Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

---

## Project Structure

```
tss2012/
├── src/
│   ├── lib/                      # Reusable library code
│   │   ├── components/           # Svelte components
│   │   │   ├── LogbookMap.svelte          # Main map component
│   │   │   ├── LogbookEntry.svelte        # Single entry display
│   │   │   ├── LogbookEntries.svelte      # Multiple entries list
│   │   │   ├── LogbookEntriesOverlay.svelte  # Overlay for entries
│   │   │   ├── OverviewMap.svelte         # Mini overview map
│   │   │   ├── Pictures.svelte            # Image gallery
│   │   │   └── Overlay.svelte             # Generic overlay
│   │   ├── ol/                   # OpenLayers configuration
│   │   │   ├── layers/           # Map layer definitions
│   │   │   │   ├── logbook.ts    # Logbook markers (clustered)
│   │   │   │   ├── track.ts      # Sailing route (KML)
│   │   │   │   ├── osm.ts        # OpenStreetMap tiles
│   │   │   │   └── seamap.ts     # Nautical chart overlay
│   │   │   ├── overlays/         # Map overlays
│   │   │   │   ├── tooltip.ts    # Tooltip overlay logic
│   │   │   │   ├── createTooltipHTML.ts  # Tooltip HTML generation
│   │   │   │   └── getFeatureAtEventPixel.ts  # Feature detection
│   │   │   ├── map.ts            # Main map factory
│   │   │   ├── overviewmap.ts    # Overview map factory
│   │   │   └── constants.ts      # Map constants (center, zoom)
│   │   ├── utils/                # Utility functions
│   │   │   ├── sortEntries.ts    # Entry sorting logic
│   │   │   └── striphtml.ts      # HTML sanitization
│   │   ├── data/                 # Static data files
│   │   │   ├── logbook.json      # Logbook entries
│   │   │   └── logbook_orig.json # Original backup
│   │   ├── scss/                 # Global styles
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── stores.ts             # Svelte stores (map store)
│   │   ├── AppState.svelte.ts    # Svelte 5 runes state
│   │   └── sortedEntries.ts      # Pre-sorted entries helper
│   ├── routes/                   # SvelteKit file-based routing
│   │   ├── +layout.svelte        # Root layout
│   │   ├── +page.svelte          # Home page (map view)
│   │   ├── +error.svelte         # Error page
│   │   ├── log/                  # Logbook routes
│   │   │   ├── +page.svelte      # Logbook list
│   │   │   └── [id]/+page.svelte # Individual entry
│   │   ├── timeline/             # Timeline view
│   │   │   └── +page.svelte      # Timeline page
│   │   └── impressum/            # Imprint/legal
│   │       └── +page.svelte
│   ├── mocks/                    # Test mocks
│   ├── tools/                    # Build/processing scripts
│   ├── app.html                  # HTML template
│   └── global.d.ts               # Global type declarations
├── static/                       # Static assets
│   ├── data/                     # GeoJSON, KML data
│   ├── images/                   # User images
│   └── pics/                     # UI graphics
├── build/                        # Production build output
├── .svelte-kit/                  # SvelteKit generated files
├── package.json
├── tsconfig.json
├── svelte.config.js
├── vite.config.js
├── vitest.config.js
├── netlify.toml
└── README.md
```

---

## Architecture & Design Patterns

### 1. **Component-Based Architecture**

- **Single Responsibility Principle**: Each component has a clear, focused purpose
- **Composition over Inheritance**: Components compose smaller components
- **Separation of Concerns**: Business logic separated from presentation

**Example**:

- `LogbookMap.svelte` - Handles map initialization and events
- `LogbookEntry.svelte` - Displays a single entry
- `LogbookEntriesOverlay.svelte` - Manages overlay display logic

### 2. **Factory Pattern**

Used for creating OpenLayers map instances with consistent configuration.

**Files**:

- [src/lib/ol/map.ts](src/lib/ol/map.ts) - `createMap()` factory
- [src/lib/ol/overviewmap.ts](src/lib/ol/overviewmap.ts) - `createOverviewMap()` factory

**Benefits**:

- Centralized configuration
- Consistent defaults
- Easy testing with dependency injection
- DRY (Don't Repeat Yourself) principle

### 3. **Module Pattern**

OpenLayers layers and overlays are exported as modules with encapsulated configuration.

**Files**:

- [src/lib/ol/layers/logbook.ts](src/lib/ol/layers/logbook.ts)
- [src/lib/ol/layers/track.ts](src/lib/ol/layers/track.ts)
- [src/lib/ol/layers/osm.ts](src/lib/ol/layers/osm.ts)
- [src/lib/ol/layers/seamap.ts](src/lib/ol/layers/seamap.ts)

### 4. **State Management**

#### Svelte 5 Runes (`$state`)

- **File**: [src/lib/AppState.svelte.ts](src/lib/AppState.svelte.ts)
- **Purpose**: Reactive global state for current entries
- **Pattern**: Global state object with reactive properties

```typescript
export const AppState = $state({
	currentEntries: []
});
```

#### Svelte Stores

- **File**: [src/lib/stores.ts](src/lib/stores.ts)
- **Purpose**: Writable store for OpenLayers Map instance
- **Pattern**: Singleton store pattern

```typescript
export const map: Writable<Map> = writable();
```

### 5. **Layered Architecture**

```
┌─────────────────────────────────────────┐
│  Presentation Layer (Svelte Components) │
├─────────────────────────────────────────┤
│  Business Logic (Utils, Helpers)        │
├─────────────────────────────────────────┤
│  Data Layer (JSON, Stores, Types)       │
├─────────────────────────────────────────┤
│  Infrastructure (OpenLayers, Vite)      │
└─────────────────────────────────────────┘
```

### 6. **File-Based Routing**

SvelteKit's convention-based routing with:

- `+page.svelte` - Page components
- `+layout.svelte` - Layout wrappers
- `+page.ts` / `+layout.ts` - Data loading
- `[id]` - Dynamic route parameters

---

## Key Architectural Guidelines

### DRY (Don't Repeat Yourself)

✅ **Applied**:

- Factory functions for map creation (`createMap`, `createOverviewMap`)
- Shared types in [src/lib/types.ts](src/lib/types.ts)
- Reusable components (`Overlay.svelte`, `Pictures.svelte`)
- Centralized constants in [src/lib/ol/constants.ts](src/lib/ol/constants.ts)
- Style caching in logbook layer to avoid recreating styles

⚠️ **Watch for**:

- Route-specific data loading logic could be abstracted
- Similar SCSS patterns across components

### KISS (Keep It Simple, Stupid)

✅ **Applied**:

- Straightforward component hierarchy
- Clear naming conventions
- Minimal abstractions where not needed
- Direct data flow (props, events)
- Simple state management (stores + runes)

### SOLID Principles

#### Single Responsibility Principle (SRP)

✅ Each module has one reason to change:

- Components handle UI only
- Layers handle map rendering only
- Utils handle specific transformations
- Stores handle state only

#### Open/Closed Principle (OCP)

✅ **Applied**:

- New map layers can be added without modifying existing layers
- OpenLayers configuration is extensible
- Components accept props for customization

#### Dependency Inversion Principle (DIP)

✅ **Applied**:

- Components depend on stores (abstractions), not concrete implementations
- Factory functions accept parameters for flexibility
- TypeScript interfaces define contracts ([src/lib/types.ts](src/lib/types.ts))

### Idempotency

✅ **Applied in**:

- Map initialization checks if map already exists before creating
  ```typescript
  if ($map) {
  	$map.setTarget(mapElement);
  	$map.updateSize();
  	return;
  }
  ```
- Layer creation functions can be called multiple times safely
- Component mounting/unmounting is handled safely

### Immutability

✅ **Preferred patterns**:

- TypeScript readonly interfaces where appropriate
- Functional utilities (sort, filter, map) instead of mutations
- Svelte's reactive declarations create new values

⚠️ **Watch for**:

- State mutations should use Svelte's reactive patterns
- Array/object updates should trigger reactivity

### Separation of Concerns

✅ **Clear separation**:

- **UI**: Svelte components
- **Map Logic**: OpenLayers modules
- **Data**: JSON files + TypeScript types
- **Styling**: SCSS files
- **Routing**: SvelteKit file structure
- **Testing**: Separate `.spec.ts` files

---

## Svelte 5 Best Practices

### Runes Usage

This project fully uses Svelte 5 runes:

- **`$state`**: For reactive state (`AppState.svelte.ts`)
- **`$derived`**: For computed values (`LogbookEntries.svelte`)
- **`$effect`**: For side effects with cleanup
- **`$props`**: For component props (all components)
- **`$bindable`**: For two-way binding (`LogbookEntriesOverlay.svelte`)

### $effect Cleanup Pattern

Always return a cleanup function from `$effect` when managing resources:

```typescript
$effect(() => {
	// Setup code
	const handler = () => {
		/* ... */
	};
	map.on('click', handler);

	// Return cleanup function
	return () => {
		map.un('click', handler);
	};
});
```

### Avoid Legacy Patterns

- ❌ Do NOT use `$:` reactive statements (Svelte 4 syntax)
- ✅ Use `$effect` for side effects
- ✅ Use `$derived` for computed values

---

## Code Style & Conventions

### TypeScript

- **Partial strict mode**: Enabled (`strictBindCallApply`, `noImplicitThis`, `isolatedModules`, `forceConsistentCasingInFileNames`)
- **Type imports**: Use `import type` for type-only imports
- **Interfaces over types**: Prefer `interface` for object shapes
- **Explicit types**: Function parameters and return types should be typed
- **Custom events**: Use type-safe helper functions for OpenLayers custom events (see `onLogbookClick` in types.ts)

### Formatting (Prettier)

```json
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `LogbookMap.svelte`)
- **Files**: camelCase for utilities, PascalCase for components
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULTS`)
- **Functions**: camelCase, descriptive verbs (e.g., `createMap`, `sortEntries`)
- **Types/Interfaces**: PascalCase (e.g., `LogEntry`, `Coordinates`)

### Component Structure

```svelte
<script lang="ts" module>
  // Module-level code
</script>

<script lang="ts">
  // Component imports
  // Props and state
  // Reactive declarations
  // Functions
  // Lifecycle hooks
</script>

<!-- Template -->

<style lang="scss">
  /* Scoped styles */
</style>
```

---

## Data Flow

### 1. Map Initialization Flow

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

### 2. Logbook Entry Selection Flow

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

### 3. Data Loading Flow

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

## OpenLayers Integration

### Layer Stack (Bottom to Top)

1. **OSM Base Layer** - OpenStreetMap tiles
2. **SeaMap Overlay** - Nautical charts
3. **Track Layer** - Sailing route (KML)
4. **Logbook Layer** - Clustered markers (GeoJSON)

### Custom Events

- `clickLogbook` - Fired when logbook marker is clicked
  - Emitted in: [src/lib/ol/overlays/tooltip.ts](src/lib/ol/overlays/tooltip.ts)
  - Handled in: [src/lib/components/LogbookMap.svelte](src/lib/components/LogbookMap.svelte)

### Clustering Strategy

- **Distance**: 50px between clusters
- **Min Distance**: 20px minimum separation
- **Style Cache**: LRU cache with max 100 entries to prevent unbounded memory growth
- **Single vs Cluster**:
  - Single feature → Custom marker icon
  - Cluster → Circle with count text

### Memory Management

- **Tooltip Overlay**: Returns cleanup function to remove event listeners and clear cache
- **Map Components**: Use `$effect` with return cleanup function for proper resource disposal
- **Style Cache**: LRU eviction prevents memory leaks for cluster styles

---

## Testing Strategy

### Unit Testing

- **Framework**: Vitest + Testing Library
- **Coverage**: Components, utilities, OpenLayers modules, state management
- **Coverage Thresholds**: 70% for lines, functions, statements; 50% for branches
- **Mock Strategy**:
  - Virtual modules for SvelteKit imports
  - `jsdom` for DOM environment
  - Mocks in [src/mocks/](src/mocks/)

### Test Files

- Co-located with implementation (`*.spec.ts`)
- Example: [src/lib/components/LogbookMap.spec.ts](src/lib/components/LogbookMap.spec.ts)

### Running Tests

```bash
npm run test          # Run tests in watch mode
npm run build-ci      # Build + test (CI pipeline)
```

---

## Build & Deployment

### Development

```bash
npm run dev           # Start dev server
npm run check         # TypeScript + Svelte validation
npm run lint          # ESLint + Prettier check
npm run format        # Prettier auto-format
```

### Production Build

```bash
npm run build         # Vite build (static site)
npm run preview       # Preview production build
```

### CI/CD Pipeline (Netlify)

1. **Trigger**: Git push to main branch
2. **Build Command**: `npm run build-ci`
   - Runs `svelte-kit sync`
   - Runs `vite build`
   - Runs `vitest run` (tests)
3. **Publish Directory**: `build/`
4. **Headers**: CSP configured in [netlify.toml](netlify.toml)

### Security Headers

Content Security Policy includes:

- `script-src`: Self + FontAwesome
- `style-src`: Self + Google Fonts
- `img-src`: Self + MapTiler + OpenSeaMap
- `connect-src`: Self + FontAwesome API

---

## Performance Considerations

### Optimization Techniques

1. **Code Splitting**: Vite automatic chunking
2. **Lazy Loading**: Map creation is dynamic import
3. **Style Caching**: OpenLayers styles cached by cluster size
4. **Static Generation**: Pre-rendered at build time
5. **Image Optimization**: Images served from static directory
6. **Chunk Size**: Warning limit set to 1000KB

### Best Practices

- ✅ Use `bind:this` for DOM references
- ✅ Defer map initialization until DOM ready
- ✅ Cache frequently used computations
- ✅ Use OpenLayers view recycling
- ✅ Minimize re-renders with reactive declarations

---

## Common Development Tasks

### Adding a New Map Layer

1. Create layer file in `src/lib/ol/layers/`
2. Export layer factory/instance
3. Import in `src/lib/ol/map.ts`
4. Add to `layers` array in `createMap()`

### Adding a New Route

1. Create `routes/[route-name]/+page.svelte`
2. Optionally add `+page.ts` for data loading
3. Update navigation links

### Adding a New Component

1. Create `src/lib/components/ComponentName.svelte`
2. Create tests in `src/lib/components/ComponentName.spec.ts`
3. Import and use in parent components

### Updating Types

1. Modify `src/lib/types.ts`
2. TypeScript will show errors where updates needed
3. Run `npm run check` to validate

---

## Dependencies Management

### Update Strategy

- **Dependabot**: Automated PR for dependency updates
- **Testing**: CI runs tests on all PRs
- **Pinning**: Exact versions in `package.json` for stability

### Critical Dependencies

- **Svelte/SvelteKit**: Follow migration guides carefully
- **OpenLayers**: Check breaking changes in major versions
- **Vite**: Usually backward compatible
- **TypeScript**: Enable strict mode gradually

---

## Troubleshooting

### Map Not Rendering

1. Check `mapElement` is bound correctly
2. Verify `map.setTarget()` called after DOM ready
3. Call `map.updateSize()` after container resize
4. Check browser console for OpenLayers errors

### State Not Updating

1. For Svelte 5, use `$effect` instead of `$:` for side effects
2. For Svelte 5 runes, use `$state` correctly
3. Check store subscriptions with `$map` prefix
4. Verify mutations trigger reactivity
5. Ensure `$effect` cleanup functions are implemented for resource disposal

### Build Errors

1. Run `npm run check` for TypeScript errors
2. Clear `.svelte-kit` directory
3. Delete `node_modules` and reinstall
4. Check Node.js version compatibility

### Test Failures

1. Check mocks are up to date
2. Verify virtual modules resolve correctly
3. Ensure `jsdom` environment is set
4. Review test isolation

---

## Project-Specific Notes

### Data Sources

- **Logbook Data**: `static/data/logbook_geo.json` (GeoJSON format)
- **Track Data**: `static/data/segelsommer2012.kml` (KML format)
- **Images**: `static/images/` (referenced in logbook JSON)

### Map Configuration

- **Default Center**: Defined in [src/lib/ol/constants.ts](src/lib/ol/constants.ts)
- **Default Zoom**: 8
- **Projection**: Web Mercator (EPSG:3857)

### Legacy Considerations

- `logbook_orig.json` kept as backup/reference
- Fully migrated to Svelte 5 runes API (`$state`, `$derived`, `$effect`, `$props`, `$bindable`)
- Browser support: Modern browsers (ES2021)

---

## Git Workflow

### Branch Strategy

- **Main Branch**: `main` (production)
- **Feature Branches**: Short-lived, merged via PR
- **Dependabot**: Automated dependency updates

### Commit Guidelines

- Descriptive commit messages
- Reference issue numbers where applicable
- Squash commits for cleaner history

---

## Resources

### Documentation

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte/overview)
- [OpenLayers Docs](https://openlayers.org/en/latest/apidoc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### External Services

- **Map Tiles**: OpenStreetMap, MapTiler
- **Nautical Charts**: OpenSeaMap
- **Icons**: Bootstrap Icons
- **Hosting**: Netlify

---

## Contributing

When working on this project:

1. **Follow existing patterns** - Maintain consistency with established architecture
2. **Write tests** - Add tests for new components and utilities
3. **Type everything** - Use TypeScript for all new code
4. **Format code** - Run `npm run format` before committing
5. **Validate changes** - Run `npm run check` and `npm run lint`
6. **Document complex logic** - Add JSDoc comments for functions
7. **Keep it simple** - Prefer simple solutions over clever ones
8. **Think DRY** - Extract reusable code into utilities/components
9. **Maintain idempotency** - Ensure functions can be called multiple times safely
10. **Test thoroughly** - Run full test suite before pushing

---

## License & Contact

Refer to repository for license information and contact details.

---

**Last Updated**: 2026-01-07
**Svelte Version**: 5.43.0
**SvelteKit Version**: 2.48.5
