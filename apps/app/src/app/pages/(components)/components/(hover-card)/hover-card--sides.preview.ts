import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';

@Component({
	selector: 'spartan-hover-card-sides-preview',
	imports: [HlmHoverCardImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-wrap justify-center gap-2">
			@for (side of _sides; track side) {
				<hlm-hover-card>
					<button
						hlmBtn
						variant="outline"
						class="capitalize"
						hlmHoverCardTrigger
						[align]="side"
						showDelay="100"
						hideDelay="100"
					>
						{{ side }}
					</button>
					<hlm-hover-card-content *hlmHoverCardPortal>
						<div class="flex flex-col gap-1">
							<h4 class="font-medium">Hover Card</h4>
							<p>This hover card appears on the {{ side }} side of the trigger.</p>
						</div>
					</hlm-hover-card-content>
				</hlm-hover-card>
			}
		</div>
	`,
})
export class HoverCardSidesPreview {
	protected readonly _sides = ['left', 'top', 'bottom', 'right'] as const;
}
