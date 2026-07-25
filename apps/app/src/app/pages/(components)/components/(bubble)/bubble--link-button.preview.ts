import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';

@Component({
	selector: 'spartan-bubble-link-button-preview',
	imports: [HlmBubbleImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-8 py-12',
	},
	template: `
		<div hlmBubble variant="muted">
			<div hlmBubbleContent>How can I help you today?</div>
		</div>
		<div hlmBubbleGroup>
			<div hlmBubble variant="tinted" align="end">
				<button hlmBubbleContent type="button" (click)="onForgot()">I forgot my password</button>
			</div>
			<div hlmBubble variant="tinted" align="end">
				<button hlmBubbleContent type="button" (click)="onSubscription()">I need help with my subscription</button>
			</div>
			<div hlmBubble variant="tinted" align="end">
				<button hlmBubbleContent type="button" (click)="onOther()">Something else. Talk to a human.</button>
			</div>
		</div>
	`,
})
export class BubbleLinkButtonPreview {
	protected onForgot(): void {
		toast('You clicked forgot password');
	}

	protected onSubscription(): void {
		toast('You clicked help with subscription');
	}

	protected onOther(): void {
		toast('You clicked something else. Talk to a human.');
	}
}
