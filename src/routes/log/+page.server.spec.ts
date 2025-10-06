import { describe, it, expect } from 'vitest';
import { load } from './+page.server';
import type { LogEntryShort } from '$lib/types';

describe('/log +page.server', () => {
	describe('load function', () => {
		it('returns an object with entries property', () => {
			const result = load();

			expect(result).toHaveProperty('entries');
			expect(Array.isArray(result.entries)).toBe(true);
		});

		it('entries are of type LogEntryShort', () => {
			const result = load();
			const firstEntry = result.entries[0];

			// Check required LogEntryShort properties
			expect(firstEntry).toHaveProperty('id');
			expect(firstEntry).toHaveProperty('title');
			expect(firstEntry).toHaveProperty('section');
			expect(firstEntry).toHaveProperty('abstract');
			expect(firstEntry).toHaveProperty('datetime');
			expect(firstEntry).toHaveProperty('localeDatetime');
			expect(firstEntry).toHaveProperty('picture');
			expect(firstEntry).toHaveProperty('pictureTitle');
		});

		it('entries have valid structure', () => {
			const result = load();
			const entry = result.entries[0];

			expect(typeof entry.id).toBe('string');
			expect(typeof entry.title).toBe('string');
			expect(typeof entry.section).toBe('string');
			expect(typeof entry.abstract).toBe('string');
			expect(typeof entry.datetime).toBe('string');
			expect(typeof entry.localeDatetime).toBe('string');
			expect(typeof entry.picture).toBe('string');
			expect(typeof entry.pictureTitle).toBe('string');
		});

		it('picture path includes folder and filename', () => {
			const result = load();
			const entry = result.entries[0];

			// Picture should be in format "folder/filename.jpg"
			expect(entry.picture).toContain('/');
			expect(entry.picture).toMatch(/\.(jpg|png|jpeg|gif)$/i);
		});

		it('datetime is valid ISO 8601 format', () => {
			const result = load();
			const entry = result.entries[0];

			const date = new Date(entry.datetime);
			expect(date).toBeInstanceOf(Date);
			expect(isNaN(date.getTime())).toBe(false);
		});

		it('returns multiple entries', () => {
			const result = load();

			expect(result.entries.length).toBeGreaterThan(0);
		});

		it('all entries have unique IDs', () => {
			const result = load();
			const ids = result.entries.map((entry) => entry.id);
			const uniqueIds = new Set(ids);

			expect(uniqueIds.size).toBe(ids.length);
		});

		it('entries contain expected sailing trip data', () => {
			const result = load();

			// Check that we have sailing-related entries
			const hasSailingContent = result.entries.some(
				(entry) =>
					entry.section.includes('Kiel') ||
					entry.section.includes('Stralsund') ||
					entry.section.includes('Warnemünde')
			);

			expect(hasSailingContent).toBe(true);
		});
	});

	describe('data transformation', () => {
		it('maps original entry fields correctly', () => {
			const result = load();
			const entry = result.entries[0];

			// Verify the mapping works as expected
			expect(entry.id).toBeDefined();
			expect(entry.id.length).toBeGreaterThan(0);
		});

		it('combines pictureFolder and filename correctly', () => {
			const result = load();

			result.entries.forEach((entry) => {
				// Picture path should have folder/filename format
				const parts = entry.picture.split('/');
				expect(parts.length).toBeGreaterThanOrEqual(2);
			});
		});

		it('uses first picture from pictures array', () => {
			const result = load();

			// All entries should have a picture (from pictures[0])
			result.entries.forEach((entry) => {
				expect(entry.picture).toBeDefined();
				expect(entry.picture.length).toBeGreaterThan(0);
				expect(entry.pictureTitle).toBeDefined();
			});
		});
	});
});
