# Claude Code Documentation Index

This directory contains modular documentation for the **Ein tierischer Segelsommer 2012** project, organized for efficient Claude Code assistance.

## Documentation Map

```
.claude/
├── README.md                 # This file - Navigation index
├── ARCHITECTURE.md           # Design patterns, SOLID, data flow
├── SECURITY.md               # CSP, XSS prevention, secure coding
├── TESTING.md                # Vitest, coverage, mocking strategies
├── rules/                    # Path-scoped auto-loaded rules
│   ├── svelte5-patterns.md   # Svelte 5 runes patterns
│   ├── openlayers-integration.md  # OpenLayers map patterns
│   └── sveltekit-routing.md  # SvelteKit routing patterns
└── agents/                   # Specialized sub-agents
    ├── component-creator.md      # Create Svelte components
    ├── map-feature-specialist.md # OpenLayers features
    ├── test-runner.md            # Write and run tests
    ├── code-reviewer.md          # Code quality review
    └── documentation-writer.md   # JSDoc and README updates
```

---

## When to Use Which Document

| Task | Document |
|------|----------|
| Understanding project architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Security review or CSP changes | [SECURITY.md](SECURITY.md) |
| Writing or debugging tests | [TESTING.md](TESTING.md) |
| Working with Svelte 5 runes | [rules/svelte5-patterns.md](rules/svelte5-patterns.md) |
| Map features or OpenLayers | [rules/openlayers-integration.md](rules/openlayers-integration.md) |
| Adding routes or pages | [rules/sveltekit-routing.md](rules/sveltekit-routing.md) |

---

## Sub-Agent Trigger Phrases

| Trigger Phrase | Agent | Purpose |
|----------------|-------|---------|
| "create component", "new component" | component-creator | Create Svelte 5 components |
| "map feature", "add layer", "overlay" | map-feature-specialist | OpenLayers customizations |
| "write test", "add test", "coverage" | test-runner | Test creation and coverage |
| "review code", "check quality" | code-reviewer | Code quality validation |
| "update docs", "add JSDoc" | documentation-writer | Documentation updates |

---

## Quick Links

### Project
- **Live Site**: https://www.ein-tierischer-segelsommer.de
- **Main CLAUDE.md**: [../CLAUDE.md](../CLAUDE.md)

### External Resources
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte/overview)
- [OpenLayers API](https://openlayers.org/en/latest/apidoc/)

### Key Project Files
- Types: [src/lib/types.ts](../src/lib/types.ts)
- Map Factory: [src/lib/ol/map.ts](../src/lib/ol/map.ts)
- App State: [src/lib/AppState.svelte.ts](../src/lib/AppState.svelte.ts)

---

## Document Maintenance

When updating documentation:
1. Keep each file focused on its specific domain
2. Update cross-references when file paths change
3. Use relative links for internal references
4. Keep the main CLAUDE.md concise (~100-150 lines)
