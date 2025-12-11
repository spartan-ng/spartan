import { Component } from '@angular/core';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-size-preview',
	imports: [HlmSpinnerImports],
	template: `
		<div class="flex items-center gap-6">
			<hlm-spinner class="text-xs" />
			<hlm-spinner class="text-base" />
			<hlm-spinner class="text-2xl" />
			<hlm-spinner class="text-[2rem]" />
		</div>
	`,
})
export class SpartanSpinnerSizePreview {}
