import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Page } from '../../shared/layout/page';

@Component({
	selector: 'spartan-forms',
	imports: [Page],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: '[--stable-height:78.75px]',
	},
	template: `
		<spartan-page />
	`,
})
export default class FormsPage {}
