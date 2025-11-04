import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader, lucideLoader2 } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-spinner-preview',
	imports: [HlmInputGroupImports, NgIcon, HlmIconImports],
	providers: [provideIcons({ lucideLoader, lucideLoader2 })],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Searching..." disabled />
			<div hlmInputGroupAddon align="inline-end">
				<ng-icon name="lucideLoader2" class="animate-spin" />
			</div>
		</div>

		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Processing..." disabled />
			<div hlmInputGroupAddon>
				<ng-icon name="lucideLoader2" class="animate-spin" />
			</div>
		</div>

		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Saving changes..." disabled />
			<div hlmInputGroupAddon align="inline-end">
				<span hlmInputGroupText>Saving...</span>
				<ng-icon name="lucideLoader2" class="animate-spin" />
			</div>
		</div>

		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Refreshing data..." disabled />

			<div hlmInputGroupAddon>
				<ng-icon name="lucideLoader" class="animate-spin" />
			</div>

			<div hlmInputGroupAddon align="inline-end">
				<span hlmInputGroupText class="text-muted-foreground">Please wait...</span>
			</div>
		</div>
	`,
})
export class InputGroupSpinnerPreview {}
