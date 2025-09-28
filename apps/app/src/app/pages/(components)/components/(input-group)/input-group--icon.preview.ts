import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideSend } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-icon-preview',
	imports: [HlmInputGroupImports, HlmIcon, NgIcon],
	providers: [provideIcons({ lucideSend, lucideMail })],
	template: `
		<div class="flex flex-col gap-4">
			<hlm-input-group>
				<hlm-prefix><ng-icon hlm name="lucideMail" /></hlm-prefix>
				<input hlmInput />
				<hlm-suffix><ng-icon hlm name="lucideSend" /></hlm-suffix>
			</hlm-input-group>
			<hlm-input-group>
				<hlm-prefix-addon><ng-icon hlm name="lucideMail" /></hlm-prefix-addon>
				<input hlmInput />
				<hlm-suffix-addon><ng-icon hlm name="lucideSend" /></hlm-suffix-addon>
			</hlm-input-group>
		</div>
	`,
})
export class InputGroupIconPreview {}
