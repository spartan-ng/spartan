import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-field-separator',
	imports: [HlmSeparator],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { 'data-slot': 'field-separator' },
	template: `
		<hlm-separator class="absolute inset-0 top-1/2" />
		<span
			data-slot="field-separator-content"
			class="spartan-field-separator-content bg-background relative mx-auto block w-fit"
		>
			<ng-content />
		</span>
	`,
})
export class HlmFieldSeparator {
	constructor() {
		classes(() => 'spartan-field-separator relative');
	}
}
