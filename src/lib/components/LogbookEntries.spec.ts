import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import LogbookEntries from './LogbookEntries.svelte';
import type { LogEntryShort } from '$lib/types';
import { AppState } from '$lib/AppState.svelte';

// Mock AppState
vi.mock('$lib/AppState.svelte', () => ({
	AppState: {
		currentEntries: []
	}
}));

describe('LogbookEntries', () => {
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
		},
		{
			id: 'entry-2',
			title: 'Second Entry',
			datetime: '2012-04-05T14:00:00.000Z',
			localeDatetime: 'Donnerstag, 5. April 2012',
			section: 'Stralsund - Barhöft',
			abstract: 'Second abstract',
			picture: '201204051403/2-pic.jpg',
			pictureTitle: 'Second Picture'
		},
		{
			id: 'entry-3',
			title: 'Third Entry',
			datetime: '2012-04-04T12:00:00.000Z',
			localeDatetime: 'Mittwoch, 4. April 2012',
			section: 'Warnemünde - Rostock',
			abstract: 'Third abstract',
			picture: '201204041203/3-pic.jpg',
			pictureTitle: 'Third Picture'
		}
	];

	beforeEach(() => {
		// Reset AppState before each test
		AppState.currentEntries = [];
	});

	describe('rendering', () => {
		it('renders empty list when no entries provided', () => {
			const { container } = render(LogbookEntries, { entries: [] });
			const articles = container.querySelectorAll('article');
			expect(articles).toHaveLength(0);
		});

		it('renders all provided entries', () => {
			const { container } = render(LogbookEntries, { entries: mockEntries });
			const articles = container.querySelectorAll('article');
			expect(articles).toHaveLength(3);
		});

		it('renders entries in sorted order by datetime', () => {
			const { getAllByRole } = render(LogbookEntries, { entries: mockEntries });
			const links = getAllByRole('link');

			// Expected order: entry-1 (April 3), entry-3 (April 4), entry-2 (April 5)
			expect(links[0]).toHaveAttribute('href', '/log/entry-1');
			expect(links[1]).toHaveAttribute('href', '/log/entry-3');
			expect(links[2]).toHaveAttribute('href', '/log/entry-2');
		});

		it('displays all entry properties correctly', () => {
			const { getByText, getByAltText } = render(LogbookEntries, {
				entries: [mockEntries[0]]
			});

			// Check text content
			expect(getByText('First Entry')).toBeInTheDocument();
			expect(getByText('Dienstag, 3. April 2012')).toBeInTheDocument();
			expect(getByText('Kiel - Stralsund')).toBeInTheDocument();

			// Check image
			const img = getByAltText('First Picture') as HTMLImageElement;
			expect(img).toBeInTheDocument();
			expect(img.src).toContain('/images/201204031203/1-pic.jpg');
			expect(img.title).toBe('First Picture');
			// Use getAttribute instead of property access for loading attribute
			expect(img.getAttribute('loading')).toBe('lazy');
		});

		it('renders time element with correct datetime attribute', () => {
			const { container } = render(LogbookEntries, { entries: [mockEntries[0]] });
			const time = container.querySelector('time');

			expect(time).toBeInTheDocument();
			expect(time?.getAttribute('datetime')).toBe('2012-04-03T10:00:00.000Z');
			expect(time?.textContent).toBe('Dienstag, 3. April 2012');
		});

		it('renders address element with section', () => {
			const { container } = render(LogbookEntries, { entries: [mockEntries[0]] });
			const address = container.querySelector('address');

			expect(address).toBeInTheDocument();
			expect(address?.textContent).toBe('Kiel - Stralsund');
		});
	});

	describe('links and navigation', () => {
		it('creates correct links for each entry', () => {
			const { getAllByRole } = render(LogbookEntries, { entries: mockEntries });
			const links = getAllByRole('link') as HTMLAnchorElement[];

			expect(links[0].href).toContain('/log/entry-1');
			expect(links[1].href).toContain('/log/entry-3');
			expect(links[2].href).toContain('/log/entry-2');
		});

		it('applies stripHtml to title attribute', () => {
			const entriesWithHtml: LogEntryShort[] = [
				{
					...mockEntries[0],
					title: '<strong>Bold</strong> Title<br>with HTML'
				}
			];

			const { getByRole } = render(LogbookEntries, { entries: entriesWithHtml });
			const link = getByRole('link');

			// stripHtml should remove HTML tags from title attribute
			expect(link.title).toBe('Bold Titlewith HTML');
		});

		it('resets AppState.currentEntries on click', async () => {
			// Set some initial state
			AppState.currentEntries = [mockEntries[0], mockEntries[1]] as any;

			const { getAllByRole } = render(LogbookEntries, { entries: mockEntries });
			const firstLink = getAllByRole('link')[0];

			await fireEvent.click(firstLink);

			// Should reset to empty array
			expect(AppState.currentEntries).toEqual([]);
		});
	});

	describe('HTML rendering in title', () => {
		it('renders HTML in title paragraph using @html', () => {
			const entriesWithHtml: LogEntryShort[] = [
				{
					...mockEntries[0],
					title: 'Title with <strong>bold</strong> text'
				}
			];

			const { container } = render(LogbookEntries, { entries: entriesWithHtml });
			const paragraph = container.querySelector('article p');

			// @html should render the HTML
			const strong = paragraph?.querySelector('strong');
			expect(strong).toBeInTheDocument();
			expect(strong?.textContent).toBe('bold');
		});

		it('renders line breaks in title', () => {
			const entriesWithHtml: LogEntryShort[] = [
				{
					...mockEntries[0],
					title: 'Line 1<br>Line 2'
				}
			];

			const { container } = render(LogbookEntries, { entries: entriesWithHtml });
			const paragraph = container.querySelector('article p');

			const br = paragraph?.querySelector('br');
			expect(br).toBeInTheDocument();
		});
	});

	describe('sorting behavior', () => {
		it('sorts entries in chronological order (earliest first)', () => {
			// Provide unsorted entries
			const unsortedEntries: LogEntryShort[] = [
				{ ...mockEntries[1], datetime: '2012-04-05T14:00:00.000Z' }, // Latest
				{ ...mockEntries[0], datetime: '2012-04-03T10:00:00.000Z' }, // Earliest
				{ ...mockEntries[2], datetime: '2012-04-04T12:00:00.000Z' } // Middle
			];

			const { getAllByRole } = render(LogbookEntries, { entries: unsortedEntries });
			const links = getAllByRole('link');

			// Should be sorted: earliest -> latest
			expect(links[0]).toHaveAttribute('href', '/log/entry-1');
			expect(links[1]).toHaveAttribute('href', '/log/entry-3');
			expect(links[2]).toHaveAttribute('href', '/log/entry-2');
		});

		it('handles entries with same datetime', () => {
			const sameTimeEntries: LogEntryShort[] = [
				{ ...mockEntries[0], id: 'a', datetime: '2012-04-03T10:00:00.000Z' },
				{ ...mockEntries[1], id: 'b', datetime: '2012-04-03T10:00:00.000Z' },
				{ ...mockEntries[2], id: 'c', datetime: '2012-04-03T10:00:00.000Z' }
			];

			const { container } = render(LogbookEntries, { entries: sameTimeEntries });
			const articles = container.querySelectorAll('article');

			// Should render all entries despite same datetime
			expect(articles).toHaveLength(3);
		});
	});

	describe('edge cases', () => {
		it('handles entry with empty strings', () => {
			const emptyEntry: LogEntryShort[] = [
				{
					id: 'empty',
					title: '',
					datetime: '2012-04-03T10:00:00.000Z',
					localeDatetime: '',
					section: '',
					abstract: '',
					picture: '',
					pictureTitle: ''
				}
			];

			const { container } = render(LogbookEntries, { entries: emptyEntry });
			const article = container.querySelector('article');

			expect(article).toBeInTheDocument();
		});

		it('handles long titles', () => {
			const longTitle = 'A'.repeat(500);
			const longEntry: LogEntryShort[] = [
				{
					...mockEntries[0],
					title: longTitle
				}
			];

			const { container } = render(LogbookEntries, { entries: longEntry });
			const paragraph = container.querySelector('article p');

			expect(paragraph?.textContent).toBe(longTitle);
		});

		it('handles special characters in section', () => {
			const specialEntry: LogEntryShort[] = [
				{
					...mockEntries[0],
					section: 'Kiel & Stralsund < > "Test"'
				}
			];

			const { getByText } = render(LogbookEntries, { entries: specialEntry });
			expect(getByText('Kiel & Stralsund < > "Test"')).toBeInTheDocument();
		});

		it('handles Unicode characters', () => {
			const unicodeEntry: LogEntryShort[] = [
				{
					...mockEntries[0],
					title: '🚢 Sailing Trip 🌊',
					section: 'Überfahrt nach Rügen'
				}
			];

			const { getByText } = render(LogbookEntries, { entries: unicodeEntry });
			expect(getByText('🚢 Sailing Trip 🌊')).toBeInTheDocument();
			expect(getByText('Überfahrt nach Rügen')).toBeInTheDocument();
		});
	});

	describe('reactivity', () => {
		it('renders correctly with one entry initially', () => {
			const { container } = render(LogbookEntries, { entries: [mockEntries[0]] });

			const articles = container.querySelectorAll('article');
			expect(articles).toHaveLength(1);
		});

		it('renders correctly with multiple entries', () => {
			const { container } = render(LogbookEntries, { entries: mockEntries });

			const articles = container.querySelectorAll('article');
			expect(articles).toHaveLength(3);
		});

		it('sorts unsorted entries correctly', () => {
			// Render with unsorted entries to verify sorting works
			const { getAllByRole } = render(LogbookEntries, {
				entries: [mockEntries[1], mockEntries[0], mockEntries[2]]
			});

			const links = getAllByRole('link');
			// Should be sorted chronologically regardless of input order
			expect(links[0]).toHaveAttribute('href', '/log/entry-1');
			expect(links[1]).toHaveAttribute('href', '/log/entry-3');
			expect(links[2]).toHaveAttribute('href', '/log/entry-2');
		});
	});
});
