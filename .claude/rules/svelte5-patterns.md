---
description: 'Critical Svelte 5 runes patterns — auto-loaded for all Svelte files'
paths:
  - 'src/**/*.svelte'
  - 'src/**/*.svelte.ts'
---

# Svelte 5 Critical Patterns

> For deep knowledge, migration guides, and optimization: use `/svelte5-expert` skill.

## MANDATORY: Runes Only (NO Svelte 4 Syntax)

### FORBIDDEN

```typescript
$: doubled = count * 2; // ❌ NEVER use $: reactive statements
$: if (count > 10) alert('!'); // ❌ NEVER use $: if blocks
$: {
	/* block */
} // ❌ NEVER use $: blocks
```

### REQUIRED

```typescript
let doubled = $derived(count * 2); // ✅ Use $derived
$effect(() => {
	if (count > 10) alert('!');
}); // ✅ Use $effect
```

## MANDATORY: $effect Cleanup

ALWAYS return cleanup function when managing resources.

```typescript
// ✅ CORRECT — cleanup returned
$effect(() => {
	map.on('click', handler);
	return () => map.un('click', handler); // REQUIRED
});

// ❌ WRONG — missing cleanup (MEMORY LEAK)
$effect(() => {
	map.on('click', handler);
});
```

### Resources Requiring Cleanup

- Event listeners (`map.on`, `window.addEventListener`)
- Timers (`setTimeout`, `setInterval`)
- Subscriptions (`store.subscribe`)
- OpenLayers overlays (`map.addOverlay`)
- Browser APIs (`ResizeObserver`, `IntersectionObserver`)

## Quick Runes Reference

| Rune                 | Purpose                  | Example                                         |
| -------------------- | ------------------------ | ----------------------------------------------- |
| `$state(value)`      | Reactive state           | `let count = $state(0)`                         |
| `$derived(expr)`     | Computed value           | `let doubled = $derived(count * 2)`             |
| `$effect(() => {})`  | Side effect with cleanup | See above                                       |
| `$props()`           | Component props          | `let { title }: Props = $props()`               |
| `$bindable(default)` | Two-way binding          | `let { visible = $bindable(false) } = $props()` |

## Component Structure

```svelte
<script lang="ts">
  import type { LogEntry } from '$lib/types';

  interface Props {
    title: string;
    count?: number;
  }

  let { title, count = 0 }: Props = $props();
  let isOpen = $state(false);
  let displayCount = $derived(count > 0 ? count : 'None');

  $effect(() => {
    // Setup
    return () => { /* cleanup */ };
  });

  function handleClick() { isOpen = !isOpen; }
</script>

<div class="component">
  <h1>{title}</h1>
  <p>Count: {displayCount}</p>
  <button onclick={handleClick}>Toggle</button>
</div>
```

## Anti-Patterns to AVOID

1. ❌ `$:` reactive statements (Svelte 4)
2. ❌ `$effect` without cleanup when managing resources
3. ❌ `onMount`/`onDestroy` — use `$effect` with cleanup instead
4. ❌ `on:click` — use `onclick` (Svelte 5 event syntax)
5. ❌ `createEventDispatcher` — use callback props instead
6. ❌ `<slot />` — use `{@render children()}` with Snippets

## Project State Management

- **Component state**: `$state()` in `.svelte` files
- **App-wide state**: `src/lib/AppState.svelte.ts` ($state at module level)
- **Map instance**: `src/lib/stores.ts` (Writable store for OpenLayers)
