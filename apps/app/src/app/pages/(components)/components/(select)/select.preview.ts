import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select [itemToString]="itemToString">
			<hlm-select-trigger class="w-56">
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
	`,
})
export class SelectPreview {
	items = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple' },
	];

	itemToString = (value: string) => this.items.find((item) => item.value === value)?.label || '';
}

export const defaultImports = `
import { HlmSelectImports } from '@spartan-ng/helm/select';
`;

export const defaultSkeleton = `
<hlm-select>
	<hlm-select-trigger>
		<hlm-select-value placeholder="Select a fruit" />
	</hlm-select-trigger>
	<hlm-select-content *hlmSelectPortal>
		<hlm-select-group>
			<hlm-select-label>Fruits</hlm-select-label>
			<hlm-option value="Refresh">Refresh</hlm-option>
			<hlm-option value="Settings">Settings</hlm-option>
			<hlm-option value="Help">Help</hlm-option>
			<hlm-option value="Signout">Sign out</hlm-option>
		</hlm-select-group>
	</hlm-select-content>
</hlm-select>
`;

export const defaultStyles = `
@import '@angular/cdk/overlay-prebuilt.css';
`;
