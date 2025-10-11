import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCreditCard, lucideInfo, lucideMail, lucideSearch, lucideStar } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-icon-preview',
	imports: [HlmInputGroupImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideSearch, lucideMail, lucideCheck, lucideCreditCard, lucideStar, lucideInfo })],
	template: `
		<div class="grid w-full max-w-sm gap-6">
			<div hlmInputGroup>
				<input hlmInputGroupInput placeholder="Search..." />
				<div hlmInputGroupAddon>
					<ng-icon hlm name="lucideSearch" />
				</div>
			</div>
			<div hlmInputGroup>
				<input hlmInputGroupInput type="email" placeholder="Enter your email" />
				<div hlmInputGroupAddon>
					<ng-icon hlm name="lucideMail" />
				</div>
			</div>
			<div hlmInputGroup>
				<input hlmInputGroupInput placeholder="Card number" />
				<div hlmInputGroupAddon>
					<ng-icon hlm name="lucideCreditCard" />
				</div>
				<div hlmInputGroupAddon align="inline-end">
					<ng-icon hlm name="lucideCheck" />
				</div>
			</div>
			<div hlmInputGroup>
				<input hlmInputGroupInput placeholder="Card number" />
				<div hlmInputGroupAddon align="inline-end">
					<ng-icon hlm name="lucideStar" />
					<ng-icon hlm name="lucideInfo" />
				</div>
			</div>
		</div>
	`,
})
export class InputGroupIconPreview {}
