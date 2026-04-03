import { describe, it, expect } from 'vitest';
import { logEntryToShort } from './types';
import type { LogEntry } from './types';

const baseEntry: LogEntry = {
	_id: 'abc-123',
	_rev: '1-abc',
	category: 'log',
	data: { cog: '270', sog: '5.2' },
	pictureFolder: '20120704',
	title: 'Ankunft in Rostock',
	section: 'Stralsund - Rostock',
	abstract: 'Wir kamen spät an.',
	text: '<p>Langer Text</p>',
	pictures: [
		{ filename: 'img1.jpg', title: 'Sonnenuntergang', text: '' },
		{ filename: 'img2.jpg', title: 'Hafen', text: '' }
	],
	visible: true,
	datetime: '2012-07-04T18:00:00.000Z',
	localeDatetime: 'Mittwoch, 4. Juli 2012'
};

describe('logEntryToShort', () => {
	describe('field mapping', () => {
		it('maps _id to id', () => {
			expect(logEntryToShort(baseEntry).id).toBe('abc-123');
		});

		it('preserves title', () => {
			expect(logEntryToShort(baseEntry).title).toBe('Ankunft in Rostock');
		});

		it('preserves section', () => {
			expect(logEntryToShort(baseEntry).section).toBe('Stralsund - Rostock');
		});

		it('preserves abstract', () => {
			expect(logEntryToShort(baseEntry).abstract).toBe('Wir kamen spät an.');
		});

		it('preserves datetime', () => {
			expect(logEntryToShort(baseEntry).datetime).toBe('2012-07-04T18:00:00.000Z');
		});

		it('preserves localeDatetime', () => {
			expect(logEntryToShort(baseEntry).localeDatetime).toBe('Mittwoch, 4. Juli 2012');
		});

		it('builds picture path from pictureFolder and first picture filename', () => {
			expect(logEntryToShort(baseEntry).picture).toBe('20120704/img1.jpg');
		});

		it('uses title of first picture as pictureTitle', () => {
			expect(logEntryToShort(baseEntry).pictureTitle).toBe('Sonnenuntergang');
		});
	});

	describe('edge cases', () => {
		it('returns empty picture when pictures is null', () => {
			const entry: LogEntry = { ...baseEntry, pictures: null };
			expect(logEntryToShort(entry).picture).toBe('');
		});

		it('returns empty picture when pictures is undefined', () => {
			const entry: LogEntry = { ...baseEntry, pictures: undefined };
			expect(logEntryToShort(entry).picture).toBe('');
		});

		it('returns empty picture when pictures array is empty', () => {
			const entry: LogEntry = { ...baseEntry, pictures: [] };
			expect(logEntryToShort(entry).picture).toBe('');
		});

		it('returns empty pictureTitle when pictures is null', () => {
			const entry: LogEntry = { ...baseEntry, pictures: null };
			expect(logEntryToShort(entry).pictureTitle).toBe('');
		});

		it('returns empty pictureTitle when pictures array is empty', () => {
			const entry: LogEntry = { ...baseEntry, pictures: [] };
			expect(logEntryToShort(entry).pictureTitle).toBe('');
		});

		it('includes _prev and _next when present', () => {
			const entry: LogEntry = { ...baseEntry, _prev: 'prev-id', _next: 'next-id' };
			const result = logEntryToShort(entry);
			// Result is LogEntryShort — prev/next not in the type, but mapping should not error
			expect(result.id).toBe('abc-123');
		});
	});

	describe('return type shape', () => {
		it('has all required LogEntryShort fields', () => {
			const result = logEntryToShort(baseEntry);
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('title');
			expect(result).toHaveProperty('section');
			expect(result).toHaveProperty('abstract');
			expect(result).toHaveProperty('datetime');
			expect(result).toHaveProperty('localeDatetime');
			expect(result).toHaveProperty('picture');
			expect(result).toHaveProperty('pictureTitle');
		});

		it('does not include LogEntry-only fields like _rev or text', () => {
			const result = logEntryToShort(baseEntry);
			expect(result).not.toHaveProperty('_rev');
			expect(result).not.toHaveProperty('text');
			expect(result).not.toHaveProperty('_id');
		});
	});
});
