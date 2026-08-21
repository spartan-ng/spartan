import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnMessageScrollerItem } from '@spartan-ng/brain/message-scroller';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { classes } from '@spartan-ng/helm/utils';
import { splitParagraphs } from './message-scroller.shared';

@Component({
	selector: 'spartan-message-scroller-transcript-row',
	imports: [HlmMessageImports, HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnMessageScrollerItem,
			inputs: ['messageId', 'scrollAnchor'],
		},
	],
	host: {
		'data-slot': 'message-scroller-item',
	},
	template: `
		<div hlmMessage [align]="_isUser() ? 'end' : 'start'">
			<div hlmMessageContent>
				<div hlmBubble [variant]="_bubbleVariant()">
					<div hlmBubbleContent [class]="contentClass()">
						@for (paragraph of _paragraphs(); track $index) {
							<p class="whitespace-pre-wrap">{{ paragraph }}</p>
						}
					</div>
				</div>
			</div>
		</div>
	`,
})
export class MessageScrollerTranscriptRow {
	public readonly messageId = input.required<string>();
	public readonly role = input.required<'user' | 'assistant'>();
	public readonly text = input.required<string>();
	public readonly scrollAnchor = input(false);
	public readonly userVariant = input<
		'default' | 'muted' | 'ghost' | 'secondary' | 'outline' | 'destructive' | 'tinted'
	>('muted');
	public readonly assistantVariant = input<
		'default' | 'muted' | 'ghost' | 'secondary' | 'outline' | 'destructive' | 'tinted'
	>('ghost');
	public readonly contentClass = input('space-y-2');
	public readonly animationClass = input('');

	protected readonly _isUser = computed(() => this.role() === 'user');
	protected readonly _paragraphs = computed(() => splitParagraphs(this.text()));
	protected readonly _bubbleVariant = computed(() => (this._isUser() ? this.userVariant() : this.assistantVariant()));

	constructor() {
		classes(() => ['spartan-message-scroller-item', 'block', this.animationClass()].filter((value) => Boolean(value)));
	}
}
