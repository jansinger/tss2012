---
name: svelte5-expert
description: 'Deep Svelte 5 knowledge for advanced runes patterns, migration, snippets, and performance optimization'
disable-model-invocation: false
allowed-tools: 'mcp__context7__resolve-library-id, mcp__context7__query-docs, Read, Grep, Glob'
---

# Svelte 5 Expert

You are a Svelte 5 expert. ALWAYS use Context7 for current documentation:

1. `resolve-library-id` with query about Svelte
2. `query-docs` with your specific question

## Core Runes Deep Dive

### $state() — Fine-Grained Reactivity

```typescript
// Primitive state
let count = $state(0);

// Object state (deeply reactive)
let user = $state({ name: '', email: '' });

// Array state
let items = $state<string[]>([]);

// $state.snapshot() — read current value without tracking
const snapshot = $state.snapshot(items);
```

**Deep reactivity**: Objects and arrays are deeply reactive. Mutations like `user.name = 'Jan'` or `items.push('new')` trigger updates.

### $derived() — Computed Values

```typescript
// Simple derivation
let doubled = $derived(count * 2);

// Complex derivation with $derived.by()
let filtered = $derived.by(() => {
	const result = items.filter((item) => item.active);
	return result.sort((a, b) => a.name.localeCompare(b.name));
});
```

Use `$derived()` for simple expressions, `$derived.by()` for multi-statement computations.

### $effect() — Side Effects

```typescript
// ALWAYS return cleanup function for resources
$effect(() => {
	const handler = () => {
		/* ... */
	};
	map.on('click', handler);

	return () => {
		map.un('click', handler); // REQUIRED cleanup
	};
});

// $effect.pre() — runs before DOM update
$effect.pre(() => {
	// Runs before the DOM updates
	return () => {
		/* cleanup */
	};
});

// Check if inside tracked context
if ($effect.tracking()) {
	// We're inside an $effect or $derived
}
```

### untrack() — Read Without Creating Dependencies

```typescript
import { untrack } from 'svelte';

$effect(() => {
	// count is tracked (triggers re-run)
	console.log(count);

	// name is NOT tracked (read without dependency)
	const currentName = untrack(() => name);
});
```

Use `untrack()` when you need to read reactive state without the effect re-running when that state changes.

### $props() — Component Props

```typescript
interface Props {
	title: string;
	count?: number;
	onClose?: () => void;
	children: Snippet; // Required child content
	header?: Snippet<[string]>; // Optional snippet with parameter
}

let { title, count = 0, onClose, children, header }: Props = $props();

// Rest props
let { title, ...rest }: Props = $props();
```

### $bindable() — Two-Way Binding

```typescript
interface Props {
	value: string;
	visible: boolean;
}

// Parent can use bind:value and bind:visible
let { value = $bindable(''), visible = $bindable(false) }: Props = $props();
```

## Snippets (Slot Replacement)

Svelte 5 replaces slots with snippets:

```svelte
<!-- Defining snippets -->
{#snippet header(title)}
  <h2>{title}</h2>
{/snippet}

<!-- Rendering snippets -->
{@render header('My Title')}

<!-- Rendering children (replaces <slot/>) -->
{@render children()}

<!-- Optional snippets -->
{#if footer}
  {@render footer()}
{/if}
```

### Passing Snippets as Props

```svelte
<!-- Parent.svelte -->
<Card>
  {#snippet header()}
    <h1>Title</h1>
  {/snippet}

  <p>Default content (children snippet)</p>
</Card>

<!-- Card.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    header?: Snippet;
    footer?: Snippet;
  }

  let { children, header, footer }: Props = $props();
</script>

<div class="card">
  {#if header}{@render header()}{/if}
  {@render children()}
  {#if footer}{@render footer()}{/if}
</div>
```

## Context API

```typescript
// Setting context (in parent)
import { setContext } from 'svelte';

const theme = $state({ mode: 'light' });
setContext('theme', theme);

// Getting context (in child)
import { getContext } from 'svelte';

const theme = getContext<{ mode: string }>('theme');
```

