import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-input-group-spinner-preview',
	imports: [HlmInputGroupImports, NgIcon, HlmIconImports, HlmSpinnerImports],
	providers: [provideIcons({ lucideLoader })],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Searching..." disabled />
			<div hlmInputGroupAddon align="inline-end">
				<hlm-spinner />
			</div>
		</div>

		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Processing..." disabled />
			<div hlmInputGroupAddon>
				<hlm-spinner />
			</div>
		</div>

		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Saving changes..." disabled />
			<div hlmInputGroupAddon align="inline-end">
				<span hlmInputGroupText>Saving...</span>
				<hlm-spinner />
			</div>
		</div>

		<div hlmInputGroup data-disabled="true">
			<input hlmInputGroupInput placeholder="Refreshing data..." disabled />

			<div hlmInputGroupAddon>
				<ng-icon name="lucideLoader" class="motion-safe:animate-spin" />
			</div>

			<div hlmInputGroupAddon align="inline-end">
				<span hlmInputGroupText class="text-muted-foreground">Please wait...</span>
			</div>
		</div>
	`,
})
export class InputGroupSpinnerPreview {}
