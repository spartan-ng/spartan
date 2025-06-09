import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: '[hlmBreadcrumbSeparator]',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	host: {
		role: 'presentation',
		'aria-hidden': 'true',
		class: 'size-3.5',
	},
	template: `
		<ng-content>
			<ng-icon class="flex" size="14px" name="lucideChevronRight" />
		</ng-content>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmBreadcrumbSeparatorComponent {}
