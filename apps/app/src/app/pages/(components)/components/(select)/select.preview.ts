import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-select-preview',
	imports: [HlmSelectImports],
	template: `
		<hlm-select class="inline-block" placeholder="Select an option">
			<hlm-select-trigger class="w-56">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content>
				<hlm-option value="Refresh">Refresh</hlm-option>
				<hlm-option value="Settings">Settings</hlm-option>
				<hlm-option value="Help">Help</hlm-option>
				<hlm-option value="Signout">Sign out</hlm-option>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class SelectPreview {}

export const defaultImports = `
import { Component } from '@angular/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';
`;

export const defaultSkeleton = `
<hlm-select class="inline-block" placeholder="Select an option">
	<hlm-select-trigger class="w-56">
		<hlm-select-value />
	</hlm-select-trigger>
	<hlm-select-content>
		<hlm-option value="Refresh">Refresh</hlm-option>
		<hlm-option value="Settings">Settings</hlm-option>
		<hlm-option value="Help">Help</hlm-option>
		<hlm-option value="Signout">Sign out</hlm-option>
	</hlm-select-content>
</hlm-select>
`;

export const defaultStyles = `
@import '@angular/cdk/overlay-prebuilt.css';
`;
