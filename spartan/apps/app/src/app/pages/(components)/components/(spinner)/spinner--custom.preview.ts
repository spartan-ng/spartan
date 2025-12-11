import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-custom-preview',
	imports: [HlmSpinnerImports],
	providers: [provideIcons({ lucideLoader })],
	template: `
		<div class="flex items-center">
			<hlm-spinner icon="lucideLoader" />
		</div>
	`,
})
export class SpartanSpinnerCustomPreview {}
