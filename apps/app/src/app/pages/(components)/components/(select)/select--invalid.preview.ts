import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-invalid-preview',
	imports: [HlmSelectImports, HlmFieldImports],
	template: `
		<hlm-field forceInvalid class="w-56">
			<label hlmFieldLabel for="select-invalid">Fruit</label>
			<hlm-select>
				<hlm-select-trigger forceInvalid buttonId="select-invalid" class="w-full">
					<hlm-select-value placeholder="Select a fruit" />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						<hlm-select-label>Fruits</hlm-select-label>
						@for (item of items; track item.value) {
							<hlm-select-item [value]="item.value">{{ item.label }}</hlm-select-item>
						}
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
			<hlm-field-error>Please select a fruit.</hlm-field-error>
		</hlm-field>
	`,
})
export class SelectInvalidPreview {
	public readonly items = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple' },
	];
}
