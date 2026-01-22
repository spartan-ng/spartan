import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockViewer } from '@spartan-ng/app/app/shared/blocks/block-viewer';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Sidebar', 'Sidebar blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Sidebar',
};

@Component({
	selector: 'spartan-sidebar',
	imports: [BlockViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col',
	},
	template: `
		<spartan-block-viewer block="sidebar-sticky-header" title="A sidebar with a sticky header" id="sidebar-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Setup a CSS variable for the header height by adding
				<code class="${hlmCode}">[--header-height:--spacing(14)]</code>
				to the body or page container and use
				<code class="${hlmCode}">h-(--header-height)</code>
				to set the height of your header. This variable is then used to offset the sidebar to account for the sticky
				header height.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-inset" title="An inset sidebar with secondary navigation" id="sidebar-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Use the
				<code class="${hlmCode}">inset</code>
				variant on
				<code class="${hlmCode}">hlm-sidebar</code>
				and the
				<code class="${hlmCode}">hlmSidebarInset</code>
				directive on your
				<code class="${hlmCode}">main</code>
				element to create an inset sidebar layout. Both elements must be siblings for the styles to apply correctly.
			</p>
		</spartan-block-viewer>
	`,
})
export default class SidebarPage {}
