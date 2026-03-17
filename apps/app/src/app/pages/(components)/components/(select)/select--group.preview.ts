import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-group-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select>
			<hlm-select-trigger class="w-56">
				<hlm-select-value placeholder="Select a fruit" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-group>
					<hlm-select-label>Fruits</hlm-select-label>
					@for (fruit of fruits; track fruit.value) {
						<hlm-select-item [value]="fruit">{{ fruit.label }}</hlm-select-item>
					}
				</hlm-select-group>
				<hlm-select-separator />
				<hlm-select-group>
					<hlm-select-label>Vegetables</hlm-select-label>
					@for (vegetable of vegetables; track vegetable.value) {
						<hlm-select-item [value]="vegetable">{{ vegetable.label }}</hlm-select-item>
					}
				</hlm-select-group>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectGroupPreview {
	public readonly fruits = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple' },
	];
	public readonly vegetables = [
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];
}
