import { Component } from '@angular/core';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-color-preview',
	imports: [HlmSpinnerImports],
	template: `
		<div class="flex items-center gap-6">
			<hlm-spinner class="text-2xl text-red-500" />
			<hlm-spinner class="text-2xl text-green-500" />
			<hlm-spinner class="text-2xl text-blue-500" />
			<hlm-spinner class="text-2xl text-yellow-500" />
			<hlm-spinner class="text-2xl text-purple-500" />
		</div>
	`,
})
export class SpartanSpinnerColorPreview {}
