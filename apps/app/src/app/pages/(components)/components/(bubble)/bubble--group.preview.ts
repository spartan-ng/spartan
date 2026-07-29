import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';

@Component({
	selector: 'spartan-bubble-group-preview',
	imports: [HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmBubble variant="muted">
			<div hlmBubbleContent>Can you tell me what's the issue?</div>
		</div>
		<div hlmBubbleGroup>
			<div hlmBubble align="end">
				<div hlmBubbleContent>You tell me!</div>
			</div>
			<div hlmBubble align="end">
				<div hlmBubbleContent>It worked yesterday. You broke it!</div>
			</div>
			<div hlmBubble align="end">
				<div hlmBubbleContent>Find the bug and fix it.</div>
				<div hlmBubbleReactions role="img" aria-label="Reactions: eyes" align="start">
					<span>👀</span>
				</div>
			</div>
		</div>
		<div hlmBubble variant="muted">
			<div hlmBubbleContent>Want me to diff yesterday's you against today's you? It's a bit embarrassing.</div>
		</div>
	`,
})
export class BubbleGroupPreview {}
