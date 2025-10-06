import '@testing-library/jest-dom/vitest';

// Mock Element.prototype.animate for Svelte transitions in jsdom
Element.prototype.animate = Element.prototype.animate || function() {
	const animation = {
		cancel: () => {},
		finish: () => {},
		play: () => {},
		pause: () => {},
		reverse: () => {},
		updatePlaybackRate: () => {},
		persist: () => {},
		commitStyles: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => true,
		playbackRate: 1,
		currentTime: 0,
		startTime: 0,
		playState: 'finished',
		replaceState: 'active',
		pending: false,
		ready: Promise.resolve(),
		finished: Promise.resolve(),
		onfinish: null,
		oncancel: null,
		onremove: null,
		effect: null,
		timeline: null,
		id: ''
	};
	return animation;
};
