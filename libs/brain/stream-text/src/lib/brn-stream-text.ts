import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { balanceMarkdown } from './balance-markdown';

@Directive({
	selector: '[brnStreamText],brn-stream-text',
	exportAs: 'brnStreamText',
	host: {
		'data-slot': 'stream-text',
		'[attr.data-streaming]': 'streaming() ? "" : null',
		'[textContent]': 'effectiveContent()',
	},
})
export class BrnStreamText {
	/** Raw text stream content. */
	public readonly content = input.required<string>();

	/** Whether active token streaming is in progress. */
	public readonly streaming = input(false, { transform: booleanAttribute });

	/** Whether to automatically balance unclosed Markdown tokens during streaming. */
	public readonly autoBalance = input(true, { transform: booleanAttribute });

	/** Stabilized content with balanced tokens during streaming. */
	public readonly effectiveContent = computed(() => {
		const raw = this.content();
		if (!this.streaming() || !this.autoBalance()) {
			return raw;
		}
		return balanceMarkdown(raw);
	});
}
