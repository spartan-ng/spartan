import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-button-spinner',
	imports: [HlmButtonImports, HlmSpinnerImports],
	providers: [provideIcons({ lucideLoaderCircle })],
	template: `
		<button hlmBtn size="sm" variant="outline" disabled>
			<hlm-spinner />
			Submit
		</button>
	`,
})
export class ButtonSpinner {}
