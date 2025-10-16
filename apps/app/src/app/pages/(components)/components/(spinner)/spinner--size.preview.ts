import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-size-preview',
	imports: [HlmSpinner],
	template: `
		<div class="flex flex-col items-center gap-4">
			<hlm-spinner class="size-6" />
			<hlm-spinner class="size-8" />
			<hlm-spinner class="size-10" />
			<hlm-spinner class="size-12" />
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpartanSpinnerSizePreviewComponent {}
