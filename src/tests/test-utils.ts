import type { LogEntry, PicturesEntity, Coordinates } from '$lib/types';
import { vi } from 'vitest';

/**
 * Creates a mock LogEntry with sensible defaults
 * @param overrides - Partial LogEntry to override defaults
 * @returns Complete LogEntry object
 */
export function createMockLogEntry(overrides: Partial<LogEntry> = {}): LogEntry {
	const defaults: LogEntry = {
		_id: 'test-entry-id',
		_rev: '1-abc123',
		category: 'logbook',
		datetime: '2012-07-15T14:30:00Z',
		localeDatetime: '15.07.2012 14:30',
		title: 'Test Entry',
		section: 'Test Section',
		abstract: 'Test abstract text',
		text: '<p>Test entry text content</p>',
		pictureFolder: 'test-folder',
		pictures: [
			{
				filename: 'test-image.jpg',
				title: 'Test Image',
				text: 'Test image description',
				sizebig: { width: 800, height: 600 },
				sizesmall: { width: 200, height: 150 }
			}
		],
		data: {
			cog: '090',
			sog: '5.2',
			coordinates: [10.5, 54.2] as Coordinates
		},
		visible: true
	};

	return { ...defaults, ...overrides };
}

/**
 * Creates a mock PicturesEntity with sensible defaults
 * @param overrides - Partial PicturesEntity to override defaults
 * @returns Complete PicturesEntity object
 */
export function createMockPicture(overrides: Partial<PicturesEntity> = {}): PicturesEntity {
	const defaults: PicturesEntity = {
		filename: 'test-image.jpg',
		title: 'Test Image',
		text: 'Test image description',
		sizebig: { width: 800, height: 600 },
		sizesmall: { width: 200, height: 150 }
	};

	return { ...defaults, ...overrides };
}

/**
 * Creates multiple mock log entries
 * @param count - Number of entries to create
 * @param overridesFn - Optional function to customize each entry
 * @returns Array of LogEntry objects
 */
export function createMockLogEntries(
	count: number,
	overridesFn?: (index: number) => Partial<LogEntry>
): LogEntry[] {
	return Array.from({ length: count }, (_, i) => {
		const overrides = overridesFn ? overridesFn(i) : {};
		return createMockLogEntry({
			_id: `test-entry-${i}`,
			title: `Entry ${i + 1}`,
			datetime: new Date(2012, 6, i + 1, 12, 0).toISOString(),
			...overrides
		});
	});
}

/**
 * Waits for a condition to be true
 * @param condition - Function that returns boolean
 * @param timeout - Maximum time to wait in ms
 * @param interval - Check interval in ms
 */
export async function waitFor(
	condition: () => boolean,
	timeout = 5000,
	interval = 50
): Promise<void> {
	const startTime = Date.now();
	while (!condition()) {
		if (Date.now() - startTime > timeout) {
			throw new Error('waitFor timeout exceeded');
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
}

/**
 * Waits for an element to be present in the DOM
 * @param selector - CSS selector
 * @param timeout - Maximum time to wait in ms
 */
export async function waitForElement(selector: string, timeout = 5000): Promise<Element> {
	const startTime = Date.now();
	while (true) {
		const element = document.querySelector(selector);
		if (element) return element;

		if (Date.now() - startTime > timeout) {
			throw new Error(`Element ${selector} not found within ${timeout}ms`);
		}
		await new Promise((resolve) => setTimeout(resolve, 50));
	}
}

/**
 * Creates a mock OpenLayers Map instance
 */
export function createMockOLMap() {
	const listeners: { [key: string]: Function[] } = {};

	return {
		setTarget: vi.fn(),
		updateSize: vi.fn(),
		getView: vi.fn(() => ({
			setCenter: vi.fn(),
			setZoom: vi.fn(),
			getCenter: vi.fn(() => [0, 0]),
			getZoom: vi.fn(() => 8),
			getProjection: vi.fn(() => ({ getCode: () => 'EPSG:3857' }))
		})),
		getLayers: vi.fn(() => ({
			getArray: vi.fn(() => [])
		})),
		getOverlays: vi.fn(() => ({
			getArray: vi.fn(() => [])
		})),
		addOverlay: vi.fn(),
		removeOverlay: vi.fn(),
		on: vi.fn((event: string, handler: Function) => {
			if (!listeners[event]) listeners[event] = [];
			listeners[event].push(handler);
		}),
		un: vi.fn((event: string, handler: Function) => {
			if (listeners[event]) {
				listeners[event] = listeners[event].filter((h) => h !== handler);
			}
		}),
		dispatchEvent: vi.fn((event: any) => {
			const eventType = typeof event === 'string' ? event : event.type;
			if (listeners[eventType]) {
				listeners[eventType].forEach((handler) => handler(event));
			}
		}),
		// Helper to trigger events in tests
		_triggerEvent: (eventType: string, eventData: any = {}) => {
			const event = { type: eventType, ...eventData };
			if (listeners[eventType]) {
				listeners[eventType].forEach((handler) => handler(event));
			}
		},
		_listeners: listeners
	};
}

/**
 * Creates a mock OpenLayers Feature
 */
export function createMockOLFeature(properties: Record<string, any> = {}) {
	return {
		get: vi.fn((key: string) => properties[key]),
		set: vi.fn((key: string, value: any) => {
			properties[key] = value;
		}),
		getProperties: vi.fn(() => properties),
		setProperties: vi.fn((props: Record<string, any>) => {
			Object.assign(properties, props);
		}),
		getGeometry: vi.fn(() => ({
			getCoordinates: vi.fn(() => properties.coordinates || [0, 0]),
			getType: vi.fn(() => 'Point')
		})),
		getId: vi.fn(() => properties._id || 'test-feature-id')
	};
}

/**
 * Creates a mock OpenLayers Layer
 */
export function createMockOLLayer(options: { name?: string; visible?: boolean } = {}) {
	return {
		get: vi.fn((key: string) => {
			if (key === 'name') return options.name || 'test-layer';
			return undefined;
		}),
		set: vi.fn(),
		getVisible: vi.fn(() => options.visible !== false),
		setVisible: vi.fn(),
		getSource: vi.fn(() => ({
			getFeatures: vi.fn(() => [])
		}))
	};
}

/**
 * Simulates a click event on an element
 */
export function simulateClick(element: HTMLElement) {
	const event = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	element.dispatchEvent(event);
}

/**
 * Simulates a keyboard event
 */
export function simulateKeyboard(
	element: HTMLElement | Window,
	key: string,
	eventType: 'keydown' | 'keyup' | 'keypress' = 'keydown'
) {
	const event = new KeyboardEvent(eventType, {
		key,
		bubbles: true,
		cancelable: true
	});
	element.dispatchEvent(event);
}

/**
 * Simulates a wheel event
 */
export function simulateWheel(element: HTMLElement, deltaX: number, deltaY: number = 0) {
	const event = new WheelEvent('wheel', {
		deltaX,
		deltaY,
		bubbles: true,
		cancelable: true
	});
	element.dispatchEvent(event);
}

/**
 * Waits for a specific number of milliseconds
 */
export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flushes all pending promises and timers
 */
export async function flushPromises(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 0));
}
