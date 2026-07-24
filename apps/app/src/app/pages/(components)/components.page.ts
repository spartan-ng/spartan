import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Page } from '../../shared/layout/page';
import { metaWith } from '../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/ui - Components',
		'spartan/ui provides unstyled components that are accessible by default. It also gives you beautiful shadcn-like styling options.',
	),
	data: {
		breadcrumb: 'Components',
	},
	title: 'spartan/ui - Components',
};

@Component({
	selector: 'spartan-components',
	imports: [Page],
	host: {
		class: '[--stable-height:78.75px]',
	},
	template: `
		<spartan-page />
	`,
})
export default class ComponentsPage {}
