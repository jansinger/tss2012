---
description: 'Critical SvelteKit routing patterns — auto-loaded for route files'
paths:
  - 'src/routes/**/*'
---

# SvelteKit Routing Patterns

> For advanced routing, use Context7 to query SvelteKit docs.

## Current Routes

| Route               | File                                       | Purpose         |
| ------------------- | ------------------------------------------ | --------------- |
| `/`                 | `src/routes/+page.svelte`                  | Home (map view) |
| `/log`              | `src/routes/log/+page.svelte`              | Logbook list    |
| `/log/[id]`         | `src/routes/log/[id]/+page.svelte`         | Entry detail    |
| `/timeline`         | `src/routes/timeline/+page.svelte`         | Timeline view   |
| `/impressum`        | `src/routes/impressum/+page.svelte`        | Legal imprint   |
| `/barrierefreiheit` | `src/routes/barrierefreiheit/+page.svelte` | Accessibility   |

## CRITICAL: Static Site Generation

This project uses `@sveltejs/adapter-static`. **ALL routes MUST be prerenderable.**

Constraints:

- No server-side logic at runtime
- No user input processing
- All data must be available at build time (static JSON/KML files)
- Dynamic routes need `entries` export for path generation

## File-Based Routing

| File              | Purpose                             |
| ----------------- | ----------------------------------- |
| `+page.svelte`    | Page component                      |
| `+page.server.ts` | Server data loading (at build time) |
| `+layout.svelte`  | Layout wrapper                      |
| `+error.svelte`   | Error page                          |
| `[param]/`        | Dynamic route parameter             |

## Data Loading

```typescript
// +page.server.ts — data loaded at BUILD TIME
import type { PageServerLoad } from './$types';
import { sortedEntries } from '$lib/sortedEntries';

export const load: PageServerLoad = async () => {
	return { entries: sortedEntries };
};
```

```svelte
<!-- +page.svelte — using loaded data -->
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

{#each data.entries as entry}
  <article>{entry.title}</article>
{/each}
```

## Dynamic Routes — Static Path Generation

For `adapter-static`, ALL dynamic paths must be known at build time:

```typescript
// src/routes/log/[id]/+page.server.ts
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return sortedEntries.map((entry) => ({ id: entry.id }));
};
```

## Navigation

```svelte
<!-- Link -->
<a href="/log/{entry.id}">{entry.title}</a>
```

```typescript
// Programmatic
import { goto } from '$app/navigation';
goto('/log/123');
```

## Adding a New Route

1. Create directory: `mkdir -p src/routes/newroute`
2. Create `+page.svelte`
3. Add `+page.server.ts` (optional, for data)
4. Generate types: `npm run check`
5. Update navigation in layout/components

## Error Handling

```typescript
import { error } from '@sveltejs/kit';
error(404, 'Entry not found');
```

Error page: `src/routes/+error.svelte`

## Data Sources

All data is static:

- `static/data/logbook_geo.json` — Logbook entries (GeoJSON)
- `static/data/segelsommer2012.kml` — Sailing track (KML)
