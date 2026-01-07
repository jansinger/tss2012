import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import LogbookEntriesOverlay from './LogbookEntriesOverlay.svelte';
import type { LogEntryShort } from '$lib/types';

// Mock goto to prevent navigation errors in tests
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('LogbookEntriesOverlay', () => {
	const mockEntries: LogEntryShort[] = [
		{
			id: 'entry-1',
			title: 'First Entry',
			datetime: '2012-04-03T10:00:00.000Z',
			localeDatetime: 'Dienstag, 3. April 2012',
			section: 'Kiel - Stralsund',
			abstract: 'First abstract',
			picture: '201204031203/1-pic.jpg',
			pictureTitle: 'First Picture'
		}
	];

	describe('conditional rendering', () => {
		it('does not render entry-list when currentEntries is empty', () => {
			const { container } = render(LogbookEntriesOverlay, { currentEntries: [] });
			const entryList = container.querySelector('.entry-list');
			expect(entryList).not.toBeInTheDocument();
		});

		it('renders entry-list when currentEntries has items', () => {
			const { container } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});
			const entryList = container.querySelector('.entry-list');
			expect(entryList).toBeInTheDocument();
		});
	});

	describe('close button', () => {
		it('renders close button when overlay is visible', () => {
			const { getByRole } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});

			const closeButton = getByRole('button', { name: /overlay schließen/i });
			expect(closeButton).toBeInTheDocument();
		});

		it('close button has correct aria-label', () => {
			const { getByRole } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});

			const closeButton = getByRole('button');
			expect(closeButton).toHaveAttribute('aria-label', 'Overlay schließen');
		});

		it('close button contains icon element', () => {
			const { container } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});

			// Icon component renders an SVG with class "icon-x-circle"
			const icon = container.querySelector('.icon-x-circle');
			expect(icon).toBeInTheDocument();
		});
	});

	describe('accessibility', () => {
		it('has correct ARIA attributes on entry list', () => {
			const { container } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});

			const entryList = container.querySelector('.entry-list');
			expect(entryList).toHaveAttribute('role', 'region');
			expect(entryList).toHaveAttribute('aria-label', 'Logbuch-Einträge');
			expect(entryList).toHaveAttribute('aria-live', 'polite');
		});

		it('close button is focusable', () => {
			const { getByRole } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});

			const closeButton = getByRole('button');
			closeButton.focus();
			expect(closeButton).toHaveFocus();
		});
	});

	describe('structure', () => {
		it('renders navigation wrapper around close button', () => {
			const { container } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});

			const nav = container.querySelector('nav');
			expect(nav).toBeInTheDocument();

			const button = nav?.querySelector('button');
			expect(button).toBeInTheDocument();
		});

		it('applies correct CSS classes', () => {
			const { container } = render(LogbookEntriesOverlay, {
				currentEntries: mockEntries
			});

			const closeButton = container.querySelector('.close-navigation');
			expect(closeButton).toBeInTheDocument();
			expect(closeButton).toHaveClass('glass');

			const entryList = container.querySelector('.entry-list');
			expect(entryList).toBeInTheDocument();
		});
	});

	describe('event handlers', () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it('closes overlay when close button is clicked', async () => {
			const { getByRole, container } = render(LogbookEntriesOverlay, {
				currentEntries: [...mockEntries]
			});

			const closeButton = getByRole('button');
			await fireEvent.click(closeButton);

			// After click, currentEntries should be empty, so entry-list should not be rendered
			const entryList = container.querySelector('.entry-list');
			expect(entryList).not.toBeInTheDocument();
		});

		it('closes overlay when Enter key is pressed on close button', async () => {
			const { getByRole, container } = render(LogbookEntriesOverlay, {
				currentEntries: [...mockEntries]
			});

			const closeButton = getByRole('button');
			await fireEvent.keyDown(closeButton, { key: 'Enter' });

			const entryList = container.querySelector('.entry-list');
			expect(entryList).not.toBeInTheDocument();
		});

		it('closes overlay when Space key is pressed on close button', async () => {
			const { getByRole, container } = render(LogbookEntriesOverlay, {
				currentEntries: [...mockEntries]
			});

			const closeButton = getByRole('button');
			await fireEvent.keyDown(closeButton, { key: ' ' });

			const entryList = container.querySelector('.entry-list');
			expect(entryList).not.toBeInTheDocument();
		});

		it('does not close overlay for other keys', async () => {
			const { getByRole, container } = render(LogbookEntriesOverlay, {
				currentEntries: [...mockEntries]
			});

			const closeButton = getByRole('button');
			await fireEvent.keyDown(closeButton, { key: 'Escape' });

			// Entry list should still be visible
			const entryList = container.querySelector('.entry-list');
			expect(entryList).toBeInTheDocument();
		});

		it('prevents default on click event', async () => {
			const { getByRole } = render(LogbookEntriesOverlay, {
				currentEntries: [...mockEntries]
			});

			const closeButton = getByRole('button');
			const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
			const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

			closeButton.dispatchEvent(clickEvent);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('prevents default on Enter key press', async () => {
			const { getByRole } = render(LogbookEntriesOverlay, {
				currentEntries: [...mockEntries]
			});

			const closeButton = getByRole('button');
			const keyEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true
			});
			const preventDefaultSpy = vi.spyOn(keyEvent, 'preventDefault');

			closeButton.dispatchEvent(keyEvent);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});
	});
});
