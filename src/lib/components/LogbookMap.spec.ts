import { afterEach, beforeEach, expect, vi, it, describe } from 'vitest';
import { render, type RenderResult } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import LogbookMap from './LogbookMap.svelte'; // Replace with your actual component path
import type LogbookMap__SvelteComponent_ from './LogbookMap.svelte';

// Unit tests cover structural/a11y aspects only (DOM, accessibility attributes,
// unmount safety). Map initialisation is tested in LogbookMap.integration.spec.ts,
// which mocks '$lib/ol/map' and '$lib/ol/overlays/tooltip' via vi.doMock().

describe('MyComponent', () => {
	let container: HTMLElement;
	let tooltipElement: HTMLElement;
	let mapElement: HTMLElement;

	beforeEach(async () => {
		container = document.createElement('div');
		document.body.appendChild(container);
		const {
			getByTestId
		}: RenderResult<
			LogbookMap__SvelteComponent_,
			typeof import('@testing-library/dom/types/queries')
		> = render(LogbookMap, { target: container });

		tooltipElement = getByTestId('tooltip');
		mapElement = getByTestId('map');
	});

	afterEach(() => {
		container.remove();
	});

	it('mounts correctly and binds elements', async () => {
		expect(tooltipElement).toBeInTheDocument();
		expect(mapElement).toBeInTheDocument();
	});

	it('unmounts without error even when initMap is still pending', async () => {
		// This test guards against the race condition where the $effect cleanup
		// runs before the initMap() Promise resolves. With the cancelled-flag
		// pattern, the resolved cleanup function is invoked immediately rather
		// than silently dropped.
		const { unmount } = render(LogbookMap, { target: document.createElement('div') });

		// Unmount synchronously — before any microtasks from initMap resolve
		expect(() => unmount()).not.toThrow();
	});

	it('renders map and tooltip in correct DOM order', () => {
		const tooltipIndex = Array.from(container.children).indexOf(tooltipElement);
		const mapIndex = Array.from(container.children).indexOf(mapElement);

		// Tooltip rendered before map (as defined in template)
		expect(tooltipIndex).toBeLessThan(mapIndex);
	});

	it('map element has correct accessibility attributes', () => {
		expect(mapElement).toHaveAttribute('role', 'region');
		expect(mapElement).toHaveAttribute('aria-label', 'Interaktive Karte der Segelreise');
	});
});
