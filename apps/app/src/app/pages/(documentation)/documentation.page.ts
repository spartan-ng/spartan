import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Page } from '@spartan-ng/app/app/shared/layout/page';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: {
		breadcrumb: 'Docs',
	},
	meta: metaWith('spartan - Documentation', 'Learn how to install, configure, and customize spartan/ui.'),
	title: 'spartan - Documentation',
};
@Component({
	selector: 'spartan-documentation',
	imports: [Page],
	template: `
		<spartan-page />
	`,
})
export default class ExamplesPage {}
