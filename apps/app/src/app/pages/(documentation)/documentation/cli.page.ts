import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
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
	meta: metaWith('spartan - CLI', 'Add accessible UI primitives to any Angular project with one command.'),
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
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="CLI" lead="Add accessible UI primitives to any Angular project with one command." />

			<p class="${hlmP}">
				The spartan CLI is the fastest way to add components to your project. It works with both Angular CLI projects
				and Nx workspaces - no additional configuration required.
			</p>

			<p class="${hlmP}">
				For each component you add, the CLI automatically installs the Brain primitive from npm and copies the Helm
				styles into your codebase. You choose individual components or install them all at once.
			</p>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP}">Install the spartan CLI as a dev dependency:</p>
			<spartan-package-installer-tab class="mt-4" />

			<spartan-section-sub-heading id="setup-theme">Setup Your Theme</spartan-section-sub-heading>
			<p class="${hlmP}">Before adding components, configure your theme and Tailwind settings:</p>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui-theme"
				ngCode="ng g @spartan-ng/cli:ui-theme"
			/>

			<p class="${hlmP}">
				The CLI will prompt you to select your application, locate your styles entry point, choose a theme, and set your
				preferred border radius. This only needs to be done once.
			</p>

			<spartan-section-sub-heading id="add-components">Add Components</spartan-section-sub-heading>
			<p class="${hlmP}">Add spartan/ui components to your project:</p>
			<spartan-cli-tabs class="mt-4" nxCode="npx nx g @spartan-ng/cli:ui" ngCode="ng g @spartan-ng/cli:ui" />

			<p class="${hlmP}">
				You'll be prompted to select components to add - choose individual components or all of them. The CLI takes care
				of the rest.
			</p>

			<spartan-section-sub-heading id="what-happens">What the CLI Does</spartan-section-sub-heading>
			<p class="${hlmP}">When you add a component, the CLI automatically:</p>

			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>
					<strong>Installs the Brain primitives:</strong>
					Adds the
					<code class="${hlmCode}">&#64;spartan-ng/brain</code>
					package to your
					<code class="${hlmCode}">package.json</code>
					if needed
				</li>
				<li>
					<strong>Copies Helm files:</strong>
					Places styled component code into your project at your specified location
				</li>
				<li>
					<strong>Configures imports:</strong>
					Updates your project configuration to recognize the new components
				</li>
				<li>
					<strong>Creates libraries (Nx only):</strong>
					Optionally generates buildable libraries for better code organization
				</li>
			</ul>

			<p class="${hlmP}">
				Result: Brain primitives are installed as maintained npm dependencies. Helm styles live in your codebase where
				you can edit them freely. No manual setup required.
			</p>

			<spartan-section-sub-heading id="workflow">Recommended Workflow</spartan-section-sub-heading>
			<ol class="my-4 ml-6 list-decimal [&>li]:mt-2">
				<li>
					Install tailwindcss:
					<a
						class="${hlmCode} underline"
						href="https://tailwindcss.com/docs/installation/framework-guides/angular"
						target="_blank"
					>
						official Angular installation guide
					</a>
				</li>
				<li>
					Install the CLI:
					<code class="${hlmCode}">npm i -D &#64;spartan-ng/cli</code>
				</li>
				<li>
					Set up your theme:
					<code class="${hlmCode}">ng g &#64;spartan-ng/cli:ui-theme</code>
				</li>
				<li>
					Add components as needed:
					<code class="${hlmCode}">ng g &#64;spartan-ng/cli:ui</code>
				</li>
				<li>Customize the copied Helm files to match your design system</li>
				<li>Ship your app with complete control over every style</li>
			</ol>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="components-json" label="components.json" />
				<spartan-page-bottom-nav-link direction="previous" href="introduction" label="Introduction" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class CliPage {}
