import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTooltipHTML } from './createTooltipHTML';
import type { LogbookFeature } from './tooltip';

describe('createTooltipHTML', () => {
	describe('basic HTML generation', () => {
		it('creates valid HTML structure', () => {
			const feature: LogbookFeature = {
				title: 'Test Title',
				datetime: '2012-04-03T10:03:00.000Z',
				localeDatetime: 'Dienstag, 3. April 2012',
				section: 'Kiel - Stralsund',
				picture: '1-P1010492_gr.jpg',
				pictureTitle: 'Test Picture'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain('<div class="right glass">');
			expect(html).toContain('<img');
			expect(html).toContain('<time');
			expect(html).toContain('<address>');
			expect(html).toContain('<h3>');
			expect(html).toContain('</div>');
		});

		it('includes all feature properties in HTML', () => {
			const feature: LogbookFeature = {
				title: 'My Title',
				datetime: '2012-04-03T10:03:00.000Z',
				localeDatetime: 'Dienstag, 3. April 2012',
				section: 'Test Section',
				picture: 'test.jpg',
				pictureTitle: 'Picture Title'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain('My Title');
			expect(html).toContain('2012-04-03T10:03:00.000Z');
			expect(html).toContain('Dienstag, 3. April 2012');
			expect(html).toContain('Test Section');
			expect(html).toContain('test.jpg');
			expect(html).toContain('Picture Title');
		});

		it('includes image with correct attributes', () => {
			const feature: LogbookFeature = {
				title: 'Test',
				datetime: '2012-04-03T10:03:00.000Z',
				localeDatetime: 'Dienstag, 3. April 2012',
				section: 'Section',
				picture: 'image.jpg',
				pictureTitle: 'Image Alt Text'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain('src="/images/image.jpg"');
			expect(html).toContain('title="Image Alt Text"');
			expect(html).toContain('alt="Image Alt Text"');
			expect(html).toContain('loading="lazy"');
			expect(html).toContain('decoding="async"');
			expect(html).toContain('width="200"');
		});

		it('includes time element with datetime attribute', () => {
			const feature: LogbookFeature = {
				title: 'Test',
				datetime: '2012-04-03T10:03:00.000Z',
				localeDatetime: 'Dienstag, 3. April 2012',
				section: 'Section',
				picture: 'pic.jpg',
				pictureTitle: 'Pic'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain('<time datetime="2012-04-03T10:03:00.000Z">');
			expect(html).toContain('Dienstag, 3. April 2012</time>');
		});
	});

	describe('XSS protection (HTML escaping)', () => {
		// Test browser environment
		describe('browser environment', () => {
			beforeEach(() => {
				// Ensure document exists (jsdom provides this)
				expect(typeof document).toBe('object');
			});

			it('escapes HTML tags in title', () => {
				const feature: LogbookFeature = {
					title: '<script>alert("XSS")</script>',
					datetime: '2012-04-03T10:03:00.000Z',
					localeDatetime: 'Date',
					section: 'Section',
					picture: 'pic.jpg',
					pictureTitle: 'Pic'
				};

				const html = createTooltipHTML(feature);

				// textContent escaping converts < and > to entities
				expect(html).toContain('&lt;script&gt;');
				expect(html).toContain('alert("XSS")');
			});

			it('escapes HTML tags in section (content context)', () => {
				const feature: LogbookFeature = {
					title: 'Title',
					datetime: '2012-04-03T10:03:00.000Z',
					localeDatetime: 'Date',
					section: '<img src=x>',
					picture: 'pic.jpg',
					pictureTitle: 'Pic'
				};

				const html = createTooltipHTML(feature);

				// Tags are escaped in content context
				expect(html).toContain('&lt;img');
				expect(html).toContain('&gt;');
			});

			it('escapes HTML in picture filename', () => {
				const feature: LogbookFeature = {
					title: 'Title',
					datetime: '2012-04-03T10:03:00.000Z',
					localeDatetime: 'Date',
					section: 'Section',
					picture: 'pic.jpg"><script>alert(1)</script><img src="',
					pictureTitle: 'Pic'
				};

				const html = createTooltipHTML(feature);

				expect(html).toContain('&lt;script&gt;');
			});

			it('escapes special characters (&, <, >) in content', () => {
				const feature: LogbookFeature = {
					title: 'Title & Subtitle',
					datetime: '2012-04-03T10:03:00.000Z',
					localeDatetime: 'Date',
					section: 'Section < Other',
					picture: 'pic.jpg',
					pictureTitle: 'Pic > Image'
				};

				const html = createTooltipHTML(feature);

				expect(html).toContain('&amp;');
				expect(html).toContain('&lt;');
				expect(html).toContain('&gt;');
			});

			// Note: The current escapeHtml implementation using textContent
			// does NOT escape quotes, as textContent is designed for text nodes,
			// not attribute values. This means quotes in attribute context are vulnerable.
			it('does not escape quotes (documents limitation)', () => {
				const feature: LogbookFeature = {
					title: 'Title with "quotes" and \'apostrophes\'',
					datetime: '2012-04-03T10:03:00.000Z',
					localeDatetime: 'Date',
					section: 'Section',
					picture: 'pic.jpg',
					pictureTitle: 'Pic'
				};

				const html = createTooltipHTML(feature);

				// textContent does NOT escape quotes (not needed for text nodes)
				expect(html).toContain('"quotes"');
				expect(html).toContain("'apostrophes'");
				// These will NOT be entity-encoded:
				expect(html).not.toContain('&quot;');
				expect(html).not.toContain('&#039;');
			});
		});

		// Test SSR fallback (if document is not available)
		describe('SSR environment fallback', () => {
			let originalDocument: typeof document | undefined;

			beforeEach(() => {
				// Save original document
				originalDocument = global.document;
				// Simulate SSR by removing document
				// @ts-expect-error - Intentionally testing SSR behavior
				delete global.document;
			});

			afterEach(() => {
				// Restore document
				if (originalDocument) {
					global.document = originalDocument;
				}
			});

			it('uses regex fallback for escaping when document is unavailable', () => {
				const feature: LogbookFeature = {
					title: '<script>alert("XSS")</script>',
					datetime: '2012-04-03T10:03:00.000Z',
					localeDatetime: 'Date',
					section: 'Section & More',
					picture: 'pic.jpg',
					pictureTitle: 'Pic > Image'
				};

				const html = createTooltipHTML(feature);

				// Regex fallback should escape all entities
				expect(html).toContain('&lt;script&gt;');
				expect(html).toContain('&amp;');
				expect(html).toContain('&gt;');
			});

			it('escapes quotes with regex fallback', () => {
				const feature: LogbookFeature = {
					title: 'Title',
					datetime: '2012-04-03T10:03:00.000Z',
					localeDatetime: 'Date',
					section: 'Section',
					picture: 'pic.jpg',
					pictureTitle: 'Pic with "quotes" and \'apostrophes\''
				};

				const html = createTooltipHTML(feature);

				// Regex fallback DOES escape quotes
				expect(html).toContain('&quot;');
				expect(html).toContain('&#039;');
			});
		});
	});

	describe('real-world data from logbook', () => {
		it('handles actual logbook entry data', () => {
			const feature: LogbookFeature = {
				title: 'Test',
				datetime: '2012-04-03T10:03:00.000Z',
				localeDatetime: 'Dienstag, 3. April 2012',
				section: 'Kiel - Stralsund',
				picture: '201204031203/1-P1010492_gr.jpg',
				pictureTitle: 'Abschied - Silja verabschiedet sich von Lena.'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain('Dienstag, 3. April 2012');
			expect(html).toContain('Kiel - Stralsund');
			expect(html).toContain('/images/201204031203/1-P1010492_gr.jpg');
			expect(html).toContain('Abschied - Silja verabschiedet sich von Lena.');
		});

		it('handles German umlauts and special characters', () => {
			const feature: LogbookFeature = {
				title: 'Überfahrt nach Rügen',
				datetime: '2012-04-05T10:00:00.000Z',
				localeDatetime: 'Donnerstag, 5. April 2012',
				section: 'Warnemünde - Barhöft',
				picture: 'pic.jpg',
				pictureTitle: 'Schönes Wetter'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain('Überfahrt nach Rügen');
			expect(html).toContain('Warnemünde - Barhöft');
			expect(html).toContain('Schönes Wetter');
		});
	});

	describe('edge cases', () => {
		it('handles empty strings', () => {
			const feature: LogbookFeature = {
				title: '',
				datetime: '',
				localeDatetime: '',
				section: '',
				picture: '',
				pictureTitle: ''
			};

			const html = createTooltipHTML(feature);

			// Should still generate valid HTML structure
			expect(html).toContain('<div class="right glass">');
			expect(html).toContain('<img');
			expect(html).toContain('<time');
			expect(html).toContain('<h3></h3>');
		});

		it('handles very long strings', () => {
			const longString = 'A'.repeat(1000);
			const feature: LogbookFeature = {
				title: longString,
				datetime: '2012-04-03T10:03:00.000Z',
				localeDatetime: 'Date',
				section: 'Section',
				picture: 'pic.jpg',
				pictureTitle: 'Pic'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain(longString);
		});

		it('handles unicode characters', () => {
			const feature: LogbookFeature = {
				title: '🚢 Sailing Trip 🌊',
				datetime: '2012-04-03T10:03:00.000Z',
				localeDatetime: 'Date',
				section: 'Section',
				picture: 'pic.jpg',
				pictureTitle: '⛵ Boat'
			};

			const html = createTooltipHTML(feature);

			expect(html).toContain('🚢 Sailing Trip 🌊');
			expect(html).toContain('⛵ Boat');
		});
	});
});
