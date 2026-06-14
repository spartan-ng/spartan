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
		<spartan-block-viewer block="sidebar-01" title="Simple sidebar with version switcher" id="sidebar-1">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A simple sidebar with a version switcher, search form, and grouped navigation links. Uses
				<code class="${hlmCode}">SidebarRail</code>
				for quick collapse.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-02" title="Collapsible sidebar groups" id="sidebar-2">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Sidebar with collapsible groups using
				<code class="${hlmCode}">hlm-collapsible</code>
				and a chevron toggle for each navigation section.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-03" title="Branded header with flat navigation" id="sidebar-3">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Sidebar with a branded header showing app name and version, flat grouped navigation with sub-items using
				<code class="${hlmCode}">hlm-sidebar-menu-sub</code>
				.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-04" title="Floating variant sidebar" id="sidebar-4">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Demonstrates the
				<code class="${hlmCode}">variant="floating"</code>
				option which renders the sidebar with a floating card appearance.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-05" title="Collapsible groups with Plus/Minus icons" id="sidebar-5">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Sidebar with branded header, search form, and collapsible groups using Plus/Minus icons instead of chevrons.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-06" title="Dropdown navigation with opt-in form" id="sidebar-6">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Sidebar with dropdown menu navigation items and a newsletter opt-in form in the footer.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-07" title="Icon collapse with team switcher" id="sidebar-7">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Demonstrates
				<code class="${hlmCode}">collapsible="icon"</code>
				for icon-only collapse, with TeamSwitcher, collapsible nav, projects, and user dropdown.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-sticky-header" title="A sidebar with a sticky header" id="sidebar-8">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Setup a CSS variable for the header height by adding
				<code class="${hlmCode}">[--header-height:--spacing(14)]</code>
				to the body or page container and use
				<code class="${hlmCode}">h-(--header-height)</code>
				to set the height of your header.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-inset" title="An inset sidebar with secondary navigation" id="sidebar-9">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Use the
				<code class="${hlmCode}">inset</code>
				variant on
				<code class="${hlmCode}">hlm-sidebar</code>
				and the
				<code class="${hlmCode}">hlmSidebarInset</code>
				directive on your
				<code class="${hlmCode}">main</code>
				element to create an inset sidebar layout.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-09" title="Dual sidebar mail client" id="sidebar-10">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A complex dual-sidebar layout with icon-only navigation and a mail list. Demonstrates nested sidebars with
				different collapsible modes.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-10" title="Notion-like workspace sidebar" id="sidebar-11">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				A Notion-inspired sidebar with TeamSwitcher, flat navigation, favorites, collapsible workspaces, and secondary
				links.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-11" title="File tree sidebar" id="sidebar-12">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Sidebar displaying a file tree with collapsible folders and file state badges. Great for code editors or file
				browsers.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-12" title="Calendar sidebar" id="sidebar-13">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Sidebar with an inline calendar date picker, checkbox-based calendar groups, and user avatar dropdown. Perfect
				for calendar apps.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-14" title="Right-side table of contents" id="sidebar-14">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Demonstrates
				<code class="${hlmCode}">side="right"</code>
				for a right-aligned sidebar used as a table of contents with
				<code class="${hlmCode}">SidebarRail</code>
				.
			</p>
		</spartan-block-viewer>

		<spartan-block-viewer block="sidebar-15" title="Dual sidebar: workspace + calendar" id="sidebar-15">
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				Most complex layout combining a Notion-like workspace sidebar on the left with a calendar sidebar on the right.
			</p>
		</spartan-block-viewer>
	`,
})
export default class SidebarPage {}
