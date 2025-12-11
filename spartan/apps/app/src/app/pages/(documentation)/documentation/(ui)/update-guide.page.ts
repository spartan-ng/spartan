import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PackageInstallerTabs } from '@spartan-ng/app/app/shared/layout/package-installer-tabs';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { TabsCli } from '../../../../shared/layout/tabs-cli';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Update Guide' },
	meta: metaWith('spartan - Update Guide', 'Update brain packages and helm components safely'),
	title: 'spartan - Update Guide',
};

@Component({
	selector: 'spartan-update-guide',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		TabsCli,
		HlmAlertImports,
		RouterLink,
		PackageInstallerTabs,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Update Guide"
				lead="Update brain packages via npm. Update helm styles in your codebase."
			/>

			<p class="${hlmP}">
				Because spartan uses a hybrid architecture, updates work differently for brain (npm packages) and helm (code you
				own). Here's how to update each part safely.
			</p>

			<spartan-section-sub-heading id="updating-brain-and-cli">
				Updating Brain and CLI (npm packages)
			</spartan-section-sub-heading>

			<p class="${hlmP}">
				Brain and CLI packages are installed from npm. Keep them on the same version and update with:
			</p>

			<spartan-package-installer-tab class="mt-4" package="brn-update" />

			<p class="${hlmP}">
				After updating brain and cli packages, run the health check tool to automatically apply any necessary
				migrations:
			</p>

			<spartan-cli-tabs
				class="mt-4 mb-6"
				nxCode="nx g @spartan-ng/cli:healthcheck"
				ngCode="ng g @spartan-ng/cli:healthcheck"
			/>

			<p class="${hlmP}">
				The health check will update import paths, migrate deprecated APIs, and flag any breaking changes that need
				manual attention. See the
				<a routerLink="/documentation/health-checks" class="${hlmCode} underline">health checks documentation</a>
				for details.
			</p>

			<spartan-section-sub-heading id="updating-helm">Updating Helm (your components)</spartan-section-sub-heading>

			<p class="${hlmP}">Helm code lives in your repository. You own it, which means updates work differently.</p>

			<h3 class="mt-6 text-lg font-semibold" id="manual-updates">Option 1: Manual Updates (Recommended)</h3>

			<p class="${hlmP}">If you've customized your helm components, update them manually:</p>

			<ol class="my-4 ml-6 list-decimal [&>li]:mt-2">
				<li>Check the changelog for component changes</li>
				<li>Review the updated component code on GitHub</li>
				<li>Apply changes to your customized components</li>
				<li>Test your changes</li>
			</ol>

			<p class="${hlmP}">This approach preserves your customizations while incorporating new features or fixes.</p>

			<h3 class="mt-6 text-lg font-semibold" id="automated-migration">Option 2: Automated Migration</h3>

			<p class="${hlmP}">The CLI can replace helm components with the latest versions:</p>

			<spartan-cli-tabs
				class="mt-4 mb-6"
				nxCode="nx g @spartan-ng/cli:migrate-helm-libraries"
				ngCode="ng g @spartan-ng/cli:migrate-helm-libraries"
			/>

			<div hlmAlert variant="destructive" class="my-6">
				<h4 hlmAlertTitle>Warning: Customizations Will Be Lost</h4>
				<div hlmAlertDescription>
					<p>
						This command replaces your helm components with fresh copies. Any customizations you've made will be
						overwritten. Only use this if you haven't modified the components, or if you're prepared to reapply your
						changes afterward.
					</p>
				</div>
			</div>

			<spartan-section-sub-heading id="update-workflow">Recommended Update Workflow</spartan-section-sub-heading>

			<ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
				<li>
					<strong>Check for updates:</strong>
					Review the
					<a href="https://github.com/spartan-ng/spartan/releases" target="_blank" class="underline">changelog</a>
					to see what's changed
				</li>
				<li>
					<strong>Update brain and cli:</strong>
					Run
					<code class="${hlmCode}">pnpm/npm/yarn/bun update &#64;spartan-ng/brain &#64;spartan-ng/cli</code>
				</li>
				<li>
					<strong>Run health checks:</strong>
					Let the CLI apply automated migrations
				</li>
				<li>
					<strong>Update helm manually:</strong>
					Review and apply changes to customized components
				</li>
				<li>
					<strong>Test:</strong>
					Run your e2e tests to verify everything works
				</li>
			</ol>

			<spartan-section-sub-heading id="version-compatibility">Version Compatibility</spartan-section-sub-heading>

			<p class="${hlmP}">
				Brain and helm versions don't need to match exactly. The brain package handles behavior and accessibility, while
				helm handles styling. As long as you're using compatible versions (typically within the same major version),
				they'll work together.
			</p>

			<p class="${hlmP}">
				If you're on an older version of spartan, check the health check output for compatibility warnings.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/components" label="Components" />
				<spartan-page-bottom-nav-link direction="previous" href="health-checks" label="Health Checks" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class UpdateGuidePage {}
