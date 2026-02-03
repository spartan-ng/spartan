import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-combobox-disabled-preview',
	imports: [HlmComboboxImports, HlmPopoverImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-combobox disabled>
			<hlm-combobox-input placeholder="Select a framework" showClear />
			<div *hlmPopoverPortal hlmComboboxContent>
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
export class ComboboxDisabledPreview {
	public frameworks = ['Analog', 'Angular', 'Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
}
