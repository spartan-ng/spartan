import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '@spartan-ng/app/app/shared/layout/section-intro.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmP } from '@spartan-ng/ui-typography-helm';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Health Checks' },
	meta: metaWith('spartan - Health Checks', 'Ensure your project is up to date with the latest best practices.'),
	title: 'spartan - Health Checks',
};

@Component({
	selector: 'spartan-health-checks',
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		TabsCliComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Health Checks"
				lead="Ensure your project is up to date with the latest best practices."
			/>
			<section>
				<p class="${hlmP}">
					Spartan CLI comes with a health check tool that will scan your project and provide you with a report of any
					issues that need to be addressed, and guidance on how to resolve them.
				</p>

				<p class="${hlmP}">
					Additionally, while Spartan is still in its alpha stage we are working hard to make sure our components and
					tooling is built with the latest best practices and is structure in a way that will serve us well into the
					future. As a result we have been making some changes that may result in breaking changes to your project.
				</p>

				<p class="${hlmP}">
					To help minimize the impact of such changes, in most cases the health check tool will automatically be able to
					fix the issues for you. To run the health check tool simply run the following command:
				</p>

				<spartan-cli-tabs
					class="mb-6 mt-4"
					nxCode="nx g @spartan-ng/cli:healthcheck"
					ngCode="ng g @spartan-ng/cli:healthcheck"
				/>
			</section>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="update-guide" label="Update Guide" />
				<spartan-page-bottom-nav-link direction="previous" href="figma" label="Figma" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class HealthChecksPageComponent {}
