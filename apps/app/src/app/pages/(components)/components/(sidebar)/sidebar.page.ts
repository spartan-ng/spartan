import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNavPlaceholder } from '@spartan-ng/app/app/shared/layout/page-bottom-nav-placeholder';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmCode, HlmH3, HlmP } from '@spartan-ng/helm/typography';
import {
	content,
	cssCode,
	firstSidebar,
	firstSidebarApp,
	firstSidebarInitial,
	footer,
	group,
	header,
	provider,
	usageApp,
	usageLayout,
} from './sidebar.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'sidebar' },
	meta: metaWith('spartan/ui - sidebar', 'A composable, themeable and customizable sidebar component.'),
	title: 'spartan/ui - sidebar',
};

@Component({
	selector: 'spartan-sidebar',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		TabsCli,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		PageBottomNavPlaceholder,
		HlmP,
		HlmCode,

		HlmH3,
	],
	template: `
		<section spartanMainSection class="space-y-4">
			<spartan-section-intro name="Sidebar" lead="A composable, themeable and customizable sidebar component." />

			<div>
				<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
				<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui sidebar" ngCode="ng g @spartan-ng/cli:ui sidebar" />

				<h3 class="font-heading mt-4 scroll-m-32 text-xl font-medium tracking-tight" id="add-colors">
					Add the following colors to your CSS file
				</h3>
				<p hlmP class="mb-6">
					The command above should install the colors for you. If not, copy and paste the following in your CSS file.
					<br />
					We'll go over the colors later in the theming section.
				</p>

				<spartan-code [code]="_cssCode" />
			</div>
			<spartan-section-sub-heading id="structure">Structure</spartan-section-sub-heading>

			<div class="leading-relaxed [&:not(:first-child)]:mt-2" hlmP>
				A
				<span hlmCode>Sidebar</span>
				component is composed of the following parts:
			</div>
			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					<span hlmCode>HlmSidebarService</span>
					- Handles collapsible state.
				</li>
				<li class="mt-2">
					<span hlmCode>HlmSidebar</span>
					- The sidebar container.
				</li>
				<li class="mt-2">
					<span hlmCode>HlmSidebarHeader</span>
					and
					<span hlmCode>HlmSidebarFooter</span>
					- Sticky at the top and bottom of the sidebar.
				</li>
				<li class="mt-2">
					<span hlmCode>HlmSidebarContent</span>
					- Scrollable content.
				</li>
				<li class="mt-2">
					<span hlmCode>HlmSidebarGroup</span>
					- Section within the
					<span hlmCode>HlmSidebarContent</span>
					.
				</li>
				<li class="mt-2">
					<span hlmCode>HlmSidebarTrigger</span>
					- Trigger for the
					<span hlmCode>HlmSidebar</span>
					.
				</li>
			</ul>

			<img src="/assets/sidebar-structure.png" alt="Sidebar structure" class="border-border rounded border" />

			<div class="space-y-4">
				<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
				<spartan-code fileName="src/app/app.ts" [code]="_usageApp" />
				<spartan-code fileName="src/app/app-sidebar.ts" [code]="_usageLayout" />
			</div>

			<div class="space-y-4">
				<spartan-section-sub-heading id="first-sidebar">Your First Sidebar</spartan-section-sub-heading>

				<p hlmP>Let's start with the most basic sidebar. A collapsible sidebar with a menu.</p>

				<h3 hlmH3>
					Add a
					<span hlmCode>HlmSidebarTrigger</span>
					at the root of your application.
				</h3>
				<spartan-code fileName="src/app/app.ts" [code]="_firstSidebarApp" />
				<h3 hlmH3>
					Create a new sidebar component at
					<span hlmCode>src/app/app-sidebar.ts</span>
				</h3>

				<spartan-code fileName="src/app/app-sidebar.ts" [code]="_firstSidebarInitial" />

				<h3 hlmH3>
					Now, let's add a
					<span hlmCode>HlmSidebarMenu</span>
					to the sidebar.
				</h3>
				<p hlmP>
					We'll use the
					<span hlmCode>HlmSidebarMenu</span>
					component in a
					<span hlmCode>HlmSidebarGroup</span>
					.
				</p>
				<spartan-code fileName="src/app/app-sidebar.ts" [code]="_firstSidebar" />
				<h3 hlmH3>You've created your first sidebar.</h3>
				<p>You should see something like this:</p>
			</div>

			<spartan-section-sub-heading id="sidebar-service">SidebarService</spartan-section-sub-heading>
			<p hlmP>
				The
				<span hlmCode>HlmSidebarService</span>
				manages the state, persistence, and responsive behavior of the sidebar. It ensures the sidebar works
				consistently across devices, remembers user preferences, and provides developer APIs for customization.
			</p>

			<h3 hlmH3>Core Responsibilities</h3>
			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					<span hlmCode>State Management</span>
					– Tracks whether the sidebar is expanded or collapsed.
				</li>
				<li class="mt-2">
					<span hlmCode>Mobile Responsiveness</span>
					– Detects screen size and manages a separate mobile overlay state.
				</li>
				<li class="mt-2">
					<span hlmCode>Persistence</span>
					– Stores sidebar state in cookies for 7 days.
				</li>
				<li class="mt-2">
					<span hlmCode>Variants</span>
					– Supports
					<span hlmCode>sidebar</span>
					,
					<span hlmCode>floating</span>
					, and
					<span hlmCode>inset</span>
					display styles.
				</li>
				<li class="mt-2">
					<span hlmCode>Keyboard Shortcuts</span>
					– Toggle with
					<span hlmCode>Ctrl / ⌘ + B</span>
					.
				</li>
				<li class="mt-2">
					<span hlmCode>Cleanup</span>
					– Removes event listeners on destroy.
				</li>
			</ul>

			<h3 hlmH3>Signals & Computed</h3>
			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					<span hlmCode>open</span>
					– Whether the desktop sidebar is open.
				</li>
				<li class="mt-2">
					<span hlmCode>openMobile</span>
					– Whether the mobile sidebar is open.
				</li>
				<li class="mt-2">
					<span hlmCode>isMobile</span>
					– Whether the viewport is below 768px.
				</li>
				<li class="mt-2">
					<span hlmCode>variant</span>
					– Current sidebar style (
					<span hlmCode>sidebar</span>
					,
					<span hlmCode>floating</span>
					, or
					<span hlmCode>inset</span>
					).
				</li>
				<li class="mt-2">
					<span hlmCode>state</span>
					– Computed:
					<span hlmCode>'expanded'</span>
					or
					<span hlmCode>'collapsed'</span>
					.
				</li>
			</ul>

			<h3 hlmH3>Public API</h3>
			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					<span hlmCode>setOpen(open: boolean)</span>
					– Opens or closes the desktop sidebar (persists state in a cookie).
				</li>
				<li class="mt-2">
					<span hlmCode>setOpenMobile(open: boolean)</span>
					– Opens/closes the mobile sidebar.
				</li>
				<li class="mt-2">
					<span hlmCode>setVariant(variant)</span>
					– Sets the sidebar style.
				</li>
				<li class="mt-2">
					<span hlmCode>toggleSidebar()</span>
					– Toggles the sidebar depending on desktop/mobile mode.
				</li>
			</ul>

			<h3 hlmH3>Keyboard Shortcut</h3>
			<p hlmP>
				The
				<span hlmCode>SIDEBAR_KEYBOARD_SHORTCUT</span>
				variable defines the keyboard shortcut used to open and close the sidebar.
			</p>
			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					On macOS, use
					<span hlmCode>⌘ + B</span>
					to toggle the sidebar.
				</li>
				<li class="mt-2">
					On Windows/Linux, use
					<span hlmCode>Ctrl + B</span>
					to toggle the sidebar.
				</li>
			</ul>
			<p hlmP>
				To change the shortcut, update the value of
				<span hlmCode>SIDEBAR_KEYBOARD_SHORTCUT</span>
				in the
				<span hlmCode>HlmSidebarService</span>
				source. By default it is set to
				<span hlmCode>'b'</span>
				.
			</p>

			<spartan-section-sub-heading id="sidebar-width">Width</spartan-section-sub-heading>
			<p hlmP>
				The
				<span hlmCode>HlmSidebarWrapper</span>
				directive controls the
				<strong>width</strong>
				of the sidebar and its
				<strong>icon-only collapsed state</strong>
				. It applies styles, sets CSS variables, and ensures consistent layout across different sidebar variants.
			</p>

			<h3 hlmH3>Inputs</h3>
			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					<span hlmCode>[class]</span>
					– Pass custom classes to extend styling.
				</li>
				<li class="mt-2">
					<span hlmCode>[sidebarWidth]</span>
					– Override default sidebar width (e.g.
					<span hlmCode>280px</span>
					).
				</li>
				<li class="mt-2">
					<span hlmCode>[sidebarWidthIcon]</span>
					– Override collapsed width (e.g.
					<span hlmCode>72px</span>
					).
				</li>
			</ul>

			<h3 hlmH3>Defaults</h3>
			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					<span hlmCode>sidebarWidth</span>
					–
					<span hlmCode>16rem</span>
				</li>
				<li class="mt-2">
					<span hlmCode>sidebarWidthMobile</span>
					–
					<span hlmCode>18rem</span>
				</li>
				<li class="mt-2">
					<span hlmCode>sidebarWidthIcon</span>
					–
					<span hlmCode>4rem</span>
				</li>
			</ul>

			<h3 hlmH3>Config</h3>
			<p hlmP>
				To override defaults, provide a custom configuration in your application config using
				<span hlmCode>provideHlmSidebarConfig</span>
				.
			</p>

			<spartan-code fileName="src/app/app.config.ts" [code]="_provider" />

			<spartan-section-sub-heading id="sidebar-header">Header</spartan-section-sub-heading>
			<p hlmP>
				Use the
				<span hlmCode>HlmSidebarHeader</span>
				component to add a
				<strong>sticky header</strong>
				at the top of your sidebar. This is useful for branding, application titles, or quick-access navigation.
			</p>
			<spartan-code fileName="src/app/app-sidebar.ts" [code]="_header" />

			<spartan-section-sub-heading id="sidebar-footer">Footer</spartan-section-sub-heading>
			<p hlmP>
				Use the
				<span hlmCode>HlmSidebarFooter</span>
				component to add a
				<strong>sticky footer</strong>
				at the bottom of your sidebar. This is useful for secondary actions, user profile information, or app settings.
			</p>
			<spartan-code fileName="src/app/app-sidebar.ts" [code]="_footer" />

			<spartan-section-sub-heading id="sidebar-content">Content</spartan-section-sub-heading>
			<p hlmP>
				The
				<span hlmCode>HlmSidebarContent</span>
				component is used to wrap the
				<strong>main content</strong>
				of the sidebar. This is where you add your
				<span hlmCode>HlmSidebarGroup</span>
				components, navigation links, or menus. The content inside is
				<strong>scrollable</strong>
				, while the header and footer remain sticky.
			</p>
			<spartan-code fileName="src/app/app-sidebar.ts" [code]="_content" />

			<spartan-section-sub-heading id="sidebar-content">Group</spartan-section-sub-heading>
			<p hlmP>
				Use the
				<span hlmCode>HlmSidebarGroup</span>
				component to create a
				<strong>section</strong>
				within the sidebar. A
				<span hlmCode>SidebarGroup</span>
				is composed of:
			</p>

			<ul class="list-inside list-disc pl-4 text-sm">
				<li class="mt-2">
					<span hlmCode>HlmSidebarGroupLabel</span>
					– the section label or title.
				</li>
				<li class="mt-2">
					<span hlmCode>HlmSidebarGroupContent</span>
					– the main body of the group, usually containing links or menu items.
				</li>
				<li class="mt-2">
					<span hlmCode>HlmSidebarGroupAction</span>
					(optional) – a button or action element associated with the group, e.g. "Add" or "Settings".
				</li>
			</ul>
			<spartan-code fileName="src/app/app-sidebar.ts" [code]="_group" />

			<div>
				<spartan-section-sub-heading id="theming">Theming</spartan-section-sub-heading>
				<p hlmP>We use dedicated CSS variables for theming the sidebar, separate from the rest of the application.</p>
				<spartan-code [code]="_cssCode" />
				<p hlmP>
					<strong class="font-medium">
						We intentionally use different variables for the sidebar and the rest of the application
					</strong>
					to make it easy to have a sidebar that is styled differently from the rest of the application. Think a sidebar
					with a darker shade from the main application.
				</p>

				<spartan-section-sub-heading id="responsive-behavior">Responsive behavior</spartan-section-sub-heading>
				<p hlmP>
					The sidebar is responsive by default. It collapses to a minimal state on smaller screens and expands on larger
					screens. This behavior can be customized by overriding the default CSS variables or wrapping in media queries.
				</p>

				<spartan-section-sub-heading id="accessibility">Accessibility</spartan-section-sub-heading>
				<p hlmP>
					The sidebar and its components follow WAI-ARIA best practices. Ensure you provide appropriate labels for
					buttons and landmarks to improve screen reader support.
				</p>

				<spartan-page-bottom-nav>
					<spartan-page-bottom-nav-link href="alert" label="Alert" />
					<spartan-page-bottom-nav-placeholder />
				</spartan-page-bottom-nav>
			</div>
		</section>
		<spartan-page-nav />
	`,
})
export default class SidebarPageComponent {
	protected readonly _cssCode = cssCode;

	protected readonly _usageLayout = usageLayout;
	protected readonly _usageApp = usageApp;
	protected readonly _firstSidebarApp = firstSidebarApp;
	protected readonly _firstSidebar = firstSidebar;
	protected readonly _firstSidebarInitial = firstSidebarInitial;
	protected readonly _provider = provider;
	protected readonly _header = header;
	protected readonly _footer = footer;
	protected readonly _content = content;
	protected readonly _group = group;
}
