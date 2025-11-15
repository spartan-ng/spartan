import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-empty',
	imports: [HlmEmptyImports, HlmButton, HlmSpinner],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmEmpty class="w-full border md:p-6">
			<div hlmEmptyHeader>
				<div hlmEmptyMedia variant="icon">
					<hlm-spinner class="size-4" />
				</div>
				<div hlmEmptyTitle>Processing your request</div>
				<div hlmEmptyDescription>Please wait while we process your request. Do not refresh the page.</div>
			</div>
			<div hlmEmptyContent>
				<button hlmBtn variant="outline" size="sm">Cancel</button>
			</div>
		</div>
	`,
})
export class SpinnerEmpty {}
