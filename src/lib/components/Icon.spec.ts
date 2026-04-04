import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Icon from './Icon.svelte';

describe('Icon', () => {
	describe('structure', () => {
		it('renders an SVG element', () => {
			const { container } = render(Icon, { name: 'info-circle' });
			const svg = container.querySelector('svg');
			expect(svg).toBeInTheDocument();
		});

		it('renders a path element inside SVG', () => {
			const { container } = render(Icon, { name: 'info-circle' });
			const path = container.querySelector('svg path');
			expect(path).toBeInTheDocument();
		});

		it('sets aria-hidden="true" for decorative use', () => {
			const { container } = render(Icon, { name: 'info-circle' });
			const svg = container.querySelector('svg');
			expect(svg).toHaveAttribute('aria-hidden', 'true');
		});

		it('sets viewBox to 0 0 16 16', () => {
			const { container } = render(Icon, { name: 'info-circle' });
			const svg = container.querySelector('svg');
			expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
		});

		it('sets fill to currentColor', () => {
			const { container } = render(Icon, { name: 'info-circle' });
			const svg = container.querySelector('svg');
			expect(svg).toHaveAttribute('fill', 'currentColor');
		});
	});

	describe('size prop', () => {
		it('uses 1em as default size', () => {
			const { container } = render(Icon, { name: 'map' });
			const svg = container.querySelector('svg');
			expect(svg).toHaveAttribute('width', '1em');
			expect(svg).toHaveAttribute('height', '1em');
		});

		it('applies custom size', () => {
			const { container } = render(Icon, { name: 'map', size: '24px' });
			const svg = container.querySelector('svg');
			expect(svg).toHaveAttribute('width', '24px');
			expect(svg).toHaveAttribute('height', '24px');
		});
	});

	describe('class prop', () => {
		it('always includes icon base class and icon-{name} class', () => {
			const { container } = render(Icon, { name: 'x-circle' });
			const svg = container.querySelector('svg');
			expect(svg).toHaveClass('icon');
			expect(svg).toHaveClass('icon-x-circle');
		});

		it('appends extra class when provided', () => {
			const { container } = render(Icon, { name: 'map', class: 'custom-class' });
			const svg = container.querySelector('svg');
			expect(svg).toHaveClass('icon');
			expect(svg).toHaveClass('custom-class');
		});
	});

	describe('icon variants — snapshots', () => {
		const iconNames = [
			'info-circle',
			'view-list',
			'x-circle',
			'caret-left-fill',
			'caret-right-fill',
			'map'
		] as const;

		iconNames.forEach((name) => {
			it(`renders ${name} icon correctly`, () => {
				const { container } = render(Icon, { name });
				expect(container.innerHTML).toMatchSnapshot();
			});
		});
	});
});
