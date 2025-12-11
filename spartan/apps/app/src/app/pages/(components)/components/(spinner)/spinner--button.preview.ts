import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-button-preview',
	imports: [HlmSpinnerImports, HlmButtonImports],
	template: `
		<div class="flex flex-col items-center gap-4">
			<button hlmBtn size="sm" disabled>
				<hlm-spinner />
				Loading...
			</button>
			<button hlmBtn variant="outline" size="sm" disabled>
				<hlm-spinner />
				Please wait
			</button>
			<button hlmBtn variant="secondary" size="sm" disabled>
				<hlm-spinner />
				Processing
			</button>
		</div>
	`,
})
export class SpartanSpinnerButtonPreview {}
