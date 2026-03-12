import { Component } from '@angular/core';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-action',
	imports: [HlmAlertImports, HlmButtonImports],
	template: `
		<hlm-alert class="max-w-md">
			<h4 hlmAlertTitle>Dark mode is now available</h4>
			<p hlmAlertDescription>Enable it under your profile settings to get started.</p>
			<div hlmAlertAction>
				<button hlmBtn size="xs">Enable</button>
			</div>
		</hlm-alert>
	`,
})
export class AlertAction {}
