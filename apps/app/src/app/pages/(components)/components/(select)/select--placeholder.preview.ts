import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCitrus } from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-placeholder-preview',
	imports: [HlmSelectImports, NgIcon],
	providers: [provideIcons({ lucideCitrus })],
	template: `
		<hlm-select>
			<hlm-select-trigger class="w-56">
				<hlm-select-placeholder>
					<ng-icon name="lucideCitrus" />
					Select a fruit
				</hlm-select-placeholder>
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-group>
					<hlm-select-label>Fruits</hlm-select-label>
					@for (fruit of fruits; track fruit.value) {
						<hlm-select-item [value]="fruit">{{ fruit.label }}</hlm-select-item>
					}
				</hlm-select-group>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectPlaceholderPreview {
	public readonly fruits = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple' },
	];
}
