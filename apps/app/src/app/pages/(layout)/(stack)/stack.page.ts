import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { PageComponent } from '@spartan-ng/app/app/shared/layout/page.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/stack - The stack', "spartan's opinionated full-stack..."),
	data: {
		breadcrumb: 'Stack',
	},
	title: 'spartan/stack - The stack',
};

@Component({
	selector: 'spartan-stack',
	imports: [PageComponent],
	template: `
		<spartan-page />
	`,
})
export default class StackPageComponent {}
