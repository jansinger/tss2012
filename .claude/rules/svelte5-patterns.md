---
description: 'Svelte 5 runes patterns for tss2012 components'
globs: ['src/**/*.svelte', 'src/**/*.svelte.ts']
alwaysApply: false
---

# Svelte 5 Runes Patterns

This project uses **Svelte 5** with the runes API. All components must follow these patterns.

---

## Runes Reference

### $state - Reactive State

```typescript
// Simple state
let count = $state(0);

// Object state
let user = $state({ name: '', email: '' });

// Array state
let items = $state<string[]>([]);
```

**File Example**: [src/lib/AppState.svelte.ts](../../src/lib/AppState.svelte.ts)

```typescript
export const AppState = $state({
	currentEntries: []
});
```

### $derived - Computed Values

```typescript
let count = $state(0);
let doubled = $derived(count * 2);

// Complex derivation
let filtered = $derived(items.filter((item) => item.active));
```

### $props - Component Props

```typescript
interface Props {
	title: string;
	count?: number;
	onClose?: () => void;
}

let { title, count = 0, onClose }: Props = $props();
```

### $bindable - Two-Way Binding

```typescript
interface Props {
	visible: boolean;
}

let { visible = $bindable(false) }: Props = $props();
```

**File Example**: [src/lib/components/LogbookEntriesOverlay.svelte](../../src/lib/components/LogbookEntriesOverlay.svelte)

---

## $effect Cleanup Pattern (MANDATORY)

**Always return a cleanup function when managing resources.**

### Pattern

```typescript
$effect(() => {
	// Setup code
	const handler = () => {
		/* ... */
	};
	map.on('click', handler);

	// ALWAYS return cleanup function
	return () => {
		map.un('click', handler);
	};
});
```

### Real Example from Project

**File**: [src/lib/components/LogbookMap.svelte](../../src/lib/components/LogbookMap.svelte)

```typescript
$effect(() => {
	if (!$map || !mapElement) return;

	const { cleanup } = createTooltipOverlay(tooltipElement, $map);

	return () => {
		cleanup();
	};
});
```

### When Cleanup is Required

| Resource        | Cleanup Action                           |
| --------------- | ---------------------------------------- |
| Event listeners | `map.un('event', handler)`               |
| Overlays        | `map.removeOverlay(overlay)`             |
| Timers          | `clearInterval(id)` / `clearTimeout(id)` |
| Subscriptions   | `unsubscribe()`                          |
| Caches          | `cache.clear()`                          |

---

## Anti-Patterns (AVOID)

### DO NOT use $: reactive statements

```typescript
// BAD - Svelte 4 syntax
$: doubled = count * 2;
$: if (count > 10) {
	doSomething();
}

// GOOD - Svelte 5 runes
let doubled = $derived(count * 2);
$effect(() => {
	if (count > 10) {
		doSomething();
	}
});
```

### DO NOT forget cleanup

```typescript
// BAD - Memory leak
$effect(() => {
	map.on('click', handler);
	// Missing cleanup!
});

// GOOD - Proper cleanup
$effect(() => {
	map.on('click', handler);
	return () => map.un('click', handler);
});
```

### DO NOT use onMount without cleanup

```typescript
// BAD - Legacy pattern
import { onMount, onDestroy } from 'svelte';

onMount(() => {
	map.on('click', handler);
});
onDestroy(() => {
	map.un('click', handler);
});

// GOOD - Single $effect with cleanup
$effect(() => {
	map.on('click', handler);
	return () => map.un('click', handler);
});
```

---

## Component Structure Template

```svelte
<script lang="ts" module>
    // Module-level exports (types, constants)
    export interface Props {
        title: string;
        count?: number;
    }
</script>

<script lang="ts">
    // Imports
    import { goto } from '$app/navigation';
    import type { LogEntry } from '$lib/types';

    // Props
    let { title, count = 0 }: Props = $props();

    // Local state
    let isOpen = $state(false);

    // Derived values
    let displayCount = $derived(count > 0 ? count : 'None');

    // Effects with cleanup
    $effect(() => {
        console.log('Component mounted with title:', title);
        return () => {
            console.log('Component unmounting');
        };
    });

    // Functions
    function handleClick() {
        isOpen = !isOpen;
    }
</script>

<!-- Template -->
<div class="component">
    <h1>{title}</h1>
    <p>Count: {displayCount}</p>
    <button onclick={handleClick}>Toggle</button>
</div>

<style lang="scss">
    .component {
        // Scoped styles
    }
</style>
```

---

## State Management: Runes vs Stores

### Use Svelte 5 Runes ($state)

- Component-local state
- App-wide state in `.svelte.ts` files
- Reactive computed values

### Use Svelte Stores

- Sharing state with non-Svelte code (like OpenLayers)
- When you need `subscribe()` pattern
- Legacy compatibility

**Example**: The map instance uses a store because OpenLayers needs direct access:

```typescript
// src/lib/stores.ts
export const map: Writable<Map> = writable();
```

---

## TypeScript Integration

### Type Props Interface

```typescript
interface Props {
	entries: LogEntry[];
	onSelect?: (entry: LogEntry) => void;
}

let { entries, onSelect }: Props = $props();
```

### Type State

```typescript
let selectedId = $state<string | null>(null);
let items = $state<LogEntry[]>([]);
```

### Type Effects

```typescript
$effect(() => {
	// TypeScript infers types from closure
	const entry = entries.find((e) => e.id === selectedId);
	if (entry) {
		onSelect?.(entry);
	}
});
```
