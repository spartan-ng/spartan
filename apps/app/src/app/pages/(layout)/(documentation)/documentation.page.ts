import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Page } from '@spartan-ng/app/app/shared/layout/page';

export const routeMeta: RouteMeta = {
	data: {
		breadcrumb: 'Docs',
	},
};
@Component({
	selector: 'spartan-documentation',
	imports: [Page],
	template: `
		<spartan-page />
	`,
})
export default class ExamplesPage {}
