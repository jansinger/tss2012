import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Overlay from './Overlay.svelte';
import { goto } from '$app/navigation';
import { AppState } from '$lib/AppState.svelte';

// Mock dependencies
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/AppState.svelte', () => ({
	AppState: {
		currentEntries: []
	}
}));

describe('Overlay', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		AppState.currentEntries = [];
	});

	describe('rendering', () => {
		it('renders overlay container', () => {
			const { container } = render(Overlay);

			const overlay = container.querySelector('.container-article');
			expect(overlay).toBeInTheDocument();
		});
	});

	describe('click outside to close', () => {
		it('closes overlay when clicking outside content area', async () => {
			render(Overlay);

			// Click outside (on document body)
			await fireEvent.mouseDown(document.body);

			// Should call goto and clear state
			expect(goto).toHaveBeenCalledWith('/');
			expect(AppState.currentEntries).toEqual([]);
		});

		it('does not close when clicking inside content area', async () => {
			const { container } = render(Overlay);

			const content = container.querySelector('.container-article');
			if (content) {
				await fireEvent.mouseDown(content);
			}

			// Should NOT call goto
			expect(goto).not.toHaveBeenCalled();
		});

		it('prevents default when clicking outside', async () => {
			render(Overlay);

			const mouseEvent = new MouseEvent('mousedown', {
				bubbles: true,
				cancelable: true
			});
			const preventDefaultSpy = vi.spyOn(mouseEvent, 'preventDefault');

			await fireEvent(document.body, mouseEvent);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});
	});

	describe('keyboard handling', () => {
		it('closes overlay when Escape key is pressed', async () => {
			render(Overlay);

			await fireEvent.keyDown(window, { key: 'Escape' });

			expect(goto).toHaveBeenCalledWith('/');
			expect(AppState.currentEntries).toEqual([]);
		});

		it('does not close on other key presses', async () => {
			render(Overlay);

			await fireEvent.keyDown(window, { key: 'Enter' });
			await fireEvent.keyDown(window, { key: 'Space' });
			await fireEvent.keyDown(window, { key: 'Tab' });

			expect(goto).not.toHaveBeenCalled();
		});

		it('prevents default on Escape key', async () => {
			render(Overlay);

			const keyEvent = new KeyboardEvent('keydown', {
				key: 'Escape',
				bubbles: true,
				cancelable: true
			});
			const preventDefaultSpy = vi.spyOn(keyEvent, 'preventDefault');

			await fireEvent(window, keyEvent);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});
	});

	describe('close function', () => {
		it('exported close function clears AppState', async () => {
			const { component } = render(Overlay);

			AppState.currentEntries = [{ id: 'test' }] as any;

			// Call exported close function
			component.close();

			expect(AppState.currentEntries).toEqual([]);
		});

		it('exported close function navigates to home', async () => {
			const { component } = render(Overlay);

			component.close();

			expect(goto).toHaveBeenCalledWith('/');
		});
	});

	describe('element binding', () => {
		it('binds content element correctly', () => {
			const { container } = render(Overlay);

			const content = container.querySelector('.container-article');
			expect(content).toBeInstanceOf(HTMLElement);
		});

		it('content element is used for contains check', async () => {
			const { container } = render(Overlay);

			const content = container.querySelector('.container-article');
			if (content) {
				// Click on content element itself
				await fireEvent.mouseDown(content);
				expect(goto).not.toHaveBeenCalled();

				// Click outside
				await fireEvent.mouseDown(document.body);
				expect(goto).toHaveBeenCalledWith('/');
			}
		});
	});

	describe('integration scenarios', () => {
		it('closes overlay and navigates on Escape', async () => {
			render(Overlay);

			// Press Escape to close
			await fireEvent.keyDown(window, { key: 'Escape' });
			expect(goto).toHaveBeenCalledTimes(1);
			expect(AppState.currentEntries).toEqual([]);
		});
	});
});
