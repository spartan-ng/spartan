import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { TabsCli } from '../../../../shared/layout/tabs-cli';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Health Checks' },
	meta: metaWith('spartan - Health Checks', 'Automatically detect and fix issues in your spartan components'),
	title: 'spartan - Health Checks',
};

@Component({
	selector: 'spartan-health-checks',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		TabsCli,
		RouterLink,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Health Checks"
				lead="Scan your codebase for issues. Automatically fix most of them."
			/>

			<p class="${hlmP}">
				The spartan CLI includes a health check tool that scans your components for common issues and outdated patterns.
				Run it after updating spartan packages to ensure your code stays current.
			</p>

			<spartan-cli-tabs
				class="mt-6 mb-6"
				nxCode="nx g @spartan-ng/cli:healthcheck"
				ngCode="ng g @spartan-ng/cli:healthcheck"
			/>

			<spartan-section-sub-heading id="what-it-does">What it does</spartan-section-sub-heading>

			<p class="${hlmP}">The health check tool identifies issues like:</p>

			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>Deprecated component APIs or import paths</li>
				<li>Outdated helm directive usage</li>
				<li>Missing dependencies or peer dependency conflicts</li>
				<li>Breaking changes from recent updates</li>
			</ul>

			<p class="${hlmP}">
				Most issues can be fixed automatically. The tool will update import paths, migrate deprecated APIs, and fix
				common configuration issues. For anything that requires manual intervention, it provides clear guidance on what
				needs to change.
			</p>

			<spartan-section-sub-heading id="when-to-run">When to run health checks</spartan-section-sub-heading>

			<p class="${hlmP}">Run health checks:</p>

			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>
					After updating
					<code class="${hlmCode}">&#64;spartan-ng</code>
					packages
				</li>
				<li>When migrating existing components to new patterns</li>
				<li>Periodically to catch deprecated patterns early</li>
			</ul>

			<p class="${hlmP}">
				See the
				<a routerLink="/documentation/update-guide" class="${hlmCode} underline">update guide</a>
				for version-specific migration instructions.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link direction="next" href="update-guide" label="Update Guide" />
				<spartan-page-bottom-nav-link direction="previous" href="version-support" label="Version Support" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class HealthChecksPage {}
