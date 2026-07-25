import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-bubble-reactions-preview',
	imports: [HlmBubbleImports, HlmButton],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-12 py-12',
	},
	template: `
		<div hlmBubble variant="muted" align="end">
			<div hlmBubbleContent>I don't need tests, I know my code works.</div>
			<div hlmBubbleReactions align="start" role="img" aria-label="Reactions: thumbs up, surprised">
				<span>👍</span>
				<span>😮</span>
			</div>
		</div>
		<div hlmBubble variant="muted">
			<div hlmBubbleContent>Bold. Fine I'll add some tests. I'll let you know when they're done.</div>
			<div hlmBubbleReactions role="img" aria-label="Reactions: eyes, rocket, and 2 more">
				<span>👀</span>
				<span>🚀</span>
				<span>+2</span>
			</div>
		</div>
		<div hlmBubble variant="default" align="end">
			<div hlmBubbleContent>Tests passed on the first try. All 142 of them. Looking good!</div>
			<div hlmBubbleReactions side="top" align="start" role="img" aria-label="Reactions: party popper, clapping hands">
				<span>🎉</span>
				<span>👏</span>
			</div>
		</div>
		<div hlmBubble variant="destructive">
			<div hlmBubbleContent>Are you sure I can run this command?</div>
			<div hlmBubbleReactions>
				<button hlmBtn variant="ghost" size="xs" (click)="onYes()">Yes, run it</button>
			</div>
		</div>
	`,
})
export class BubbleReactionsPreview {
	protected onYes(): void {
		toast.success('You clicked yes, running command...');
	}
}
