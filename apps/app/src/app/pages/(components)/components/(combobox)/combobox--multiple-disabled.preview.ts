import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-combobox-multiple-disabled-preview',
	imports: [HlmComboboxImports, BrnPopoverContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox-multiple [(value)]="values" disabled>
			<hlm-combobox-chips class="max-w-xs">
				<ng-template hlmComboboxValues let-values>
					@for (value of values; track $index) {
						<hlm-combobox-chip [value]="value">{{ value }}</hlm-combobox-chip>
					}
				</ng-template>

				<input hlmComboboxChipInput />
			</hlm-combobox-chips>
			<div *brnPopoverContent hlmComboboxContent>
				<hlm-combobox-empty>No items found.</hlm-combobox-empty>
				<div hlmComboboxList>
					@for (framework of frameworks; track $index) {
						<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
					}
				</div>
			</div>
		</hlm-combobox-multiple>
	`,
})
export class ComboboxMultipleDisabledPreview {
	public values = signal(['Analog', 'Astro']);

	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
}
