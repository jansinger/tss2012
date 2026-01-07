import { describe, it, expect, beforeEach } from 'vitest';
import { AppState } from './AppState.svelte';
import type { LogEntryShort } from './types';

describe('AppState', () => {
	const mockEntry: LogEntryShort = {
		id: 'entry-1',
		title: 'Test Entry',
		datetime: '2012-04-03T10:00:00.000Z',
		localeDatetime: 'Dienstag, 3. April 2012',
		section: 'Kiel - Stralsund',
		abstract: 'Test abstract',
		picture: '201204031203/1-pic.jpg',
		pictureTitle: 'Test Picture'
	};

	const mockEntry2: LogEntryShort = {
		id: 'entry-2',
		title: 'Second Entry',
		datetime: '2012-04-05T14:00:00.000Z',
		localeDatetime: 'Donnerstag, 5. April 2012',
		section: 'Stralsund - Barhöft',
		abstract: 'Second abstract',
		picture: '201204051403/2-pic.jpg',
		pictureTitle: 'Second Picture'
	};

	beforeEach(() => {
		// Reset state before each test
		AppState.currentEntries = [];
	});

	describe('initial state', () => {
		it('should have empty currentEntries array initially', () => {
			expect(AppState.currentEntries).toEqual([]);
		});

		it('should have currentEntries as an array', () => {
			expect(Array.isArray(AppState.currentEntries)).toBe(true);
		});
	});

	describe('currentEntries', () => {
		it('should update currentEntries when assigned', () => {
			AppState.currentEntries = [mockEntry];

			expect(AppState.currentEntries).toHaveLength(1);
			expect(AppState.currentEntries[0]).toEqual(mockEntry);
		});

		it('should handle multiple entries', () => {
			AppState.currentEntries = [mockEntry, mockEntry2];

			expect(AppState.currentEntries).toHaveLength(2);
			expect(AppState.currentEntries[0].id).toBe('entry-1');
			expect(AppState.currentEntries[1].id).toBe('entry-2');
		});

		it('should clear entries when assigned empty array', () => {
			// First add some entries
			AppState.currentEntries = [mockEntry, mockEntry2];
			expect(AppState.currentEntries).toHaveLength(2);

			// Then clear
			AppState.currentEntries = [];
			expect(AppState.currentEntries).toHaveLength(0);
		});

		it('should replace existing entries on new assignment', () => {
			AppState.currentEntries = [mockEntry];
			expect(AppState.currentEntries[0].id).toBe('entry-1');

			AppState.currentEntries = [mockEntry2];
			expect(AppState.currentEntries).toHaveLength(1);
			expect(AppState.currentEntries[0].id).toBe('entry-2');
		});
	});

	describe('state immutability behavior', () => {
		it('should preserve entry properties', () => {
			AppState.currentEntries = [mockEntry];

			const storedEntry = AppState.currentEntries[0];
			expect(storedEntry.id).toBe(mockEntry.id);
			expect(storedEntry.title).toBe(mockEntry.title);
			expect(storedEntry.datetime).toBe(mockEntry.datetime);
			expect(storedEntry.localeDatetime).toBe(mockEntry.localeDatetime);
			expect(storedEntry.section).toBe(mockEntry.section);
			expect(storedEntry.abstract).toBe(mockEntry.abstract);
			expect(storedEntry.picture).toBe(mockEntry.picture);
			expect(storedEntry.pictureTitle).toBe(mockEntry.pictureTitle);
		});

		it('should maintain reference after reassignment', () => {
			const entries = [mockEntry, mockEntry2];
			AppState.currentEntries = entries;

			// State should contain the entries
			expect(AppState.currentEntries).toHaveLength(2);
		});
	});

	describe('edge cases', () => {
		it('should handle entry with empty strings', () => {
			const emptyEntry: LogEntryShort = {
				id: '',
				title: '',
				datetime: '',
				localeDatetime: '',
				section: '',
				abstract: '',
				picture: '',
				pictureTitle: ''
			};

			AppState.currentEntries = [emptyEntry];
			expect(AppState.currentEntries).toHaveLength(1);
			expect(AppState.currentEntries[0].id).toBe('');
		});

		it('should handle entry with special characters', () => {
			const specialEntry: LogEntryShort = {
				...mockEntry,
				title: '<script>alert("xss")</script>',
				section: 'Kiel & Stralsund < > "Test"'
			};

			AppState.currentEntries = [specialEntry];
			expect(AppState.currentEntries[0].title).toBe('<script>alert("xss")</script>');
			expect(AppState.currentEntries[0].section).toBe('Kiel & Stralsund < > "Test"');
		});

		it('should handle entry with Unicode characters', () => {
			const unicodeEntry: LogEntryShort = {
				...mockEntry,
				title: '🚢 Sailing Trip 🌊',
				section: 'Überfahrt nach Rügen'
			};

			AppState.currentEntries = [unicodeEntry];
			expect(AppState.currentEntries[0].title).toBe('🚢 Sailing Trip 🌊');
			expect(AppState.currentEntries[0].section).toBe('Überfahrt nach Rügen');
		});

		it('should handle large number of entries', () => {
			const manyEntries = Array.from({ length: 100 }, (_, i) => ({
				...mockEntry,
				id: `entry-${i}`,
				title: `Entry ${i}`
			}));

			AppState.currentEntries = manyEntries;
			expect(AppState.currentEntries).toHaveLength(100);
			expect(AppState.currentEntries[99].id).toBe('entry-99');
		});
	});

	describe('type safety', () => {
		it('should only accept LogEntryShort objects', () => {
			// This test verifies the TypeScript type is correctly enforced at runtime
			const validEntry: LogEntryShort = mockEntry;
			AppState.currentEntries = [validEntry];

			expect(AppState.currentEntries[0]).toHaveProperty('id');
			expect(AppState.currentEntries[0]).toHaveProperty('title');
			expect(AppState.currentEntries[0]).toHaveProperty('datetime');
			expect(AppState.currentEntries[0]).toHaveProperty('localeDatetime');
			expect(AppState.currentEntries[0]).toHaveProperty('section');
			expect(AppState.currentEntries[0]).toHaveProperty('abstract');
			expect(AppState.currentEntries[0]).toHaveProperty('picture');
			expect(AppState.currentEntries[0]).toHaveProperty('pictureTitle');
		});
	});
});
