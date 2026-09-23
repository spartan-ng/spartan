import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-select-all-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select-multiple>
			<hlm-select-trigger class="w-56">
				<hlm-select-placeholder>Select fruits</hlm-select-placeholder>
				<ng-template hlmSelectValues let-values>
					<hlm-select-values-content>
						{{ values[0].label }}
						@if (values.length > 1) {
							(+{{ values.length - 1 }} more)
						}
					</hlm-select-values-content>
				</ng-template>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-all>Select all</hlm-select-all>
				<hlm-select-group>
					<hlm-select-label>Fruits</hlm-select-label>
					@for (item of items; track item.value) {
						<hlm-select-item [value]="item" [disabled]="item.disabled">{{ item.label }}</hlm-select-item>
					}
				</hlm-select-group>
			</hlm-select-content>
		</hlm-select-multiple>
	`,
})
export class SelectSelectAllPreview {
	public readonly items: { label: string; value: string; disabled?: boolean }[] = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple', disabled: true },
	];
}
