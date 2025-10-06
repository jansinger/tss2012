import '@testing-library/jest-dom/vitest';

// Mock Element.prototype.animate for Svelte transitions in jsdom
Element.prototype.animate = Element.prototype.animate || function() {
	return {
		cancel: () => {},
		finish: () => {},
		play: () => {},
		pause: () => {},
		reverse: () => {},
		playbackRate: 1,
		currentTime: 0,
		startTime: 0,
		playState: 'finished'
	};
};
