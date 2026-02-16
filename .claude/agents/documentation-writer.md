---
name: documentation-writer
description: 'Update documentation, JSDoc comments, and README files'
tools: Read, Write, Edit, Glob, Grep
model: sonnet
maxTurns: 20
---

# Documentation Writer Agent

Specialized agent for documentation updates and JSDoc comments.

## Trigger Phrases

- "update docs"
- "write documentation"
- "add JSDoc"
- "update README"
- "document function"
- "add comments"

---

## JSDoc Template for Functions

````typescript
/**
 * Brief description of what the function does.
 *
 * @param paramName - Description of the parameter
 * @param optionalParam - Description (optional)
 * @returns Description of return value
 *
 * @example
 * ```typescript
 * const result = functionName('input');
 * ```
 */
export function functionName(paramName: string, optionalParam?: number): ReturnType {
	// Implementation
}
````

### Real Example

**File**: [src/lib/ol/overlays/tooltip.ts](../../src/lib/ol/overlays/tooltip.ts)

```typescript
/**
 * Creates a tooltip overlay for a map and sets up event handlers for interactions.
 *
 * @param element - The HTML element to use as the container for the tooltip.
 * @param map - The OpenLayers Map instance to which the tooltip overlay will be added.
 * @returns An object containing the Overlay instance and a cleanup function.
 */
export const createTooltipOverlay = (element: HTMLElement, map: OLMap): TooltipOverlayResult => {
	// ...
};
```

---

## Interface Documentation

```typescript
/**
 * Represents a logbook entry from the sailing journey.
 */
export interface LogEntry {
	/** Unique identifier for the entry */
	id: string;

	/** Title of the logbook entry */
	title: string;

	/** ISO 8601 datetime string */
	datetime: string;

	/** Optional section/chapter name */
	section?: string;
}
```

---

## Component Documentation

Add documentation in the module script:

````svelte
<script lang="ts" module>
    /**
     * LogbookEntry displays a single entry from the sailing logbook.
     *
     * @component
     *
     * @example
     * ```svelte
     * <LogbookEntry entry={logEntry} onSelect={handleSelect} />
     * ```
     */
    export interface Props {
        /** The logbook entry to display */
        entry: LogEntry;

        /** Callback when entry is selected */
        onSelect?: (entry: LogEntry) => void;
    }
</script>
````

---

## README Update Guidelines

### Structure

```markdown
# Project Name

Brief description.

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- Feature 1
- Feature 2

## Documentation

- [Architecture](.claude/ARCHITECTURE.md)
- [Testing](.claude/TESTING.md)

## Development

### Commands

| Command         | Description          |
| --------------- | -------------------- |
| `npm run dev`   | Start dev server     |
| `npm run build` | Build for production |

## License

MIT
```

### When to Update README

- New features added
- API changes
- New dependencies
- Changed commands
- Installation changes

---

## When to Add Documentation

### Always Document

- Public API functions
- Complex algorithms
- Non-obvious behavior
- Configuration options
- Type interfaces

### Skip Documentation For

- Self-explanatory code
- Private implementation details
- Standard patterns
- Temporary code

---

## Documentation Style Guide

### Language

- Use present tense ("Returns" not "Will return")
- Be concise but complete
- Use active voice
- Avoid jargon unless necessary

### Formatting

- Use Markdown in JSDoc
- Include code examples for complex functions
- Use proper punctuation
- Keep line length reasonable

### Types

- Reference types by name, not description
- Link to type definitions when helpful
- Use `@see` for related functions

---

## Key Files for Documentation

| File                                                                   | Purpose                   |
| ---------------------------------------------------------------------- | ------------------------- |
| [README.md](../../README.md)                                           | Project overview          |
| [src/lib/types.ts](../../src/lib/types.ts)                             | Type definitions          |
| [src/lib/ol/map.ts](../../src/lib/ol/map.ts)                           | Map factory               |
| [src/lib/ol/overlays/tooltip.ts](../../src/lib/ol/overlays/tooltip.ts) | Overlay patterns          |
| [.claude/](../)                                                        | Claude Code documentation |

---

## Documentation Checklist

When documenting code:

- [ ] Function has JSDoc with description
- [ ] Parameters documented with `@param`
- [ ] Return value documented with `@returns`
- [ ] Example included if complex
- [ ] Types are documented with comments
- [ ] README updated if public API changed

---

## Example: Documenting a New Function

Before:

```typescript
export function sortEntries(entries, order) {
	return entries.sort((a, b) => {
		const dateA = new Date(a.datetime);
		const dateB = new Date(b.datetime);
		return order === 'asc' ? dateA - dateB : dateB - dateA;
	});
}
```

After:

````typescript
/**
 * Sorts logbook entries by datetime.
 *
 * @param entries - Array of log entries to sort
 * @param order - Sort order: 'asc' for oldest first, 'desc' for newest first
 * @returns New sorted array (original unchanged)
 *
 * @example
 * ```typescript
 * const sorted = sortEntries(entries, 'asc');
 * ```
 */
export function sortEntries(entries: LogEntry[], order: 'asc' | 'desc' = 'asc'): LogEntry[] {
	return [...entries].sort((a, b) => {
		const dateA = new Date(a.datetime).getTime();
		const dateB = new Date(b.datetime).getTime();
		return order === 'asc' ? dateA - dateB : dateB - dateA;
	});
}
````

---

## Success Criteria

- [ ] JSDoc follows project conventions
- [ ] Examples are runnable
- [ ] All public APIs documented
- [ ] README is up to date
- [ ] No spelling/grammar errors
- [ ] Links are valid
