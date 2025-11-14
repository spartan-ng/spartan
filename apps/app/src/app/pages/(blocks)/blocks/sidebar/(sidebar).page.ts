import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockLink } from '@spartan-ng/app/app/shared/blocks/block-link';
import { BlockPreview } from '@spartan-ng/app/app/shared/blocks/block-preview';
import { OpenInButton } from '@spartan-ng/app/app/shared/blocks/open-in-button';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Sidebar', 'Sidebar blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Sidebar',
};

@Component({
	selector: 'spartan-sidebar',
	imports: [BlockPreview, OpenInButton, BlockLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col gap-12 md:gap-24',
	},
	template: `
		<div id="sidebar-1" class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<spartan-block-link fragment="sidebar-1">A sidebar with a sticky header</spartan-block-link>
				<spartan-open-in-button block="sidebar-sticky-header" />
			</div>

			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Setup a CSS variable for the header height by adding
				<code class="${hlmCode}">[--header-height:--spacing(14)]</code>
				to the body or page container and use
				<code class="${hlmCode}">h-(--header-height)</code>
				to set the height of your header. This variable is then used to offset the sidebar to account for the sticky
				header height.
			</p>

			<spartan-block-preview name="sidebar-sticky-header" />
		</div>
		<div id="sidebar-2" class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<spartan-block-link fragment="sidebar-2">An inset sidebar with secondary navigation</spartan-block-link>
				<spartan-open-in-button block="sidebar-inset" />
			</div>

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

			<spartan-block-preview name="sidebar-inset" />
		</div>
	`,
})
export default class SidebarPage {}
