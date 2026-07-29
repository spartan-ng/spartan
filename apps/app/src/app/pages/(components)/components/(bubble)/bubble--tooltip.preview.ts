import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-bubble-tooltip-preview',
	imports: [HlmBubbleImports, HlmTooltipImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideCheck })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-sm flex-col gap-4 py-12',
	},
	template: `
		<div hlmBubble variant="secondary">
			<div hlmBubbleContent>Did you remove the stale route?</div>
		</div>
		<div hlmBubble align="end">
			<div hlmBubbleContent>Yes, removed it from the registry.</div>
			<div hlmBubbleReactions>
				<button hlmTooltip="Read on Jan 5, 2026 at 4:32 PM" hlmBtn variant="ghost" size="icon-xs">
					<ng-icon name="lucideCheck" />
				</button>
			</div>
		</div>
	`,
})
export class BubbleTooltipPreview {}
