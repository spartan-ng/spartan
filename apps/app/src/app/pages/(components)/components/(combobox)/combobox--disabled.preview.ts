import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
	selector: 'spartan-combobox-disabled-preview',
	imports: [HlmComboboxImports, BrnPopoverContent],
	template: `
		<hlm-combobox disabled>
			<hlm-combobox-input placeholder="Select a framework" showClear></hlm-combobox-input>
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxDisabledPreview {
	frameworks = ['Analog', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
}
