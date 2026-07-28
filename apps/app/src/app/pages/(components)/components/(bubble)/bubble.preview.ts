import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';

@Component({
	selector: 'spartan-bubble-preview',
	imports: [HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmBubble align="end">
			<div hlmBubbleContent>Hey there! what's up?</div>
		</div>

		<div hlmBubbleGroup>
			<div hlmBubble variant="muted">
				<div hlmBubbleContent>Hey! Want to see chat bubbles?</div>
			</div>
			<div hlmBubble variant="muted">
				<div hlmBubbleContent>I can group messages, switch sides, and keep the whole thread easy to scan.</div>
				<div hlmBubbleReactions role="img" aria-label="Reaction: thumbs up">
					<span>👍</span>
				</div>
			</div>
		</div>

		<div hlmBubble align="end">
			<div hlmBubbleContent>Sure. Hit me with your best demo.</div>
		</div>

		<div hlmBubble variant="muted">
			<div hlmBubbleContent>Yes. You are reading a demo that is demoing itself. Very meta. Very on-brand.</div>
			<div hlmBubbleReactions role="img" aria-label="Reactions: thumbs up, fire, eyes, and 2 more">
				<span>👍</span>
				<span>🔥</span>
				<span>👀</span>
				<span>+2</span>
			</div>
		</div>
	`,
})
export class BubblePreview {}

export const defaultImports = `
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
`;

export const defaultSkeleton = `
<div hlmBubble>
  <div hlmBubbleContent>How can I help you today?</div>
</div>
`;
