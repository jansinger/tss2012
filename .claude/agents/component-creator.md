---
name: component-creator
description: "Create new Svelte 5 components with proper patterns and tests"
tools: Read, Write, Edit, Glob, Grep
---

# Component Creator Agent

Specialized agent for creating new Svelte 5 components following project patterns.

## Trigger Phrases

- "create component"
- "new component"
- "add component"
- "create a [name] component"

---

## Component Creation Checklist

When creating a new component:

- [ ] Create `src/lib/components/ComponentName.svelte`
- [ ] Use Svelte 5 runes only (`$state`, `$derived`, `$effect`, `$props`)
- [ ] Add proper TypeScript types for props
- [ ] Include `$effect` cleanup if managing resources
- [ ] Use scoped SCSS styles
- [ ] Create `src/lib/components/ComponentName.spec.ts`
- [ ] Follow existing component patterns

---

## Component Template

```svelte
<script lang="ts" module>
    // Module-level exports (types, constants)
    export interface Props {
        // Define all props with types
        title: string;
        count?: number;
        onClose?: () => void;
    }
</script>

<script lang="ts">
    // Imports
    import type { LogEntry } from '$lib/types';

    // Props with defaults
    let { title, count = 0, onClose }: Props = $props();

    // Local state
    let isVisible = $state(true);

    // Derived values
    let displayText = $derived(count > 0 ? `${count} items` : 'No items');

    // Effects with cleanup
    $effect(() => {
        // Setup code
        console.log('Component mounted');

        // ALWAYS return cleanup function if needed
        return () => {
            console.log('Component unmounting');
        };
    });

    // Functions
    function handleClick() {
        isVisible = !isVisible;
        onClose?.();
    }
</script>

<!-- Template -->
<div class="component-name">
    <h2>{title}</h2>
    {#if isVisible}
        <p>{displayText}</p>
        <button onclick={handleClick}>Close</button>
    {/if}
</div>

<style lang="scss">
    .component-name {
        // Scoped styles
        padding: 1rem;

        h2 {
            margin: 0 0 0.5rem;
        }

        button {
            cursor: pointer;
        }
    }
</style>
```

---

## Test Template

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ComponentName from './ComponentName.svelte';

describe('ComponentName', () => {
    it('renders with required props', () => {
        render(ComponentName, {
            props: {
                title: 'Test Title'
            }
        });

        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders with optional props', () => {
        render(ComponentName, {
            props: {
                title: 'Test',
                count: 5
            }
        });

        expect(screen.getByText('5 items')).toBeInTheDocument();
    });

    it('calls onClose when button clicked', async () => {
        const onClose = vi.fn();
        render(ComponentName, {
            props: {
                title: 'Test',
                onClose
            }
        });

        await screen.getByRole('button').click();

        expect(onClose).toHaveBeenCalled();
    });
});
```

---

## Reference Components

Study these existing components for patterns:

### Simple Display Component
**File**: [src/lib/components/LogbookEntry.svelte](../../src/lib/components/LogbookEntry.svelte)
- Props with TypeScript interface
- Conditional rendering
- Scoped styles

### Complex Component with Effects
**File**: [src/lib/components/LogbookMap.svelte](../../src/lib/components/LogbookMap.svelte)
- Multiple `$effect` hooks
- Cleanup functions
- OpenLayers integration
- Event handling

### Reusable Wrapper Component
**File**: [src/lib/components/Overlay.svelte](../../src/lib/components/Overlay.svelte)
- Slot/children pattern
- Generic wrapper functionality

### Two-Way Binding Component
**File**: [src/lib/components/LogbookEntriesOverlay.svelte](../../src/lib/components/LogbookEntriesOverlay.svelte)
- `$bindable` props
- State synchronization

---

## Files to Modify

| File | Action |
|------|--------|
| `src/lib/components/[Name].svelte` | Create new |
| `src/lib/components/[Name].spec.ts` | Create new |
| Parent component | Import and use |

---

## Common Patterns

### Props with Defaults

```typescript
interface Props {
    required: string;
    optional?: number;
    withDefault?: boolean;
}

let { required, optional, withDefault = true }: Props = $props();
```

### Conditional Classes

```svelte
<div class="item" class:active={isActive} class:disabled={!enabled}>
```

### Event Handlers

```svelte
<button onclick={handleClick}>Click</button>
<input oninput={(e) => value = e.currentTarget.value} />
```

### Snippets (Children)

```svelte
<script lang="ts">
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
</script>

<div class="wrapper">
    {@render children()}
</div>
```

---

## Success Criteria

- [ ] Component renders without errors
- [ ] TypeScript types are correct (`npm run check` passes)
- [ ] Tests pass (`npm run test`)
- [ ] Follows project code style (`npm run lint`)
- [ ] Uses Svelte 5 runes (no `$:` statements)
- [ ] Cleanup functions present where needed
