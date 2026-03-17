import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select>
			<hlm-select-trigger class="w-56">
				<span hlmSelectValue></span>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-group>
					<div hlmSelectLabel>Fruits</div>
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
		{ label: 'Select a fruit', value: null },
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Blueberry', value: 'blueberry' },
		{ label: 'Grapes', value: 'grapes' },
		{ label: 'Pineapple', value: 'pineapple' },
	];
}

export const defaultImports = `
import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';
`;

export const defaultSkeleton = `
<hlm-select>
	<hlm-select-trigger>
		<span hlmSelectValue></span>
	</hlm-select-trigger>
	<hlm-select-content *hlmSelectPortal>
		<hlm-select-group>
			<div hlmSelectLabel>Fruits</div>
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
