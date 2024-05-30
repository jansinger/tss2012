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
			const imgElement = htmlPictures.getAllByAltText(picture.text) as HTMLImageElement[];
			expect(imgElement).toHaveLength(2);
			imgElement.forEach((img) => {
				expect(img.src).toContain(`${folder}/${picture.filename}`);
				expect(img.alt).toContain(picture.text);
				expect(img.title).toContain(picture.title);
			});
		});
	});
});
