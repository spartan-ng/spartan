import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-button-spinner',
	imports: [HlmButtonImports, HlmSpinnerImports],
	host: {
		class: 'flex gap-2',
	},
	template: `
		<button hlmBtn variant="outline" disabled>
			<hlm-spinner data-icon="inline-start" />
			Generating
		</button>
		<button hlmBtn variant="secondary" disabled>
			Downloading
			<hlm-spinner data-icon="inline-start" />
		</button>
	`,
})
export class ButtonSpinner {}
