# CLAUDE.md - Ein tierischer Segelsommer 2012

## Project Overview

**Ein tierischer Segelsommer 2012** is a SvelteKit-based web application that visualizes a 2012 sailing journey through an interactive map and timeline.

- **Live URL**: https://www.ein-tierischer-segelsommer.de
- **Deployment**: Netlify (static site)

---

## Technology Stack

| Category  | Technology                            |
| --------- | ------------------------------------- |
| Framework | SvelteKit 2.x, Svelte 5.x (runes API) |
| Language  | TypeScript 5.x                        |
| Mapping   | OpenLayers 10.x                       |
| Styling   | SASS/SCSS, Bootstrap Icons            |
| Testing   | Vitest, Testing Library               |
| Build     | Vite 7.x                              |

**Always use Context7** for code generation, setup, or library documentation. Automatically use the Context7 MCP tools to resolve library id and get docs.

---

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── ol/             # OpenLayers (map.ts, layers/, overlays/)
│   ├── utils/          # Utilities (sortEntries, striphtml)
│   ├── types.ts        # TypeScript types
│   ├── stores.ts       # Svelte stores (map)
│   └── AppState.svelte.ts  # Svelte 5 runes state
├── routes/             # SvelteKit pages
└── mocks/              # Test mocks
static/
├── data/               # GeoJSON, KML data
└── images/             # User images
```

---

## Critical Rules

### Svelte 5 Runes Only

```typescript
// GOOD - Svelte 5
let count = $state(0);
let doubled = $derived(count * 2);
$effect(() => {
	/* ... */
});

// BAD - Do NOT use Svelte 4 syntax
$: doubled = count * 2; // FORBIDDEN
```

### $effect Cleanup (MANDATORY)

Always return cleanup function when managing resources:

```typescript
$effect(() => {
	map.on('click', handler);
	return () => map.un('click', handler); // REQUIRED
});
```

### TypeScript

- Type all function parameters and return values
- Use `import type` for type-only imports
- Prefer `interface` over `type` for objects

---

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run check        # TypeScript validation
npm run lint         # ESLint + Prettier
npm run test         # Run tests
npm run build        # Production build
```

---

## Documentation

### Claude Guidelines (`.claude/`)

| Document                                           | Purpose                           |
| -------------------------------------------------- | --------------------------------- |
| [.claude/README.md](.claude/README.md)             | Documentation index               |
| [.claude/ARCHITECTURE.md](.claude/ARCHITECTURE.md) | Design patterns, SOLID, data flow |
| [.claude/SECURITY.md](.claude/SECURITY.md)         | CSP, XSS prevention               |
| [.claude/TESTING.md](.claude/TESTING.md)           | Vitest, coverage, mocking         |

### General Documentation (`docs/`)

| Document                                                     | Purpose                        |
| ------------------------------------------------------------ | ------------------------------ |
| [docs/OPTIMIZATION.md](docs/OPTIMIZATION.md)                 | Performance optimization guide |
| [docs/DEV_CONSOLE_WARNINGS.md](docs/DEV_CONSOLE_WARNINGS.md) | Vite dev warnings explained    |

### Technology Rules (Auto-loaded)

| Rule                                                                 | Scope             |
| -------------------------------------------------------------------- | ----------------- |
| [svelte5-patterns.md](.claude/rules/svelte5-patterns.md)             | `src/**/*.svelte` |
| [openlayers-integration.md](.claude/rules/openlayers-integration.md) | `src/lib/ol/**`   |
| [sveltekit-routing.md](.claude/rules/sveltekit-routing.md)           | `src/routes/**`   |

### Sub-Agents

| Trigger                    | Agent                                                              |
| -------------------------- | ------------------------------------------------------------------ |
| "create component"         | [component-creator](.claude/agents/component-creator.md)           |
| "map feature", "add layer" | [map-feature-specialist](.claude/agents/map-feature-specialist.md) |
| "write test", "coverage"   | [test-runner](.claude/agents/test-runner.md)                       |
| "review code"              | [code-reviewer](.claude/agents/code-reviewer.md)                   |
| "update docs", "JSDoc"     | [documentation-writer](.claude/agents/documentation-writer.md)     |

---

## Key Files

| File                             | Purpose                              |
| -------------------------------- | ------------------------------------ |
| `src/lib/types.ts`               | TypeScript type definitions          |
| `src/lib/stores.ts`              | Svelte stores (map instance)         |
| `src/lib/AppState.svelte.ts`     | Global app state ($state)            |
| `src/lib/ol/map.ts`              | Map factory function                 |
| `src/lib/ol/overlays/tooltip.ts` | Tooltip overlay with cleanup pattern |

---

## Contributing

1. Use Svelte 5 runes only (no `$:`)
2. Include `$effect` cleanup functions
3. Type everything with TypeScript
4. Run `npm run check && npm run lint && npm run test`
5. Follow patterns in existing code

---

**Last Updated**: 2026-01-07
