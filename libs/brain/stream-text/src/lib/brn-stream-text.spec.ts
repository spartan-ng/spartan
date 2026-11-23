import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { render } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { balanceMarkdown } from './balance-markdown';
import { BrnStreamText } from './brn-stream-text';

@Component({
	imports: [BrnStreamText],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnStreamText
			#stream="brnStreamText"
			[content]="content()"
			[streaming]="streaming()"
			data-testid="stream-container"
		>
			{{ stream.effectiveContent() }}
		</div>
	`,
})
class StreamTextSpecComponent {
	public readonly content = input('Hello world');
	public readonly streaming = input(false);
}

describe('balanceMarkdown', () => {
	it('should balance unclosed code fences', () => {
		const unclosed = 'Here is code:\n```typescript\nconst a = 1;';
		expect(balanceMarkdown(unclosed)).toBe('Here is code:\n```typescript\nconst a = 1;\n```');
	});

	it('should balance unclosed inline code backticks', () => {
		const unclosed = 'Run `pnpm test';
		expect(balanceMarkdown(unclosed)).toBe('Run `pnpm test`');
	});

	it('should balance unclosed bold asterisks', () => {
		const unclosed = 'This is **important';
		expect(balanceMarkdown(unclosed)).toBe('This is **important**');
	});

	it('should leave already balanced markdown unchanged', () => {
		const balanced = '```typescript\nconst a = 1;\n```';
		expect(balanceMarkdown(balanced)).toBe(balanced);
	});
});

describe('BrnStreamText', () => {
	it('should render with data-slot and reflect streaming attribute', async () => {
		const { getByTestId } = await render(StreamTextSpecComponent, {
			componentInputs: {
				content: 'Streaming test',
				streaming: true,
			},
		});

		const el = getByTestId('stream-container');
		expect(el).not.toBeNull();
		expect(el.getAttribute('data-slot')).toBe('stream-text');
		expect(el.hasAttribute('data-streaming')).toBe(true);
	});

	it('should balance markdown tokens when streaming is true', async () => {
		const { getByTestId } = await render(StreamTextSpecComponent, {
			componentInputs: {
				content: '```ts\nconsole.log(1);',
				streaming: true,
			},
		});

		const el = getByTestId('stream-container');
		expect(el.textContent?.trim()).toBe('```ts\nconsole.log(1);\n```');
	});

	it('should return raw content when streaming is false', async () => {
		const { getByTestId } = await render(StreamTextSpecComponent, {
			componentInputs: {
				content: '```ts\nconsole.log(1);',
				streaming: false,
			},
		});

		const el = getByTestId('stream-container');
		expect(el.textContent?.trim()).toBe('```ts\nconsole.log(1);');
	});

	it('should not count bold markers inside inline code', async () => {
		const { getByTestId } = await render(StreamTextSpecComponent, {
			componentInputs: { content: 'use `a ** b` here', streaming: true },
		});

		expect(getByTestId('stream-container').textContent?.trim()).toBe('use `a ** b` here');
	});
});

@Component({
	imports: [BrnStreamText],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnStreamText
			[content]="content()"
			[streaming]="streaming()"
			[markdown]="markdown()"
			[smooth]="smooth()"
			data-testid="stream-container"
		></div>
	`,
})
class StreamTextFeaturesSpecComponent {
	public readonly content = input('Hello');
	public readonly streaming = input(false);
	public readonly markdown = input(false);
	public readonly smooth = input(false);
}

describe('BrnStreamText features', () => {
	it('should render plain text escaped when markdown is off', async () => {
		const { getByTestId } = await render(StreamTextFeaturesSpecComponent, {
			componentInputs: { content: '<b>bold</b> **x**' },
		});

		const el = getByTestId('stream-container');
		expect(el.textContent).toBe('<b>bold</b> **x**');
		expect(el.querySelector('b')).toBeNull();
	});

	it('should render markdown as HTML when markdown is on', async () => {
		const { getByTestId } = await render(StreamTextFeaturesSpecComponent, {
			componentInputs: { content: 'Hello **world** and `code`', markdown: true },
		});

		const el = getByTestId('stream-container');
		expect(el.querySelector('strong')?.textContent).toBe('world');
		expect(el.querySelector('code')?.textContent).toBe('code');
		expect(el.getAttribute('data-markdown')).toBe('');
	});

	it('should sanitize script content in markdown', async () => {
		const { getByTestId } = await render(StreamTextFeaturesSpecComponent, {
			componentInputs: {
				content: 'Hi <script>window.__x = 1</script><img src=x onerror="window.__x=1">',
				markdown: true,
			},
		});

		const el = getByTestId('stream-container');
		expect(el.querySelector('script')).toBeNull();
		expect(el.querySelector('[onerror]')).toBeNull();
	});

	it('should balance an unclosed code fence into a code block while streaming markdown', async () => {
		const { getByTestId } = await render(StreamTextFeaturesSpecComponent, {
			componentInputs: { content: 'Run:\n\n```bash\npnpm install', markdown: true, streaming: true },
		});

		expect(getByTestId('stream-container').querySelector('pre code')?.textContent).toContain('pnpm install');
	});

	it('should reveal content progressively when smooth is on and finish with the full text', async () => {
		const full = 'x'.repeat(200);
		const { getByTestId } = await render(StreamTextFeaturesSpecComponent, {
			componentInputs: { content: full, smooth: true },
		});

		const el = getByTestId('stream-container');
		expect(el.textContent?.length ?? 0).toBeLessThan(full.length);
		await vi.waitFor(() => expect(el.textContent).toBe(full), { timeout: 3000 });
	});

	it('should keep the streaming state until the smooth reveal has caught up', async () => {
		const full = 'y'.repeat(200);
		const { getByTestId } = await render(StreamTextFeaturesSpecComponent, {
			componentInputs: { content: full, smooth: true, streaming: false },
		});

		const el = getByTestId('stream-container');
		expect(el.hasAttribute('data-streaming')).toBe(true);
		await vi.waitFor(() => expect(el.hasAttribute('data-streaming')).toBe(false), { timeout: 3000 });
		expect(el.textContent).toBe(full);
	});
});
