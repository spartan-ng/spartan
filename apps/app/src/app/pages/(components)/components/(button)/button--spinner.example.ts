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
		<div class="flex gap-2">
			<button hlmBtn variant="outline" disabled>
				<hlm-spinner />
				Generating
			</button>

			<button hlmBtn variant="secondary" disabled>
				Downloading
				<hlm-spinner />
			</button>
		</div>
	`,
})
export class ButtonSpinner {}
