import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { hlmCode } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-bubble-variants-preview',
	imports: [HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-12 py-12',
	},
	template: `
		<div hlmBubble>
			<div hlmBubbleContent>This is the default primary bubble.</div>
		</div>
		<div hlmBubble variant="secondary" align="end">
			<div hlmBubbleContent>This is the secondary variant.</div>
		</div>
		<div hlmBubble variant="muted">
			<div hlmBubbleContent>This one is muted. It uses a lower emphasis color for the chat bubble.</div>
			<div hlmBubbleReactions role="img" aria-label="Reaction: thumbs up">
				<span>👍</span>
			</div>
		</div>
		<div hlmBubble variant="tinted" align="end">
			<div hlmBubbleContent>This one is tinted. The tint is a softer color derived from the primary color.</div>
		</div>
		<div hlmBubble variant="outline">
			<div hlmBubbleContent>We can also use an outlined variant.</div>
		</div>
		<div hlmBubble variant="destructive" align="end">
			<div hlmBubbleContent>Or a destructive variant with a reaction.</div>
			<div hlmBubbleReactions role="img" aria-label="Reaction: fire">
				<span>🔥</span>
			</div>
		</div>
		<div hlmBubble variant="ghost">
			<div hlmBubbleContent class="space-y-4">
				<p>
					Ghost bubbles work for assistant text,
					<strong>markdown</strong>
					, and other content that should not be framed.
				</p>
				<p>
					This is perfect for assistant messages that should not have a frame and can take the full width of the
					container. You can also render
					<code class="${hlmCode}">code</code>
					in it.
				</p>
				<p>Ghost bubbles are full width and can take the full width of the container.</p>
			</div>
		</div>
	`,
})
export class BubbleVariantsPreview {}
