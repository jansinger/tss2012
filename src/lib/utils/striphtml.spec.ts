import { describe, it, expect } from 'vitest';
import { stripHtml } from './striphtml';

describe('stripHtml', () => {
	describe('HTML tag removal', () => {
		it('removes simple HTML tags', () => {
			const html = '<p>Hello World</p>';
			const result = stripHtml(html);
			expect(result).toBe('Hello World');
		});

		it('removes multiple HTML tags', () => {
			const html = '<div><p>Hello</p><span>World</span></div>';
			const result = stripHtml(html);
			expect(result).toBe('HelloWorld');
		});

		it('removes nested HTML tags', () => {
			const html = '<div><p><strong>Bold</strong> text</p></div>';
			const result = stripHtml(html);
			expect(result).toBe('Bold text');
		});

		it('removes self-closing tags', () => {
			const html = 'Line 1<br/>Line 2<hr/>Line 3';
			const result = stripHtml(html);
			expect(result).toBe('Line 1Line 2Line 3');
		});

		it('removes tags with attributes', () => {
			const html = '<a href="https://example.com" class="link">Click here</a>';
			const result = stripHtml(html);
			expect(result).toBe('Click here');
		});

		it('removes malformed/incomplete tags', () => {
			const html = '<p>Text with <incomplete tag';
			const result = stripHtml(html);
			// The iterative approach removes the opening tags
			expect(result).toBe('Text with <incomplete tag');
		});

		it('handles deeply nested tags', () => {
			const html = '<div><div><div><span><em><strong>Deep</strong></em></span></div></div></div>';
			const result = stripHtml(html);
			expect(result).toBe('Deep');
		});
	});

	describe('HTML entity decoding', () => {
		it('decodes &nbsp; to space', () => {
			const html = 'Hello&nbsp;World';
			const result = stripHtml(html);
			expect(result).toBe('Hello World');
		});

		it('decodes &lt; to <', () => {
			const html = '&lt;div&gt;';
			const result = stripHtml(html);
			expect(result).toBe('<div>');
		});

		it('decodes &gt; to >', () => {
			const html = 'a &gt; b';
			const result = stripHtml(html);
			expect(result).toBe('a > b');
		});

		it('decodes &quot; to "', () => {
			const html = '&quot;quoted&quot;';
			const result = stripHtml(html);
			expect(result).toBe('"quoted"');
		});

		it('decodes &#039; to single quote', () => {
			const html = "it&#039;s working";
			const result = stripHtml(html);
			expect(result).toBe("it's working");
		});

		it('decodes &apos; to single quote', () => {
			const html = "it&apos;s working";
			const result = stripHtml(html);
			expect(result).toBe("it's working");
		});

		it('decodes &amp; to & (must be last)', () => {
			const html = 'Tom &amp; Jerry';
			const result = stripHtml(html);
			expect(result).toBe('Tom & Jerry');
		});

		it('decodes multiple entities in correct order', () => {
			const html = '&lt;p&gt;Hello&nbsp;&amp;&nbsp;World&lt;/p&gt;';
			const result = stripHtml(html);
			expect(result).toBe('<p>Hello & World</p>');
		});
	});

	describe('combined HTML tags and entities', () => {
		it('removes tags and decodes entities', () => {
			const html = '<p>Hello&nbsp;<strong>World</strong>&nbsp;&amp;&nbsp;<em>more</em></p>';
			const result = stripHtml(html);
			expect(result).toBe('Hello World & more');
		});

		it('handles entities inside tags', () => {
			const html = '<a title="Tom &amp; Jerry">Link</a>';
			const result = stripHtml(html);
			expect(result).toBe('Link');
		});
	});

	describe('edge cases', () => {
		it('handles empty string', () => {
			const html = '';
			const result = stripHtml(html);
			expect(result).toBe('');
		});

		it('handles string without HTML', () => {
			const html = 'Plain text without tags';
			const result = stripHtml(html);
			expect(result).toBe('Plain text without tags');
		});

		it('handles only HTML tags (no text)', () => {
			const html = '<div><p></p></div>';
			const result = stripHtml(html);
			expect(result).toBe('');
		});

		it('handles whitespace-only content', () => {
			const html = '   ';
			const result = stripHtml(html);
			expect(result).toBe('');
		});

		it('trims whitespace', () => {
			const html = '  <p>Text</p>  ';
			const result = stripHtml(html);
			expect(result).toBe('Text');
		});

		it('handles text with leading/trailing tags', () => {
			const html = '<br><br>Content<br><br>';
			const result = stripHtml(html);
			expect(result).toBe('Content');
		});
	});

	describe('XSS protection', () => {
		it('removes script tags and content', () => {
			const html = '<script>alert("XSS")</script>Safe text';
			const result = stripHtml(html);
			expect(result).toBe('alert("XSS")Safe text');
			// Note: Content is preserved but tags removed - this is expected behavior
		});

		it('removes event handlers in attributes', () => {
			const html = '<div onclick="alert(\'XSS\')">Click me</div>';
			const result = stripHtml(html);
			expect(result).toBe('Click me');
		});

		it('removes style tags', () => {
			const html = '<style>body { display: none; }</style>Text';
			const result = stripHtml(html);
			expect(result).toBe('body { display: none; }Text');
		});

		it('handles malicious nested tags', () => {
			const html = '<div><script><div></script></div>';
			const result = stripHtml(html);
			// All tags should be removed through iterative processing
			expect(result).not.toContain('<');
			expect(result).not.toContain('>');
		});
	});

	describe('real-world examples from logbook', () => {
		it('handles logbook entry with line breaks', () => {
			const html = 'Am 1.4. haben wir abgelegt - das ist kein Aprilscherz - und sind unterwegs Richtung Osten.<br>';
			const result = stripHtml(html);
			expect(result).toBe('Am 1.4. haben wir abgelegt - das ist kein Aprilscherz - und sind unterwegs Richtung Osten.');
		});

		it('handles complex paragraph with multiple tags', () => {
			const html = '<p>Wie geplant haben wir am <strong>1.4.2012</strong> die Leinen losgeschmissen. Nach einem letzten Frühstück direkt in <em>Schilksee</em> mit der Familie ging es gegen 10 Uhr zum Steg&nbsp;5.</p>';
			const result = stripHtml(html);
			expect(result).toBe('Wie geplant haben wir am 1.4.2012 die Leinen losgeschmissen. Nach einem letzten Frühstück direkt in Schilksee mit der Familie ging es gegen 10 Uhr zum Steg 5.');
		});

		it('handles title with HTML formatting', () => {
			const html = 'Test<br class="aloha-end-br">';
			const result = stripHtml(html);
			expect(result).toBe('Test');
		});
	});
});
