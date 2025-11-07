import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { SidebarPreview } from '@spartan-ng/app/app/shared/sidebar-preview/sidebar-preview';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/examples - Sidebar', 'An sidebar example using spartan UI primitive'),
	title: 'spartan/examples - Sidebar',
};

@Component({
	selector: 'spartan-sidebar',
	imports: [SidebarPreview],
	template: `
		<spartan-sidebar-preview name="sidebar-sticky-header" />
	`,
	host: {
		class: 'block [--header-height:--spacing(14)]',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SidebarPage {}
