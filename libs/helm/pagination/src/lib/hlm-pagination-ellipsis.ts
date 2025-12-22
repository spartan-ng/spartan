import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-pagination-ellipsis',
	imports: [HlmIconImports],
	providers: [provideIcons({ lucideEllipsis })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'pagination-ellipsis',
	},
	template: `
		<span aria-hidden="true">
			<ng-icon hlm size="sm" name="lucideEllipsis" />
			<span class="sr-only">{{ srOnlyText() }}</span>
		</span>
	`,
})
export class HlmPaginationEllipsis {
	constructor() {
		classes(() => 'flex size-9 items-center justify-center');
	}

	/** Screen reader only text for the ellipsis */
	public readonly srOnlyText = input<string>('More pages');
}
