import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-empty-preview',
	imports: [HlmSpinnerImports, HlmEmptyImports, HlmButtonImports],
	template: `
		<hlm-empty>
			<hlm-empty-header>
				<hlm-empty-media variant="icon">
					<hlm-spinner />
				</hlm-empty-media>
				<div hlmEmptyTitle>Processing your request</div>
				<div hlmEmptyDescription>Please wait while we process your request. Do not refresh the page.</div>
			</hlm-empty-header>
			<hlm-empty-content>
				<button hlmBtn variant="outline" size="sm">Cancel</button>
			</hlm-empty-content>
		</hlm-empty>
	`,
})
export class SpartanSpinnerEmptyPreview {}
