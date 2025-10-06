import { sortedEntries } from '$lib/sortedEntries';
import { load } from '../../../../routes/log/[id]/+page.server';
import { expect, test, describe } from 'vitest';

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