## Migration Patterns: Svelte 4 → 5

### Reactive Statements → $derived / $effect

```typescript
// Svelte 4 (FORBIDDEN)
$: doubled = count * 2;
$: if (count > 10) doSomething();
$: {
	complexBlock();
}

// Svelte 5 (REQUIRED)
let doubled = $derived(count * 2);
$effect(() => {
	if (count > 10) doSomething();
});
$effect(() => {
	complexBlock();
});
```

### Lifecycle → $effect

```typescript
// Svelte 4 (AVOID)
import { onMount, onDestroy } from 'svelte';
onMount(() => {
	setup();
});
onDestroy(() => {
	teardown();
});

// Svelte 5 (PREFERRED)
$effect(() => {
	setup();
	return () => {
		teardown();
	};
});
```

### Slots → Snippets

```svelte
<!-- Svelte 4 (AVOID) -->
<slot />
<slot name="header" />

<!-- Svelte 5 (REQUIRED) -->
{@render children()}
{#if header}{@render header()}{/if}
```

### Event Handlers

```svelte
<!-- Svelte 4 (AVOID) -->
<button on:click={handler}>Click</button>

<!-- Svelte 5 (REQUIRED) -->
<button onclick={handler}>Click</button>
```

### Component Events → Callback Props

```typescript
// Svelte 4 (AVOID)
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('close');

// Svelte 5 (REQUIRED)
interface Props {
	onClose?: () => void;
}
let { onClose }: Props = $props();
onClose?.();
```

## Performance Optimization

### Fine-Grained Reactivity

Svelte 5 tracks reactivity at the property level. This means:

- `user.name = 'Jan'` only updates components reading `user.name`
- No need for immutable updates like `user = { ...user, name: 'Jan' }`

### Avoiding Unnecessary $effect Runs

```typescript
// BAD — effect runs on ANY change to items
$effect(() => {
	console.log(items.length); // Tracks entire array
});

// GOOD — only track what you need
$effect(() => {
	const len = items.length;
	untrack(() => {
		// Use len without tracking other reactive values
		doSomething(len);
	});
});
```

### $derived vs Functions

```typescript
// Use $derived when the value is used in the template
let total = $derived(items.reduce((sum, item) => sum + item.price, 0));

// Use a function when called on-demand (not reactive)
function getTotal() {
	return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Project-Specific Patterns (tss2012)

### OpenLayers + $effect Cleanup

```typescript
$effect(() => {
	if (!$map || !mapElement) return;

	const { cleanup } = createTooltipOverlay(tooltipElement, $map);

	return () => {
		cleanup(); // ALWAYS cleanup OpenLayers resources
	};
});
```

### State Management

- **Component state**: `$state()` in `.svelte` files
- **App state**: `AppState.svelte.ts` uses `$state` at module level
- **Map instance**: `stores.ts` uses Writable store (exception — needed for OL integration)

### Reference Components

- `src/lib/components/LogbookEntriesOverlay.svelte` — $bindable usage
- `src/lib/components/LogbookMap.svelte` — $effect with OL cleanup
- `src/lib/components/Pictures.svelte` — Swiper integration
- `src/lib/AppState.svelte.ts` — Module-level $state

## Common Errors & Solutions

| Error                         | Cause                               | Solution                                         |
| ----------------------------- | ----------------------------------- | ------------------------------------------------ |
| `$state is not defined`       | Missing runes mode                  | Ensure `.svelte` or `.svelte.ts` file            |
| `Cannot use $: in runes mode` | Svelte 4 syntax                     | Replace with `$derived()` or `$effect()`         |
| Effect runs infinitely        | Effect writes to its own dependency | Use `untrack()` for reads that shouldn't trigger |
| Stale closure in $effect      | Captured non-reactive variable      | Ensure reactive values are read inside $effect   |
| Missing cleanup warning       | $effect without return              | Add `return () => { ... }` cleanup               |
