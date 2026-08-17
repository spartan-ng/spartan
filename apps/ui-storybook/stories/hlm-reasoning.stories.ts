import { Component, OnDestroy, computed, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmReasoningImports } from '@spartan-ng/helm/reasoning';
import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
	title: 'AI Elements/Reasoning',
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const REASONING_PARAGRAPHS = [
	'Let me think about this problem step by step.',
	'First, I need to understand what the user is asking for.',
	'They want a reasoning component that opens automatically when streaming begins and closes when ' +
		'streaming finishes. The component should be composable and follow existing patterns in the codebase.',
	'This seems like a collapsible component with state management would be the right approach.',
];
const REASONING_TEXT = REASONING_PARAGRAPHS.join('\n\n');

const STREAM_CHUNK_SIZE = 3;
const STREAM_INTERVAL_MS = 30;

@Component({
	selector: 'spartan-reasoning-demo',
	imports: [HlmButtonImports, HlmReasoningImports],
	template: `
		<div class="max-w-lg p-4">
			<hlm-reasoning [isStreaming]="_isStreaming()">
				<button hlmReasoningTrigger></button>
				<div hlmReasoningContent>
					@for (paragraph of _paragraphs(); track $index) {
						<p class="mb-3 last:mb-0">{{ paragraph }}</p>
					}
				</div>
			</hlm-reasoning>
			<button hlmBtn variant="outline" size="sm" class="mt-4" type="button" (click)="reload()">Reload</button>
		</div>
	`,
})
class ReasoningDemo implements OnDestroy {
	protected readonly _isStreaming = signal(false);
	protected readonly _text = signal('');
	protected readonly _paragraphs = computed(() => this._text().split('\n\n'));

	private _timer?: ReturnType<typeof setInterval>;

	constructor() {
		this.reload();
	}

	ngOnDestroy(): void {
		clearInterval(this._timer);
	}

	protected reload(): void {
		clearInterval(this._timer);
		this._text.set('');
		this._isStreaming.set(true);

		let charIndex = 0;
		this._timer = setInterval(() => {
			charIndex += STREAM_CHUNK_SIZE;
			this._text.set(REASONING_TEXT.slice(0, charIndex));

			if (charIndex >= REASONING_TEXT.length) {
				clearInterval(this._timer);
				this._isStreaming.set(false);
			}
		}, STREAM_INTERVAL_MS);
	}
}

export const Default: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [ReasoningDemo],
		},
		template: `<spartan-reasoning-demo />`,
	}),
};
