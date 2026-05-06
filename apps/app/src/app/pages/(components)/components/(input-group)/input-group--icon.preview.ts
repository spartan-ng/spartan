import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCreditCard, lucideInfo, lucideMail, lucideSearch, lucideStar } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-icon-preview',
	imports: [HlmInputGroupImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideSearch, lucideMail, lucideCheck, lucideCreditCard, lucideStar, lucideInfo })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Search..." />
			<hlm-input-group-addon>
				<ng-icon name="lucideSearch" />
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<input hlmInputGroupInput type="email" placeholder="Enter your email" />
			<hlm-input-group-addon>
				<ng-icon name="lucideMail" />
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Card number" />
			<hlm-input-group-addon>
				<ng-icon name="lucideCreditCard" />
			</hlm-input-group-addon>
			<hlm-input-group-addon align="inline-end">
				<ng-icon name="lucideCheck" />
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Card number" />
			<hlm-input-group-addon align="inline-end">
				<ng-icon name="lucideStar" />
				<ng-icon name="lucideInfo" />
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class InputGroupIconPreview {}
