import { detectLanguage, extractAPIInfo, extractCodeBlocks, extractHeadings, extractLinks, htmlToText } from './utils';

describe('htmlToText', () => {
	it('strips tags and decodes entities', () => {
		const html = '<p>Hello &amp; <strong>world</strong></p>';
		expect(htmlToText(html)).toBe('Hello & world');
	});

	it('removes script and style content', () => {
		const html = '<style>.a{color:red}</style><p>visible</p><script>alert(1)</script>';
		expect(htmlToText(html)).toBe('visible');
	});

	it('inserts line breaks for block-level closing tags', () => {
		expect(htmlToText('<li>one</li><li>two</li>')).toBe('one\ntwo');
	});

	it('treats plain and self-closing <br>/<hr> as line breaks', () => {
		expect(htmlToText('a<br>b<br/>c<hr>d')).toBe('a\nb\nc\nd');
	});
});

describe('detectLanguage', () => {
	it('detects typescript from Component imports', () => {
		expect(detectLanguage("import { Component } from '@angular/core';")).toBe('typescript');
	});

	it('detects bash from npm/ng commands', () => {
		expect(detectLanguage('npm install @spartan-ng/cli')).toBe('bash');
	});

	it('detects html when hlm markup is present', () => {
		expect(detectLanguage('<button hlmBtn>Click</button>')).toBe('html');
	});
});

describe('extractCodeBlocks', () => {
	it('extracts a code block and detects language from the class attribute', () => {
		const html = `
			<pre><code class="language-typescript">import { Component } from '@angular/core';

@Component({ selector: 'app-root', template: '' })
export class AppComponent {}
</code></pre>`;
		const blocks = extractCodeBlocks(html);
		expect(blocks).toHaveLength(1);
		expect(blocks[0].language).toBe('typescript');
		expect(blocks[0].code).toContain('export class AppComponent');
	});

	it('falls back to content-based language detection when no class is present', () => {
		const html = `
			<pre><code>npm install @spartan-ng/cli
npx ng g @spartan-ng/cli:ui button
echo "done"
</code></pre>`;
		const blocks = extractCodeBlocks(html);
		expect(blocks).toHaveLength(1);
		expect(blocks[0].language).toBe('bash');
	});

	it('deduplicates identical code blocks', () => {
		const block = `<pre><code class="language-typescript">const a = 1;
const b = 2;
const c = 3;
</code></pre>`;
		const blocks = extractCodeBlocks(`${block}\n${block}`);
		expect(blocks).toHaveLength(1);
	});

	it('skips snippets shorter than three lines', () => {
		const html = '<pre><code>const a = 1;</code></pre>';
		expect(extractCodeBlocks(html)).toHaveLength(0);
	});
});

describe('extractHeadings', () => {
	it('returns h1-h3 text in order', () => {
		const html = '<h1>Title</h1><h2>Section</h2><h4>Ignored</h4><h3>Sub</h3>';
		expect(extractHeadings(html)).toEqual(['Title', 'Section', 'Sub']);
	});
});

describe('extractLinks', () => {
	it('returns href and text pairs', () => {
		const html = '<a href="https://spartan.ng">Spartan</a>';
		expect(extractLinks(html)).toEqual([{ href: 'https://spartan.ng', text: 'Spartan' }]);
	});
});

describe('extractAPIInfo', () => {
	it('returns an empty structure for unrelated HTML', () => {
		const info = extractAPIInfo('<p>nothing here</p>');
		expect(info.brainAPI).toEqual([]);
		expect(info.helmAPI).toEqual([]);
		expect(info.examples).toEqual([]);
	});

	it('collects examples from code blocks', () => {
		const html = `
			<pre><code class="language-typescript">import { Component } from '@angular/core';

@Component({ selector: 'demo', template: '' })
export class DemoComponent {}
</code></pre>`;
		const info = extractAPIInfo(html);
		expect(info.examples).toHaveLength(1);
		expect(info.examples[0].language).toBe('typescript');
	});
});
