import { sortedEntries } from '$lib/sortedEntries';
import { load, entries } from '../../../../routes/log/[id]/+page.server';
import { expect, test, describe } from 'vitest';

describe('entries function', () => {
	test('returns an entry for every sortedEntry', () => {
		const result = entries();
		expect(result).toHaveLength(sortedEntries.length);
	});

	test('each entry has an id param matching _id', () => {
		const result = entries();
		result.forEach((entry, i) => {
			expect(entry).toHaveProperty('id');
			expect(entry.id).toBe(sortedEntries[i]._id);
		});
	});

	test('all returned ids are unique', () => {
		const result = entries();
		const ids = result.map((e) => e.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('load function', () => {
	test('should return entry object with previous and next values if id exists in sortedEntries', async () => {
		const id = '82014b17-e618-4b5d-a244-140298f69916';
		const result = await load({ params: { id } } as any);

		const index = sortedEntries.findIndex((row) => row._id === id);
		const prev = index > 0 ? sortedEntries[index - 1]._id : undefined;
		const next = index < sortedEntries.length - 1 ? sortedEntries[index + 1]._id : undefined;

		expect(result).toEqual({
			entry: {
				_prev: prev,
				_next: next,
				...sortedEntries[index]
			}
		});
	});

	test('should return status 404 and errors "Not Found" if id does not exist in sortedEntries', async () => {
		const id = 'nonExistentId';
		try {
			await load({ params: { id } } as any);
		} catch (error) {
			expect(error).toMatchObject({
				status: 404,
				body: { message: 'Not Found' }
			});
		}
	});
});
