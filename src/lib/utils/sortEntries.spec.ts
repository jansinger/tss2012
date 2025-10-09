import { describe, it, expect } from 'vitest';
import { sortEntries } from './sortEntries';
import type { SortableEntry } from '$lib/types';

interface TestEntry extends SortableEntry {
	_id: string;
	title: string;
}

describe('sortEntries', () => {
	it('sorts entries in ascending order by datetime', () => {
		const entries: TestEntry[] = [
			{ _id: '3', title: 'Third', datetime: '2012-04-05T10:00:00.000Z' },
			{ _id: '1', title: 'First', datetime: '2012-04-03T10:00:00.000Z' },
			{ _id: '2', title: 'Second', datetime: '2012-04-04T10:00:00.000Z' }
		];

		const sorted = sortEntries(entries);

		expect(sorted).toHaveLength(3);
		expect(sorted[0]._id).toBe('1');
		expect(sorted[1]._id).toBe('2');
		expect(sorted[2]._id).toBe('3');
	});

	it('handles empty array', () => {
		const entries: TestEntry[] = [];
		const sorted = sortEntries(entries);

		expect(sorted).toEqual([]);
		expect(sorted).toHaveLength(0);
	});

	it('handles single entry', () => {
		const entries: TestEntry[] = [
			{ _id: '1', title: 'Only', datetime: '2012-04-03T10:00:00.000Z' }
		];

		const sorted = sortEntries(entries);

		expect(sorted).toHaveLength(1);
		expect(sorted[0]._id).toBe('1');
	});

	it('handles entries with same datetime (stable sort)', () => {
		const entries: TestEntry[] = [
			{ _id: '2', title: 'Second', datetime: '2012-04-03T10:00:00.000Z' },
			{ _id: '1', title: 'First', datetime: '2012-04-03T10:00:00.000Z' },
			{ _id: '3', title: 'Third', datetime: '2012-04-03T10:00:00.000Z' }
		];

		const sorted = sortEntries(entries);

		expect(sorted).toHaveLength(3);
		// All entries have same timestamp, so relative order should be preserved
		expect(sorted[0].datetime).toBe(sorted[1].datetime);
		expect(sorted[1].datetime).toBe(sorted[2].datetime);
	});

	it('does not mutate original array (immutability)', () => {
		const entries: TestEntry[] = [
			{ _id: '3', title: 'Third', datetime: '2012-04-05T10:00:00.000Z' },
			{ _id: '1', title: 'First', datetime: '2012-04-03T10:00:00.000Z' }
		];

		const originalOrder = [...entries];
		const sorted = sortEntries(entries);

		// Original array should remain unchanged
		expect(entries[0]._id).toBe(originalOrder[0]._id);
		expect(entries[1]._id).toBe(originalOrder[1]._id);

		// Sorted array should be different
		expect(sorted[0]._id).toBe('1');
		expect(sorted[1]._id).toBe('3');

		// Should be different array instances
		expect(sorted).not.toBe(entries);
	});

	it('handles entries with millisecond differences', () => {
		const entries: TestEntry[] = [
			{ _id: '2', title: 'Second', datetime: '2012-04-03T10:00:00.002Z' },
			{ _id: '1', title: 'First', datetime: '2012-04-03T10:00:00.001Z' },
			{ _id: '3', title: 'Third', datetime: '2012-04-03T10:00:00.003Z' }
		];

		const sorted = sortEntries(entries);

		expect(sorted[0]._id).toBe('1');
		expect(sorted[1]._id).toBe('2');
		expect(sorted[2]._id).toBe('3');
	});

	it('handles entries spanning multiple years', () => {
		const entries: TestEntry[] = [
			{ _id: '3', title: 'Third', datetime: '2014-01-01T00:00:00.000Z' },
			{ _id: '1', title: 'First', datetime: '2012-04-03T10:00:00.000Z' },
			{ _id: '2', title: 'Second', datetime: '2013-12-31T23:59:59.000Z' }
		];

		const sorted = sortEntries(entries);

		expect(sorted[0]._id).toBe('1');
		expect(sorted[1]._id).toBe('2');
		expect(sorted[2]._id).toBe('3');
	});

	it('preserves all entry properties', () => {
		const entries: TestEntry[] = [
			{ _id: '2', title: 'Second Entry', datetime: '2012-04-04T10:00:00.000Z' },
			{ _id: '1', title: 'First Entry', datetime: '2012-04-03T10:00:00.000Z' }
		];

		const sorted = sortEntries(entries);

		expect(sorted[0]).toEqual({
			_id: '1',
			title: 'First Entry',
			datetime: '2012-04-03T10:00:00.000Z'
		});
		expect(sorted[1]).toEqual({
			_id: '2',
			title: 'Second Entry',
			datetime: '2012-04-04T10:00:00.000Z'
		});
	});
});
