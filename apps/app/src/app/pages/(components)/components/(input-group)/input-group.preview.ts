import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-preview',
	imports: [HlmInputGroupImports, HlmIcon, NgIcon],
	providers: [provideIcons({ lucideSend })],
	template: `
		<div class="flex flex-col gap-4">
			<hlm-input-group>
				<hlm-prefix>&#64;</hlm-prefix>
				<input hlmInput />
				<hlm-suffix><ng-icon hlm name="lucideSend" /></hlm-suffix>
			</hlm-input-group>
			<hlm-input-group>
				<hlm-prefix-addon>https://</hlm-prefix-addon>
				<input hlmInput />
				<hlm-suffix-addon>.com</hlm-suffix-addon>
			</hlm-input-group>
		</div>
	`,
})
export class InputGroupPreview {}

export const defaultImports = `
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
`;

export const defaultSkeleton = `
<hlm-input-group>
	<hlm-prefix>&#64;</hlm-prefix>
	<input hlmInput />
	<hlm-suffix><ng-icon hlm name="lucideSend" /></hlm-suffix>
</hlm-input-group>

<hlm-input-group>
	<hlm-prefix-addon>https://</hlm-prefix-addon>
	<input hlmInput />
	<hlm-suffix-addon>.com</hlm-suffix-addon>
</hlm-input-group>
`;
