import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { MainSection } from '../../../shared/layout/main-section';
import { PackageInstallerTabs } from '../../../shared/layout/package-installer-tabs';
import { PageBottomNav } from '../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../shared/layout/section-sub-heading';
import { TabsCli } from '../../../shared/layout/tabs-cli';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'CLI' },
	meta: metaWith('spartan - CLI', 'Supercharge your spartan experience with our CLI.'),
	title: 'spartan - CLI',
};

@Component({
	selector: 'spartan-cli',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		TabsCli,
		PackageInstallerTabs,
		SectionSubSubHeading,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="CLI" lead="Supercharge your spartan experience with our CLI." />
			<p class="${hlmP}">
				Ultimately our goal is to provide a standalone CLI that allows you to simply add spartan primitives to any
				Angular project.
			</p>
			<p class="${hlmP}">
				However, our initial focus is to provide a tight integration with the
				<code class="${hlmCode}">spartan/stack</code>
				, which runs on Nx. Therefore, the initial version of our CLI is a Nx plugin.
			</p>

			<spartan-section-sub-heading id="nx">&#64;spartan-ng/nx</spartan-section-sub-heading>
			<p class="${hlmP}">
				To add
				<code class="${hlmCode}">spartan</code>
				to your Angular CLI project or Nx workspace simply install the plugin with the command below:
			</p>
			<spartan-package-installer-tab class="mt-4" />

			<h3 id="nx__ui" spartanH4>ui</h3>
			<p class="${hlmP}">
				To add
				<code class="${hlmCode}">spartan/ui</code>
				primitives to your workspace run the following command:
			</p>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui" ngCode="ng g @spartan-ng/cli:ui" />
			<p class="${hlmP}">
				You can then select which primitives you want to add. For each primitive we create a buildable library at a path
				of your choice.
			</p>

			<h3 id="nx__ui_theme" spartanH4>ui-theme</h3>
			<p class="${hlmP}">Adding a theme can also be done on itself. Use the command below:</p>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui-theme" ngCode="ng g @spartan-ng/cli:ui-theme" />
			<p class="${hlmP}">
				You can then select which application you want to add the theme to. Where your styles entrypoint is located.
				Which theme to add & what border radius to use.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="components-json" label="components.json" />
				<spartan-page-bottom-nav-link direction="previous" href="introduction" label="Introduction" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class CliPage {}
