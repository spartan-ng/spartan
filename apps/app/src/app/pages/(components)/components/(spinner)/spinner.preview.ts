import { Component } from '@angular/core';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-preview',
	imports: [HlmSpinner],
	template: `
		<hlm-spinner />
	`,
})
export class SpinnerPreview {}

export const defaultImports = `
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
`;
export const defaultSkeleton = `
<hlm-spinner class="size-8 md:size-10" />
`;
