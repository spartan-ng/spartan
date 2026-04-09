import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: '[hlmBreadcrumbSeparator]',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'presentation',
		'aria-hidden': 'true',
	},
	template: `
		<ng-content>
			<ng-icon hlmIcon name="lucideChevronRight" />
		</ng-content>
	`,
})
export class HlmBreadcrumbSeparator {
	constructor() {
		classes(() => '[&_[hlmIcon]]:block [&_[hlmIcon]]:size-3.5');
	}
}
