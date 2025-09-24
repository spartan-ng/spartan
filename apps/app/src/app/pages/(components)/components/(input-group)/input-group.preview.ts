import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { BrnInputGroupImports } from '@spartan-ng/brain/input-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-preview',
	imports: [HlmInputGroupImports, HlmIcon, NgIcon, BrnInputGroupImports],
	providers: [provideIcons({ lucideSend })],
	template: `
		<div class="flex flex-col gap-4">
			<hlm-input-group>
				<div brnPrefix>&#64;</div>
				<input hlmInput />
				<div brnSuffix><ng-icon hlm name="lucideSend" /></div>
			</hlm-input-group>

			<hlm-input-group>
				<div brnPrefixAddon>https://</div>
				<input hlmInput />
				<div brnSuffixAddon>.com</div>
			</hlm-input-group>
		</div>
	`,
})
export class InputGroupPreview {}

export const defaultImports = `
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { BrnInputGroupImports } from '@spartan-ng/brain/input-group';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
`;

export const defaultSkeleton = `
<hlm-input-group>
	<div brnPrefix>&#64;</div>
	<input hlmInput />
	<div brnSuffix><ng-icon hlm name="lucideSend" /></div>
</hlm-input-group>

<hlm-input-group>
	<div brnPrefixAddon>https://</div>
	<input hlmInput />
	<div brnSuffixAddon>.com</div>
</hlm-input-group>
`;
