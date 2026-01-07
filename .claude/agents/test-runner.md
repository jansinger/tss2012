---
name: test-runner
description: "Write tests and improve test coverage"
tools: Read, Write, Edit, Glob, Grep, Bash
---

# Test Runner Agent

Specialized agent for writing tests and improving test coverage.

## Trigger Phrases

- "write test"
- "add test"
- "improve coverage"
- "fix test"
- "test for"

---

## Test Creation Workflow

1. **Locate the file to test**
2. **Create co-located test file** (`*.spec.ts`)
3. **Import test utilities**
4. **Mock dependencies** as needed
5. **Write test cases** (describe/it blocks)
6. **Run tests** to verify

---

## Component Test Template

```typescript
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComponentName from './ComponentName.svelte';

describe('ComponentName', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with required props', () => {
        render(ComponentName, {
            props: {
                title: 'Test Title'
            }
        });

        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('handles user interaction', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(ComponentName, {
            props: {
                title: 'Test',
                onClick
            }
        });

        await user.click(screen.getByRole('button'));

        expect(onClick).toHaveBeenCalledOnce();
    });

    it('updates when props change', async () => {
        const { rerender } = render(ComponentName, {
            props: { title: 'Initial' }
        });

        expect(screen.getByText('Initial')).toBeInTheDocument();

        await rerender({ title: 'Updated' });

        expect(screen.getByText('Updated')).toBeInTheDocument();
    });
});
```

---

## Utility Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { utilityFunction } from './utilityFunction';

describe('utilityFunction', () => {
    it('handles normal input', () => {
        const result = utilityFunction('input');
        expect(result).toBe('expected');
    });

    it('handles edge case', () => {
        const result = utilityFunction('');
        expect(result).toBe('');
    });

    it('throws on invalid input', () => {
        expect(() => utilityFunction(null)).toThrow();
    });
});
```

---

## Mocking Reference

### SvelteKit Modules

Already configured in `vitest.config.js`:

```typescript
// $app/navigation - Virtual module
// $app/environment - Alias mock in src/mocks/environment.ts
```

### Mocking Stores

```typescript
import { vi } from 'vitest';
import { writable } from 'svelte/store';

vi.mock('$lib/stores', () => ({
    map: writable(null)
}));
```

### Mocking OpenLayers

```typescript
vi.mock('ol/Map', () => ({
    default: vi.fn().mockImplementation(() => ({
        setTarget: vi.fn(),
        updateSize: vi.fn(),
        on: vi.fn(),
        un: vi.fn(),
        addOverlay: vi.fn(),
        removeOverlay: vi.fn(),
        getTargetElement: vi.fn(() => ({ style: {} })),
        dispatchEvent: vi.fn()
    }))
}));

vi.mock('ol', () => ({
    Overlay: vi.fn().mockImplementation(() => ({
        setPosition: vi.fn(),
        getElement: vi.fn()
    }))
}));
```

### Mocking Functions

```typescript
import { vi } from 'vitest';

// Mock specific function
vi.mock('$lib/utils/helper', () => ({
    helperFunction: vi.fn(() => 'mocked result')
}));

// Spy on function
const spy = vi.spyOn(object, 'method');
expect(spy).toHaveBeenCalled();
```

---

## Test Commands

```bash
# Watch mode (development)
npm run test

# Single run
npm run test:ci

# With coverage
npm run test:coverage

# Run specific file
npm run test -- ComponentName.spec.ts

# Run with pattern
npm run test -- --grep "renders"
```

---

## Coverage Improvement Strategy

### 1. Check Current Coverage

```bash
npm run test:coverage
```

### 2. Identify Gaps

- Look at `coverage/index.html` for visual report
- Focus on uncovered lines and branches

### 3. Priority Order

1. **Lines** (threshold: 70%)
2. **Functions** (threshold: 70%)
3. **Statements** (threshold: 70%)
4. **Branches** (threshold: 50%)

### 4. Common Uncovered Areas

- Error handling branches
- Edge cases
- Conditional rendering
- Event handlers

---

## Testing Async Code

### Waiting for Effects

```typescript
import { waitFor } from '@testing-library/svelte';

it('loads data async', async () => {
    render(ComponentName);

    await waitFor(() => {
        expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
});
```

### Testing Promises

```typescript
it('handles async operation', async () => {
    const result = await asyncFunction();
    expect(result).toBe('expected');
});
```

---

## Testing Store Subscriptions

```typescript
import { get } from 'svelte/store';
import { myStore } from '$lib/stores';

describe('myStore', () => {
    it('has initial value', () => {
        expect(get(myStore)).toBeUndefined();
    });

    it('updates value', () => {
        myStore.set('new value');
        expect(get(myStore)).toBe('new value');
    });
});
```

---

## Common Issues & Solutions

### "Cannot find module"

Check virtual modules in `vitest.config.js` or add alias mock.

### "document is not defined"

Ensure `environment: 'jsdom'` in config.

### Store not updating

Use `get()` from `svelte/store` or `await tick()`.

### Effect not running

Use `waitFor` or `flushSync`.

---

## Files to Create/Modify

| File | Location |
|------|----------|
| Component tests | `src/lib/components/*.spec.ts` |
| Utility tests | `src/lib/utils/*.spec.ts` |
| Store tests | `src/lib/*.spec.ts` |
| OpenLayers tests | `src/lib/ol/**/*.spec.ts` |
| Mocks | `src/mocks/*.ts` |

---

## Success Criteria

- [ ] All tests pass (`npm run test`)
- [ ] Coverage thresholds met (70/70/70/50)
- [ ] No flaky tests
- [ ] Tests are isolated (no shared state)
- [ ] Meaningful test names
- [ ] Edge cases covered
