---
description: 'Testing patterns for Vitest and Testing Library — auto-loaded for test files'
paths:
  - 'src/**/*.test.ts'
  - 'src/**/*.spec.ts'
  - 'src/mocks/**/*'
---

# Testing Patterns

> For detailed testing strategies, see `.claude/TESTING.md`.

## Component Testing

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
			props: { title: 'Test' }
		});

		expect(screen.getByText('Test')).toBeInTheDocument();
	});

	it('handles user interaction', async () => {
		const user = userEvent.setup();
		render(ComponentName);

		await user.click(screen.getByRole('button'));

		expect(screen.getByText('Clicked')).toBeInTheDocument();
	});

	it('waits for async effects', async () => {
		render(ComponentName);

		await waitFor(() => {
			expect(screen.getByText('Loaded')).toBeInTheDocument();
		});
	});
});
```

## Utility Testing

```typescript
import { describe, it, expect } from 'vitest';
import { sortEntries } from './sortEntries';

describe('sortEntries', () => {
	it('sorts by date ascending', () => {
		const entries = [{ datetime: '2012-07-15' }, { datetime: '2012-07-01' }];

		const sorted = sortEntries(entries);

		expect(sorted[0].datetime).toBe('2012-07-01');
	});
});
```

## Mocking Patterns

### Svelte Store

```typescript
import { vi } from 'vitest';
import { writable } from 'svelte/store';

vi.mock('$lib/stores', () => ({
	map: writable(null)
}));
```

### OpenLayers Map

```typescript
vi.mock('ol/Map', () => ({
	default: vi.fn().mockImplementation(() => ({
		setTarget: vi.fn(),
		updateSize: vi.fn(),
		on: vi.fn(),
		un: vi.fn(),
		addOverlay: vi.fn(),
		removeOverlay: vi.fn(),
		getView: vi.fn(() => ({
			getZoom: vi.fn(),
			getCenter: vi.fn()
		}))
	}))
}));
```

### SvelteKit Modules

SvelteKit modules (`$app/navigation`, `$app/environment`) are auto-mocked via virtual modules in `vitest.config.js`.

## Test Organization

```typescript
describe('ComponentName', () => {
	describe('rendering', () => {
		it('renders title', () => {
			/* ... */
		});
		it('renders with default props', () => {
			/* ... */
		});
	});

	describe('interactions', () => {
		it('handles click', () => {
			/* ... */
		});
	});

	describe('edge cases', () => {
		it('handles empty data', () => {
			/* ... */
		});
	});
});
```

## Coverage Thresholds

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 70%       |
| Functions  | 70%       |
| Statements | 70%       |
| Branches   | 50%       |

## Commands

```bash
npm run test              # Watch mode
npm run test:coverage     # With coverage report
npm run build-ci          # Full CI: sync + build + test
```

## Common Issues

| Problem                    | Solution                                       |
| -------------------------- | ---------------------------------------------- |
| Virtual module not found   | Check vitest.config.js virtual-modules         |
| DOM not available          | Ensure `environment: 'jsdom'` in vitest config |
| Async effects not running  | Use `waitFor()` from Testing Library           |
| Store not reactive in test | Mock with `writable()` from svelte/store       |

## Reference Test Files

- Component tests: look for `*.spec.ts` co-located with components
- Mock setup: `src/mocks/`
- Vitest config: `vitest.config.js`
