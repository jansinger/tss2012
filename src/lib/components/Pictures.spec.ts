import { render } from '@testing-library/svelte';
import Pictures from './Pictures.svelte';
import { describe, expect, it } from 'vitest';
import type { PicturesEntity } from '$lib/types';

describe('Pictures component', () => {
	it('renders pictures', () => {
		const pictures: PicturesEntity[] = [
			{ filename: 'pic1.jpg', title: 'Picture 1', text: 'Picture Text 1' },
			{ filename: 'pic2.jpg', title: 'Picture 2', text: 'Picture Text 2' }
		];
		const folder = 'testFolder';

		const htmlPictures = render(Pictures, { pictures, folder });

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
