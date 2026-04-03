import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const tokens = readFileSync(resolve('src/lib/scss/_tokens.scss'), 'utf-8');
const logbookEntry = readFileSync(resolve('src/lib/components/LogbookEntry.svelte'), 'utf-8');
const logbookMap = readFileSync(resolve('src/lib/components/LogbookMap.svelte'), 'utf-8');

describe('design tokens — _tokens.scss', () => {
	it('defines --color-surface-tooltip token', () => {
		expect(tokens).toContain('--color-surface-tooltip');
	});

	it('defines --font-size-display token', () => {
		expect(tokens).toContain('--font-size-display');
	});
});

describe('design tokens — LogbookEntry.svelte', () => {
	it('has no hardcoded padding: 2rem', () => {
		expect(logbookEntry).not.toContain('padding: 2rem');
	});

	it('has no hardcoded margin-bottom: 2rem', () => {
		expect(logbookEntry).not.toContain('margin-bottom: 2rem');
	});

	it('has no hardcoded padding: 0.75rem', () => {
		expect(logbookEntry).not.toContain('0.75rem');
	});

	it('has no hardcoded margin-bottom: 1.5rem', () => {
		expect(logbookEntry).not.toContain('margin-bottom: 1.5rem');
	});

	it('has no hardcoded padding-bottom: 1rem', () => {
		expect(logbookEntry).not.toContain('padding-bottom: 1rem');
	});

	it('has no hardcoded margin-bottom: 0.5rem', () => {
		expect(logbookEntry).not.toContain('margin-bottom: 0.5rem');
	});

	it('has no hardcoded font-size: 1.75rem', () => {
		expect(logbookEntry).not.toContain('font-size: 1.75rem');
	});

	it('has no hardcoded margin-bottom: 1.25rem', () => {
		expect(logbookEntry).not.toContain('margin-bottom: 1.25rem');
	});

	it('has no var() fallback for --space-3-5', () => {
		expect(logbookEntry).not.toContain('var(--space-3-5, 15px)');
	});
});

describe('design tokens — LogbookMap.svelte', () => {
	it('uses --color-surface-tooltip without hardcoded fallback', () => {
		expect(logbookMap).not.toContain('var(--color-surface-tooltip, #444444)');
		expect(logbookMap).toContain('var(--color-surface-tooltip)');
	});
});

describe('responsive — media query migrations', () => {
	const impressum = readFileSync(resolve('src/routes/impressum/+page.svelte'), 'utf-8');
	const barrierefreiheit = readFileSync(
		resolve('src/routes/barrierefreiheit/+page.svelte'),
		'utf-8'
	);

	it('LogbookEntry uses bp-md mixin instead of raw max-width media query', () => {
		expect(logbookEntry).not.toContain('@media screen and (max-width: 767px)');
		expect(logbookEntry).toContain('mixins.bp-md');
	});

	it('impressum uses bp-lg mixin instead of raw max-width media query', () => {
		expect(impressum).not.toContain('@media screen and (max-width: 1023px)');
		expect(impressum).toContain('mixins.bp-lg');
	});

	it('barrierefreiheit uses bp-lg mixin instead of raw max-width media query', () => {
		expect(barrierefreiheit).not.toContain('@media screen and (max-width: 1023px)');
		expect(barrierefreiheit).toContain('mixins.bp-lg');
	});
});
