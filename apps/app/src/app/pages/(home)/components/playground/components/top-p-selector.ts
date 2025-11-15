import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-top-p-selector',
	imports: [HlmSliderImports, HlmLabel],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'grid gap-3',
	},
	template: `
		<div class="flex justify-between">
			<span hlmLabel>Top P</span>
			<span
				class="text-muted-foreground hover:border-border w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm"
			>
				{{ value() }}
			</span>
		</div>
		<hlm-slider [step]="0.1" [min]="0" [max]="1" [(value)]="value" class="w-full" />
	`,
})
export class TopPSelector {
	public readonly value = signal<number>(0.9);
}
