import { Component } from '@angular/core';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-combobox-autohighlight-preview',
	imports: [HlmComboboxImports, HlmPopoverImports],
	template: `
		<hlm-combobox autoHighlight>
			<hlm-combobox-input placeholder="Select a framework" />
			<div *hlmPopoverPortal hlmComboboxContent>
				<hlm-combobox-empty>No items found.</hlm-combobox-empty>
				<div hlmComboboxList>
					@for (framework of frameworks; track $index) {
						<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
					}
				</div>
			</div>
		</hlm-combobox>
	`,
})
export class ComboboxAutoHighlightPreview {
	public frameworks = [
		{
			label: 'AnalogJs',
			value: 'analogjs',
		},
		{
			label: 'Angular',
			value: 'angular',
		},
		{
			label: 'Vue',
			value: 'vue',
		},
		{
			label: 'Nuxt',
			value: 'nuxt',
		},
		{
			label: 'React',
			value: 'react',
		},
		{
			label: 'NextJs',
			value: 'nextjs',
		},
	];
}
