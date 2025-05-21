import { Component } from '@angular/core';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-preview',
	imports: [HlmSpinnerComponent],
	template: `
		<hlm-spinner />
	`,
})
export class SpinnerPreviewComponent {}

export const defaultCode = `import { Component } from '@angular/core';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-preview',
	standalone: true,
	imports: [ HlmSpinnerComponent],
	template: \`
    <hlm-spinner />
	\`,
})
export class SpinnerPreviewComponent {}
`;

export const defaultImports = `
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
`;
export const defaultSkeleton = `
<hlm-spinner />
`;
