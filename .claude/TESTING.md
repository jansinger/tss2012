# Testing Strategy

This document covers the testing approach for the **Ein tierischer Segelsommer 2012** project.

---

## Testing Framework

| Tool                                   | Purpose                |
| -------------------------------------- | ---------------------- |
| **Vitest** (v4.0.15)                   | Unit testing framework |
| **@testing-library/svelte** (v5.2.9)   | Component testing      |
| **@testing-library/jest-dom** (v6.9.1) | DOM matchers           |
| **jsdom** (v27.0.0)                    | DOM implementation     |

---

## Configuration

**File**: [vitest.config.js](../vitest.config.js)

```javascript
export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
		alias: {
			'$app/environment': path.resolve('./src/mocks/environment.ts')
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json', 'json-summary'],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 50,
				statements: 70
			}
		}
	}
});
```

---

## Coverage Thresholds

| Metric     | Minimum |
| ---------- | ------- |
| Lines      | 70%     |
| Functions  | 70%     |
| Statements | 70%     |
| Branches   | 50%     |

### Excluded Paths

- `node_modules/`
- `src/mocks/`
- `src/tools/`
- `**/*.spec.ts`
- `**/*.test.ts`
- Config files (`vitest.config.js`, `vite.config.js`, `svelte.config.js`)

---

## Test Organization

### File Location

Tests are **co-located** with their implementation:

```
src/lib/components/
├── LogbookMap.svelte
├── LogbookMap.spec.ts      # Test file
├── LogbookEntry.svelte
└── LogbookEntry.spec.ts    # Test file
```

### Naming Convention

- Unit tests: `*.spec.ts`
- Integration tests: `*.integration.spec.ts` (if needed)

---

## Mock Strategies

### Virtual Modules (SvelteKit Imports)

**File**: [vitest.config.js](../vitest.config.js)

```javascript
{
    name: 'virtual-modules',
    resolveId(id) {
        if (id === '$app/navigation') return 'virtual:$app/navigation';
    },
    load(id) {
        if (id === 'virtual:$app/navigation') return 'export default []';
    }
}
```

### Alias Mocks

```javascript
alias: {
    '$app/environment': path.resolve('./src/mocks/environment.ts')
}
```

**Mock file**: [src/mocks/environment.ts](../src/mocks/environment.ts)

### Mock Directory

Location: [src/mocks/](../src/mocks/)

Place reusable mocks here for:

- SvelteKit modules (`$app/*`)
- External libraries
- Browser APIs

---

## Running Tests

```bash
# Watch mode (development)
npm run test

# Single run (CI)
npm run test:ci

# With coverage report
npm run test:coverage

# Full CI pipeline (build + test)
npm run build-ci
```

---

## Component Testing Pattern

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ComponentName from './ComponentName.svelte';

describe('ComponentName', () => {
	it('renders correctly', () => {
		render(ComponentName, {
			props: {
				// component props
			}
		});

		expect(screen.getByText('Expected Text')).toBeInTheDocument();
	});
});
```

### Testing with User Events

```typescript
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

it('handles click', async () => {
	const user = userEvent.setup();
	render(ComponentName);

	await user.click(screen.getByRole('button'));

	expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

### Testing Async Effects

```typescript
import { render, waitFor } from '@testing-library/svelte';

it('loads data', async () => {
	render(ComponentName);

	await waitFor(() => {
		expect(screen.getByText('Loaded')).toBeInTheDocument();
	});
});
```

---

## OpenLayers Mocking

### Mocking the Map Store

```typescript
import { vi } from 'vitest';
import { writable } from 'svelte/store';

// Mock the map store
vi.mock('$lib/stores', () => ({
	map: writable(null)
}));
```

### Mocking OpenLayers Classes

```typescript
vi.mock('ol/Map', () => ({
	default: vi.fn().mockImplementation(() => ({
		setTarget: vi.fn(),
		updateSize: vi.fn(),
		on: vi.fn(),
		un: vi.fn(),
		addOverlay: vi.fn(),
		removeOverlay: vi.fn(),
		getTargetElement: vi.fn(() => ({ style: {} }))
	}))
}));
```

### Mocking Overlay

```typescript
vi.mock('ol', () => ({
	Overlay: vi.fn().mockImplementation(() => ({
		setPosition: vi.fn(),
		getElement: vi.fn()
	}))
}));
```

---

## Utility Testing Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { sortEntries } from './sortEntries';

describe('sortEntries', () => {
	it('sorts entries by date ascending', () => {
		const entries = [{ datetime: '2012-07-15' }, { datetime: '2012-07-01' }];

		const sorted = sortEntries(entries);

		expect(sorted[0].datetime).toBe('2012-07-01');
	});
});
```

---

## Store Testing Pattern

```typescript
import { get } from 'svelte/store';
import { map } from '$lib/stores';

describe('map store', () => {
	it('initializes as undefined', () => {
		expect(get(map)).toBeUndefined();
	});

	it('can be set and retrieved', () => {
		const mockMap = { id: 'test' };
		map.set(mockMap);
		expect(get(map)).toBe(mockMap);
	});
});
```

---

## Common Issues & Solutions

### Virtual Module Resolution

**Problem**: `Cannot find module '$app/navigation'`

**Solution**: Ensure virtual-modules plugin is configured in vitest.config.js

### DOM Environment

**Problem**: `document is not defined`

**Solution**: Ensure `environment: 'jsdom'` is set in config

### Async Effects Not Running

**Problem**: `$effect` doesn't execute in tests

**Solution**: Use `waitFor` or `flushSync` to wait for effects

### Store Subscriptions

**Problem**: Store values not updating in tests

**Solution**: Use `get()` from `svelte/store` or await next tick

---

## CI Integration

Tests run automatically in the CI pipeline:

1. **Trigger**: Git push to any branch
2. **Command**: `npm run build-ci`
3. **Steps**:
   - `svelte-kit sync`
   - `vite build`
   - `vitest run`
4. **Coverage**: Reports generated in `coverage/` directory
