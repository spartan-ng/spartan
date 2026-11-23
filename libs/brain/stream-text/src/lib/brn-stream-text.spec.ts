import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { render } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
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
});
