import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';

import { SidebarPreviewComponent, codeImports, codeSkeleton, codeString, cssCode } from './sidebar.preview';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { Tabs } from '@spartan-ng/app/app/shared/layout/tabs';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageBottomNavPlaceholder } from '@spartan-ng/app/app/shared/layout/page-bottom-nav-placeholder';
import { HlmCode, HlmH4, HlmLead, HlmP } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'sidebar' },
	meta: metaWith(
		'spartan/ui - sidebar',
		'A composable, themeable and customizable sidebar component.',
	),
	title: 'spartan/ui - sidebar',
};

@Component({
	selector: 'spartan-sidebar',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		SidebarPreviewComponent,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		PageBottomNavPlaceholder,
		HlmP,
		HlmCode,
		HlmLead,
		HlmH4,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Sidebar" lead="A composable, themeable and customizable sidebar component." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-sidebar-preview />
				</div>
				<spartan-code secondTab [code]="_code" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui sidebar"
				ngCode="ng g @spartan-ng/cli:ui sidebar"
			/>

			<h3 class="font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight">
				Add the following colors to your CSS file
			</h3>
			<p hlmP class="mb-6">
				The command above should install the colors for you. If not, copy and paste the following in your CSS file.
				<br />
				We'll go over the colors later in the theming section.
			</p>

			<spartan-code [code]="cssCode" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="components">Components</spartan-section-sub-heading>
			<p hlmP>
				The components in <code hlmCode>sidebar.tsx</code> are built to be composable. You build your sidebar by
				putting the provided components together. They also compose well with other shadcn/ui components.
			</p>

			<spartan-section-sub-heading id="sidebar-header">SidebarHeader</spartan-section-sub-heading>
			<p hlmP>
				A wrapper for the header part of the sidebar. Usually contains the logo and the app name.
			</p>

			<spartan-section-sub-heading id="sidebar-footer">SidebarFooter</spartan-section-sub-heading>
			<p hlmP>
				A wrapper for the footer part of the sidebar. Usually contains the user menu or other app-wide controls.
			</p>

			<spartan-section-sub-heading id="sidebar-menu">SidebarMenu</spartan-section-sub-heading>
			<p hlmP>
				A wrapper for grouping multiple <code hlmCode>SidebarMenuItem</code> or <code hlmCode>SidebarMenuButton</code>.
			</p>

			<spartan-section-sub-heading id="sidebar-menu-item">SidebarMenuItem</spartan-section-sub-heading>
			<p hlmP>
				Represents a single item inside the sidebar menu. Can contain a link, button, or custom content.
			</p>

			<spartan-section-sub-heading id="sidebar-menu-button">SidebarMenuButton</spartan-section-sub-heading>
			<p hlmP>
				A button-styled menu item that can be used for navigation or actions.
			</p>

			<spartan-section-sub-heading id="sidebar-separator">SidebarSeparator</spartan-section-sub-heading>
			<p hlmP>
				A visual separator to group different sections inside the sidebar.
			</p>

			<spartan-section-sub-heading id="sidebar-provider">SidebarProvider</spartan-section-sub-heading>
			<p hlmP>
				Provides context for sidebar state (collapsed/expanded) to all child components.
			</p>

			<spartan-section-sub-heading id="theming">Theming</spartan-section-sub-heading>
			<p hlmP>
				We use dedicated CSS variables for theming the sidebar, separate from the rest of the application.
			</p>
			<spartan-code [code]="cssCode" />

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
	protected readonly _code = codeString;
	protected readonly _imports = codeImports;
	protected readonly _skeleton = codeSkeleton;
	protected readonly _codeSkeleton = codeSkeleton;
	protected readonly cssCode = cssCode;
}
