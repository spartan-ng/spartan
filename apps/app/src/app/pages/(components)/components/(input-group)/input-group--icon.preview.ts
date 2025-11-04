import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCreditCard, lucideInfo, lucideMail, lucideSearch, lucideStar } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-icon-preview',
	imports: [HlmInputGroupImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideSearch, lucideMail, lucideCheck, lucideCreditCard, lucideStar, lucideInfo })],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Search..." />
			<div hlmInputGroupAddon>
				<ng-icon name="lucideSearch" />
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput type="email" placeholder="Enter your email" />
			<div hlmInputGroupAddon>
				<ng-icon name="lucideMail" />
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Card number" />
			<div hlmInputGroupAddon>
				<ng-icon name="lucideCreditCard" />
			</div>
			<div hlmInputGroupAddon align="inline-end">
				<ng-icon name="lucideCheck" />
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Card number" />
			<div hlmInputGroupAddon align="inline-end">
				<ng-icon name="lucideStar" />
				<ng-icon name="lucideInfo" />
			</div>
		</div>
	`,
})
export class InputGroupIconPreview {}
