import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-combobox-clear-preview',
	imports: [HlmComboboxImports, BrnPopoverContent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox>
			<hlm-combobox-input placeholder="Select a framework" showClear />
			<div *brnPopoverContent hlmComboboxContent>
				<hlm-combobox-empty>No items found.</hlm-combobox-empty>
				<div hlmComboboxList>
					@for (framework of frameworks; track $index) {
						<hlm-combobox-item [value]="framework">{{ framework }}</hlm-combobox-item>
					}
				</div>
			</div>
		</hlm-combobox>
	`,
})
export class ComboboxClearPreview {
	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
}
