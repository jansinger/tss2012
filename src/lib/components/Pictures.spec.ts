import { render, waitFor } from '@testing-library/svelte';
import Pictures from './Pictures.svelte';
import { describe, expect, it, vi } from 'vitest';
import type { PicturesEntity } from '$lib/types';

// Mock the swiper/element/bundle module to avoid async loading issues in tests
vi.mock('swiper/element/bundle', () => ({
	register: vi.fn()
}));

describe('Pictures component', () => {
	it('renders pictures', async () => {
		const pictures: PicturesEntity[] = [
			{ filename: 'pic1.jpg', title: 'Picture 1', text: 'Picture Text 1' },
			{ filename: 'pic2.jpg', title: 'Picture 2', text: 'Picture Text 2' }
		];
		const folder = 'testFolder';

		const htmlPictures = render(Pictures, { pictures, folder });

		// Wait for the async Swiper registration and component to re-render
		await waitFor(() => {
			const allImages = htmlPictures.container.querySelectorAll('img');
			expect(allImages.length).toBeGreaterThan(0);
		});

		pictures.forEach((picture) => {
			// Main images have alt text for accessibility
			const mainImgElement = htmlPictures.getByAltText(picture.text) as HTMLImageElement;
			expect(mainImgElement.src).toContain(`${folder}/${picture.filename}`);
			expect(mainImgElement.alt).toContain(picture.text);
			expect(mainImgElement.title).toContain(picture.title);
		});

		// Verify all images are rendered (main + thumbnails)
		const allImages = htmlPictures.container.querySelectorAll('img');
		expect(allImages).toHaveLength(pictures.length * 2); // main + thumbnail for each picture
	});
});
