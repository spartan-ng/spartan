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
import { cssCode, firstSidebar, firstSidebarApp, firstSidebarInitial, usageApp, usageLayout } from './sidebar.preview';

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
		<section spartanMainSection>
			<spartan-section-intro name="Sidebar" lead="A composable, themeable and customizable sidebar component." />

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui sidebar"
				ngCode="ng g @spartan-ng/cli:ui sidebar"
			/>

			<h3 class="font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight" id="add-colors">
				Add the following colors to your CSS file
			</h3>
			<p hlmP class="mb-6">
				The command above should install the colors for you. If not, copy and paste the following in your CSS file.
				<br />
				We'll go over the colors later in the theming section.
			</p>

			<spartan-code [code]="_cssCode" />

			<spartan-section-sub-heading id="structure">Structure</spartan-section-sub-heading>

			<div class="leading-relaxed [&:not(:first-child)]:mt-6" hlmP>
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

			<img src="/assets/sidebar-structure.png" alt="Sidebar structure" class="border-border mt-4 rounded border" />

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
				The sidebar and its components follow WAI-ARIA best practices. Ensure you provide appropriate labels for buttons
				and landmarks to improve screen reader support.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="alert" label="Alert" />
				<spartan-page-bottom-nav-placeholder />
			</spartan-page-bottom-nav>
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
}
