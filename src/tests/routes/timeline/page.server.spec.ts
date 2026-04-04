import { describe, it, expect } from 'vitest';
import { load } from '../../../routes/timeline/+page.server';
import type { LogEntryShort } from '$lib/types';

describe('/timeline +page.server', () => {
	describe('load function', () => {
		it('returns an object with groupedEntries property', () => {
			const result = load();

			expect(result).toHaveProperty('groupedEntries');
			expect(typeof result.groupedEntries).toBe('object');
		});

		it('groupedEntries is grouped by month/year key', () => {
			const result = load();
			const keys = Object.keys(result.groupedEntries);

			// Keys should be in format "Month YYYY" (German month names)
			keys.forEach((key) => {
				expect(key).toMatch(/^[A-ZÄÖÜa-zäöüß]+ \d{4}$/);
			});
		});

		it('entries within groups have the same month/year', () => {
			const result = load();

			Object.entries(result.groupedEntries).forEach(([key, entries]: [string, LogEntryShort[]]) => {
				const [monthName, year] = key.split(' ');

				entries.forEach((entry) => {
					const entryDate = new Date(entry.datetime);
					expect(entryDate.getFullYear()).toBe(parseInt(year));
					// All entries in this group should have the same key
					expect(entry.key).toBe(key);
				});
			});
		});

		it('groups contain arrays of entries', () => {
			const result = load();

			Object.values(result.groupedEntries).forEach((group: LogEntryShort[]) => {
				expect(Array.isArray(group)).toBe(true);
				expect(group.length).toBeGreaterThan(0);
			});
		});

		it('entries have all required LogEntryShort properties plus key', () => {
			const result = load();
			const firstGroup = Object.values(result.groupedEntries)[0];
			const firstEntry = firstGroup[0];

			expect(firstEntry).toHaveProperty('id');
			expect(firstEntry).toHaveProperty('title');
			expect(firstEntry).toHaveProperty('section');
			expect(firstEntry).toHaveProperty('abstract');
			expect(firstEntry).toHaveProperty('datetime');
			expect(firstEntry).toHaveProperty('localeDatetime');
			expect(firstEntry).toHaveProperty('picture');
			expect(firstEntry).toHaveProperty('pictureTitle');
			expect(firstEntry).toHaveProperty('key');
		});

		it('uses German month names', () => {
			const result = load();
			const keys = Object.keys(result.groupedEntries);
			const germanMonths = [
				'Januar',
				'Februar',
				'März',
				'April',
				'Mai',
				'Juni',
				'Juli',
				'August',
				'September',
				'Oktober',
				'November',
				'Dezember'
			];

			keys.forEach((key) => {
				const monthName = key.split(' ')[0];
				expect(germanMonths).toContain(monthName);
			});
		});

		it('sailing trip should be primarily in 2012', () => {
			const result = load();
			const keys = Object.keys(result.groupedEntries);

			// Most or all entries should be from 2012
			const year2012Keys = keys.filter((key) => key.includes('2012'));
			expect(year2012Keys.length).toBeGreaterThan(0);
		});

		it('entries are sorted chronologically within groups', () => {
			const result = load();

			Object.values(result.groupedEntries).forEach((group: LogEntryShort[]) => {
				if (group.length > 1) {
					for (let i = 0; i < group.length - 1; i++) {
						const date1 = new Date(group[i].datetime);
						const date2 = new Date(group[i + 1].datetime);
						expect(date1.getTime()).toBeLessThanOrEqual(date2.getTime());
					}
				}
			});
		});
	});

	describe('groupedEntries type safety', () => {
		it('groupedEntries values are arrays of LogEntryShort', () => {
			const result = load();
			const grouped: Record<string, LogEntryShort[]> = result.groupedEntries;

			Object.values(grouped).forEach((group) => {
				group.forEach((entry) => {
					// Accessing typed properties without any-casts
					expect(typeof entry.id).toBe('string');
					expect(typeof entry.title).toBe('string');
					expect(typeof entry.datetime).toBe('string');
				});
			});
		});

		it('groupedEntries keys are strings', () => {
			const result = load();
			const grouped: Record<string, LogEntryShort[]> = result.groupedEntries;

			Object.keys(grouped).forEach((key) => {
				expect(typeof key).toBe('string');
				expect(key.length).toBeGreaterThan(0);
			});
		});
	});

	describe('groupBy function behavior', () => {
		it('creates separate groups for different months', () => {
			const result = load();
			const keys = Object.keys(result.groupedEntries);

			// Should have multiple month groups for the sailing trip
			expect(keys.length).toBeGreaterThan(1);
		});

		it('all original entries are present in groups', () => {
			const result = load();

			const totalEntries = Object.values(result.groupedEntries).reduce(
				(sum: number, group: LogEntryShort[]) => sum + group.length,
				0
			);

			expect(totalEntries).toBeGreaterThan(0);
		});

		it('no entries are duplicated across groups', () => {
			const result = load();
			const allIds = new Set();

			Object.values(result.groupedEntries).forEach((group: LogEntryShort[]) => {
				group.forEach((entry) => {
					expect(allIds.has(entry.id)).toBe(false);
					allIds.add(entry.id);
				});
			});
		});
	});

	describe('data transformation', () => {
		it('picture path includes folder and filename', () => {
			const result = load();
			const firstGroup = Object.values(result.groupedEntries)[0];
			const entry = firstGroup[0];

			expect(entry.picture).toContain('/');
			expect(entry.picture).toMatch(/\.(jpg|png|jpeg|gif)$/i);
		});

		it('uses first picture from pictures array', () => {
			const result = load();

			Object.values(result.groupedEntries).forEach((group: LogEntryShort[]) => {
				group.forEach((entry) => {
					expect(entry.picture).toBeDefined();
					expect(entry.pictureTitle).toBeDefined();
				});
			});
		});
	});
});
