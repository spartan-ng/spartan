import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';

@Component({
	selector: 'spartan-bubble-alignment-preview',
	imports: [HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmBubble variant="muted">
			<div hlmBubbleContent>This bubble is aligned to the start. This is the default alignment.</div>
		</div>
		<div hlmBubble align="end">
			<div hlmBubbleContent>This bubble is aligned to the end. Use this for user messages.</div>
		</div>
	`,
})
export class BubbleAlignmentPreview {}
