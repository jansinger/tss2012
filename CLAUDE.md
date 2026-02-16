# CLAUDE.md - Ein tierischer Segelsommer 2012

## Project

SvelteKit web app visualizing a 2012 sailing journey with interactive map and timeline.
**Live**: https://www.ein-tierischer-segelsommer.de | **Deployment**: Netlify (static site)

---

## Critical Mandates

### Svelte 5 Runes ONLY

- Use ONLY `$state()`, `$derived()`, `$effect()`, `$props()`, `$bindable()`
- **FORBIDDEN**: `$:` reactive statements (Svelte 4 syntax) — use `$derived()` or `$effect()` instead
- `$effect()` **MUST** return cleanup function when managing resources (event listeners, timers, overlays, subscriptions)

### TypeScript

- Type all function parameters and return values
- Use `import type` for type-only imports
- Prefer `interface` over `type` for objects

### TDD — Test-Driven Development

- **ALWAYS** write or update tests **BEFORE** implementing features, fixes, or refactors
- Workflow: Write failing test → Implement code → Verify test passes
- For bug fixes: Write a test that reproduces the bug first, then fix

### Post-Change Validation

After **every** code change, run the full validation chain:

```bash
npm run check && npm run lint && npm run test
```

Do NOT consider a task complete until all three commands pass.

### Context7

**ALWAYS** use Context7 MCP tools (`resolve-library-id` → `query-docs`) for Svelte, SvelteKit, and OpenLayers documentation. Never rely on training data for library APIs.

---

## Commands

```bash
npm run check        # TypeScript + Svelte validation (MUST pass)
npm run lint         # ESLint + Prettier (MUST pass)
npm run test         # Vitest tests (MUST pass)
npm run build-ci     # Full CI: svelte-kit sync + vite build + vitest run
```

---

## Architecture Invariants

1. **OpenLayers Layer Order** (bottom → top, in `src/lib/ol/map.ts`):
   OSM Base → SeaMap Overlay → Track Layer → Logbook Markers

2. **Static Site Generation**: All routes prerendered at build time via `@sveltejs/adapter-static`. No server-side logic, no user input processing. Data from static JSON/KML files.

3. **State Management**:
   - Component state: `$state()` in `.svelte` files
   - App-wide state: `src/lib/AppState.svelte.ts` (Svelte 5 runes)
   - Map instance: `src/lib/stores.ts` (Writable store — needed for OpenLayers integration with non-Svelte code)

---

## Key Files

| File                             | Purpose                                            |
| -------------------------------- | -------------------------------------------------- |
| `src/lib/types.ts`               | TypeScript type definitions + custom event helpers |
| `src/lib/ol/map.ts`              | Map factory (layer order defined here)             |
| `src/lib/AppState.svelte.ts`     | Global app state with $state                       |
| `src/lib/ol/overlays/tooltip.ts` | Reference cleanup pattern for overlays             |

---

## Documentation & Tools

See [.claude/README.md](.claude/README.md) for full documentation index, decision tree (Rule vs Skill vs Agent vs Hook), and available skills/agents.

Rules auto-load based on file path globs. Skills: `/svelte5-expert`, `/openlayers-expert`, `/fix-issue`, `/create-pr`, `/security-audit`, `/performance-check`

---

## Compaction Survival

When context is compacted, always preserve:

1. Full list of modified files (absolute paths)
2. Test commands and their results
3. Svelte 5 runes requirement (no `$:` syntax)
4. `$effect` cleanup requirement
5. Context7 usage mandate for library documentation
6. TDD mandate: tests before implementation
7. Post-change validation: `npm run check && npm run lint && npm run test`
8. Current task progress and remaining steps

---

**Last Updated**: 2026-02-16
