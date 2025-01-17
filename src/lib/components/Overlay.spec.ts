import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Overlay from './Overlay.svelte';
import { goto } from '$app/navigation';

// Mock Navigation
vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));

describe('Overlay', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render children content', () => {
        const { container } = render(Overlay, {
            props: {
                children: '<div data-testid="child">Test Content</div>'
            }
        });
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should close on ESC key press', async () => {
        const { container } = render(Overlay);
        await fireEvent.keyDown(window, { key: 'Escape' });
        expect(goto).toHaveBeenCalled();
    });

    it('should close on outside click', async () => {
        const { container } = render(Overlay);
        await fireEvent.click(document.body);
        expect(goto).toHaveBeenCalled();
    });

    it('should not close on inside click', async () => {
        const { container } = render(Overlay, {
            props: {
                children: '<div data-testid="content">Content</div>'
            }
        });
        const content = screen.getByTestId('content');
        await fireEvent.click(content);
        expect(goto).not.toHaveBeenCalled();
    });

    it('should render outside content when provided', () => {
        const { container } = render(Overlay, {
            props: {
                children: '<div>Content</div>',
                outside: '<div data-testid="outside">Outside</div>'
            }
        });
        expect(screen.getByTestId('outside')).toBeInTheDocument();
    });
});