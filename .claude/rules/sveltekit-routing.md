---
description: "SvelteKit routing patterns for tss2012"
globs: ["src/routes/**/*"]
alwaysApply: false
---

# SvelteKit Routing Patterns

This document covers SvelteKit routing patterns for the **Ein tierischer Segelsommer 2012** project.

---

## Current Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/routes/+page.svelte` | Home page (map view) |
| `/log` | `src/routes/log/+page.svelte` | Logbook list |
| `/log/[id]` | `src/routes/log/[id]/+page.svelte` | Individual entry |
| `/timeline` | `src/routes/timeline/+page.svelte` | Timeline view |
| `/impressum` | `src/routes/impressum/+page.svelte` | Legal imprint |
| `/barrierefreiheit` | `src/routes/barrierefreiheit/+page.svelte` | Accessibility |

---

## File-Based Routing

### Convention

| File | Purpose |
|------|---------|
| `+page.svelte` | Page component (renders UI) |
| `+page.ts` | Page data loading (runs on client) |
| `+page.server.ts` | Server-side data loading |
| `+layout.svelte` | Layout wrapper |
| `+layout.ts` | Layout data loading |
| `+error.svelte` | Error page |
| `[param]` | Dynamic route parameter |

### Project Structure

```
src/routes/
├── +layout.svelte      # Root layout (navigation, footer)
├── +page.svelte        # Home page
├── +error.svelte       # Error page
├── log/
│   ├── +page.svelte    # Logbook list
│   ├── +page.server.ts # Load all entries
│   └── [id]/
│       ├── +page.svelte    # Entry detail
│       └── +page.server.ts # Load single entry
├── timeline/
│   └── +page.svelte    # Timeline view
└── impressum/
    └── +page.svelte    # Legal page
```

---

## Static Site Generation

This project uses `@sveltejs/adapter-static` for pre-rendering.

### Configuration

**File**: `svelte.config.js`

```javascript
import adapter from '@sveltejs/adapter-static';

export default {
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null,
            precompress: false
        }),
        prerender: {
            entries: ['*']
        }
    }
};
```

### Page Prerendering

All pages are prerendered at build time:

```typescript
// +page.ts or +layout.ts
export const prerender = true;
```

---

## Data Loading Patterns

### Server-Side Loading (+page.server.ts)

**File**: `src/routes/log/+page.server.ts`

```typescript
import type { PageServerLoad } from './$types';
import { sortedEntries } from '$lib/sortedEntries';

export const load: PageServerLoad = async () => {
    return {
        entries: sortedEntries
    };
};
```

### Using Load Data in Page

```svelte
<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

{#each data.entries as entry}
    <article>{entry.title}</article>
{/each}
```

---

## Dynamic Routes

### Parameter Handling

**File**: `src/routes/log/[id]/+page.server.ts`

```typescript
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sortedEntries } from '$lib/sortedEntries';

export const load: PageServerLoad = async ({ params }) => {
    const entry = sortedEntries.find(e => e.id === params.id);

    if (!entry) {
        error(404, 'Entry not found');
    }

    return { entry };
};
```

### Generating Static Paths

For static generation, all dynamic paths must be known at build time:

```typescript
// +page.server.ts
import type { EntryGenerator } from './$types';
import { sortedEntries } from '$lib/sortedEntries';

export const entries: EntryGenerator = () => {
    return sortedEntries.map(entry => ({
        id: entry.id
    }));
};
```

---

## Navigation

### Programmatic Navigation

```typescript
import { goto } from '$app/navigation';

// Navigate to route
goto('/log/123');

// Navigate with options
goto('/log', { replaceState: true });
```

### Link Component

```svelte
<a href="/log/{entry.id}">{entry.title}</a>
```

### Active Link Styling

```svelte
<script>
    import { page } from '$app/stores';
</script>

<a href="/log" class:active={$page.url.pathname === '/log'}>
    Logbook
</a>
```

---

## Layout Patterns

### Root Layout

**File**: `src/routes/+layout.svelte`

```svelte
<script lang="ts">
    import '../lib/scss/global.scss';
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
</script>

<header>
    <nav><!-- Navigation --></nav>
</header>

<main>
    {@render children()}
</main>

<footer><!-- Footer --></footer>
```

### Nested Layouts

Create `+layout.svelte` in subdirectories to add layout wrappers:

```
src/routes/
├── +layout.svelte          # Root layout
└── log/
    ├── +layout.svelte      # Log section layout
    └── +page.svelte
```

---

## Adding a New Route

### Step-by-Step

1. **Create directory** (if needed)

```bash
mkdir -p src/routes/newroute
```

2. **Create page component**

```svelte
<!-- src/routes/newroute/+page.svelte -->
<script lang="ts">
    // Component logic
</script>

<h1>New Route</h1>
```

3. **Add data loading** (optional)

```typescript
// src/routes/newroute/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    return {
        // Data for the page
    };
};
```

4. **Run type generation**

```bash
npm run check
```

5. **Update navigation** in layout or relevant components

---

## Error Handling

### Error Page

**File**: `src/routes/+error.svelte`

```svelte
<script lang="ts">
    import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<p>{$page.error?.message}</p>
```

### Throwing Errors

```typescript
import { error } from '@sveltejs/kit';

// 404 error
error(404, 'Page not found');

// Custom error
error(500, { message: 'Server error', code: 'ERR_001' });
```

---

## Type Safety

### Generated Types

SvelteKit generates types for each route:

```typescript
import type { PageServerLoad } from './$types';
import type { PageData } from './$types';
```

### Running Type Generation

```bash
npm run check
# or
npx svelte-kit sync
```

---

## Best Practices

1. **Use server-side loading** for data that should be prerendered
2. **Handle errors gracefully** with proper error pages
3. **Keep routes shallow** - avoid deeply nested route structures
4. **Use TypeScript** for all route files
5. **Run type generation** after adding new routes
