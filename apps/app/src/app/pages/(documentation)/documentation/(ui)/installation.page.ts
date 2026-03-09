import { type RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { PackageInstallerTabs } from '@spartan-ng/app/app/shared/layout/package-installer-tabs';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { HlmAlert, HlmAlertDescription, HlmAlertTitle } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { metaWith } from '../../../../shared/meta/meta.util';
import {
	angularCdkOverlayImport,
	cssVariables,
	ngTailwind3,
	nxTailwind3,
	spartanPresetImport,
	tailwindImports,
	tailwindIntellisense,
	tailwindPrettierSorting,
} from './installation-snippets';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Installation' },
	meta: metaWith('spartan - Installation', 'Install spartan/ui in your Angular project'),
	title: 'spartan - Installation',
};

@Component({
	selector: 'spartan-installation',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		Code,
		HlmButtonImports,
		NgIcon,
		HlmIconImports,
		RouterLink,
		TabsCli,
		SectionSubSubHeading,
		HlmAlert,
		HlmAlertDescription,
		HlmAlertTitle,
		PackageInstallerTabs,
	],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Installation" lead="Install behavior. Copy styles. Start building." />

			<p class="${hlmP}">
				spartan/ui uses a two-layer architecture: you install
				<code class="${hlmCode}">&#64;spartan-ng/brain</code>
				from npm for accessible primitives, then copy
				<code class="${hlmCode}">helm</code>
				styles into your codebase for customization.
			</p>

			<spartan-section-sub-heading id="prerequisites">Prerequisites</spartan-section-sub-heading>

			<p class="${hlmP}">
				spartan/ui requires Tailwind CSS. If you haven't set it up yet, follow the
				<a
					class="${hlmCode} underline"
					href="https://tailwindcss.com/docs/installation/framework-guides/angular"
					target="_blank"
				>
					official Angular installation guide
				</a>
				before continuing.
			</p>

			<spartan-section-sub-heading id="quick-start">Quick Start</spartan-section-sub-heading>

			<p class="${hlmP}">Install the CLI plugin:</p>
			<spartan-package-installer-tab class="mt-4" />

			<p class="${hlmP}">Run the spartan/cli init command:</p>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:init" ngCode="ng g @spartan-ng/cli:init" />

			<p class="${hlmP}">
				Use the CLI to add components to your project. This installs the brain dependency (npm) and copies helm code
				(styles) into your codebase:
			</p>
			<spartan-cli-tabs class="mt-4 mb-6" nxCode="npx nx g @spartan-ng/cli:ui" ngCode="ng g @spartan-ng/cli:ui" />

			<p class="${hlmP}">The CLI will prompt you to select which components to add. Each component includes:</p>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>Brain primitive (installed to node_modules)</li>
				<li>Helm styles (copied to your project)</li>
				<li>All necessary dependencies</li>
			</ul>

			<div class="my-2 flex items-center justify-end">
				<a routerLink="/components" variant="outline" size="sm" hlmBtn outline="">
					Check out the Components
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>

			<spartan-section-sub-heading id="manual-setup">Manual Setup</spartan-section-sub-heading>
			<h3 spartanH4 id="install-dependencies">1. Install Dependencies</h3>

			<p class="${hlmP}">Install the brain (accessible primitives):</p>
			<spartan-package-installer-tab class="mt-4" package="brn" />

			<p class="${hlmP}">Install Angular CDK (required for overlays and accessibility):</p>
			<spartan-package-installer-tab class="mt-4" package="cdk" />

			<h3 spartanH4 id="configure-tailwind-css">2. Configure Tailwind CSS</h3>

			<div hlmAlert variant="destructive" class="mt-6">
				<h4 hlmAlertTitle>Use Tailwind CSS v4</h4>
				<div hlmAlertDescription>
					<p>We recommend Tailwind CSS v4. Some features may not work correctly with v3.</p>
					<a [routerLink]="[]" [relativeTo]="_activatedRoute" fragment="tailwind-v3" class="${hlmCode} underline">
						See Tailwind v3 guide
					</a>
				</div>
			</div>

			<h4 spartanH4 id="configure-layers">2.1 Configure CSS Layers</h4>
			<p class="${hlmP}">
				Add these layers to your
				<code class="${hlmCode}">styles.css</code>
				to ensure ng-icons styles load correctly:
			</p>
			<spartan-code class="mt-4" [code]="_tailwindImports" fileName="src/styles.css" />

			<h4 spartanH4 id="import-preset" class="mt-8">2.2 Import spartan/ui preset</h4>
			<p class="${hlmP}">Add the spartan preset to your CSS file:</p>
			<spartan-code class="mt-4" [code]="_spartanPresetImport" fileName="src/styles.css" />

			<div hlmAlert class="mt-6">
				<h4 hlmAlertTitle>spartan/ui preset</h4>
				<div hlmAlertDescription>
					<p class="${hlmP}">Our preset already includes tw-animate-css and &#64;angular/cdk/overlay-prebuilt.css</p>
				</div>
			</div>

			<h4 spartanH4 id="add-theme-variables" class="mt-8">2.3 Add Theme Variables</h4>
			<p class="${hlmP}">You have two options for adding spartan's CSS variables:</p>

			<h4 class="mt-4 text-sm font-semibold">Option A: Use the Theme Generator (Recommended)</h4>
			<p class="${hlmP}">Generate theme configuration automatically with our CLI:</p>
			<spartan-cli-tabs
				class="mt-4 mb-6"
				nxCode="npx nx g @spartan-ng/cli:ui-theme"
				ngCode="ng g @spartan-ng/cli:ui-theme"
			/>
			<div class="my-2 flex items-center justify-end">
				<a routerLink="/documentation/cli" variant="outline" size="sm" hlmBtn outline="">
					CLI documentation
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>

			<h4 class="mt-6 text-sm font-semibold">Option B: Manual Setup</h4>
			<p class="${hlmP}">
				Copy these CSS variables to your
				<code class="${hlmCode}">styles.css</code>
				:
			</p>

			<spartan-code class="mt-6" fileName="styles.css" [code]="_cssVariables" />

			<p class="${hlmP}">
				Learn how to customize these variables in the
				<a routerLink="/documentation/theming" class="${hlmCode} underline">theming documentation</a>
				.
			</p>

			<h3 spartanH4 id="adding-components">3. Add Components</h3>

			<p class="${hlmP}">
				Use the CLI to add components to your project. This installs the brain dependency (npm) and copies helm code
				(styles) into your codebase:
			</p>
			<spartan-cli-tabs class="mt-4 mb-6" nxCode="npx nx g @spartan-ng/cli:ui" ngCode="ng g @spartan-ng/cli:ui" />

			<p class="${hlmP}">The CLI will prompt you to select which components to add. Each component includes:</p>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li>Brain primitive (installed to node_modules)</li>
				<li>Helm styles (copied to your project)</li>
				<li>All necessary dependencies</li>
			</ul>

			<div class="my-2 flex items-center justify-end">
				<a routerLink="/documentation/cli" variant="outline" size="sm" hlmBtn outline="">
					CLI documentation
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>

			<spartan-section-sub-heading id="editor-setup">Editor Setup (Optional)</spartan-section-sub-heading>

			<h3 spartanH4 id="intellisense">IntelliSense</h3>
			<p class="${hlmP}">
				Enable Tailwind autocompletion in
				<code class="${hlmCode}">hlm</code>
				,
				<code class="${hlmCode}">cva</code>
				and
				<code class="${hlmCode}">classes</code>
				functions:
			</p>

			<ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
				<li>
					Install the
					<a
						class="${hlmCode} underline"
						href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss"
						target="_blank"
						rel="noopener noreferrer"
					>
						Tailwind CSS IntelliSense
					</a>
					extension
				</li>
				<li>
					Add this to your
					<code class="${hlmCode}">settings.json</code>
					:
				</li>
			</ol>

			<spartan-code class="mt-4" [code]="_tailwindIntellisense" />

			<h3 spartanH4 id="sorting-classes" class="mt-8">Class Sorting</h3>
			<p class="${hlmP}">Automatically sort Tailwind classes with Prettier:</p>

			<ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
				<li>
					Install
					<a
						class="${hlmCode} underline"
						href="https://github.com/tailwindlabs/prettier-plugin-tailwindcss"
						target="_blank"
						rel="noopener noreferrer"
					>
						prettier-plugin-tailwindcss
					</a>
				</li>
				<li>
					Add this to your
					<code class="${hlmCode}">.prettierrc</code>
					:
				</li>
			</ol>

			<spartan-code class="mt-4" [code]="_tailwindPrettierSorting" />

			<spartan-section-sub-heading id="tailwind-v3" class="text-destructive">
				Tailwind CSS v3 (Not Recommended)
			</spartan-section-sub-heading>

			<div hlmAlert variant="destructive" class="mt-4 mb-6">
				<h4 hlmAlertTitle>Limited v3 Support</h4>
				<div hlmAlertDescription>
					<p>
						Tailwind CSS v3 support is not guaranteed. Some components may not work as expected. We strongly recommend
						upgrading to v4.
					</p>
				</div>
			</div>

			<p class="${hlmP}">If you must use Tailwind v3, add this to your config:</p>
			<spartan-cli-tabs language="js" class="mt-4 mb-6" [nxCode]="_nxTailwind3" [ngCode]="_ngTailwind3" />

			<p class="${hlmP}">Also make sure to import the Angular CDK overlay styles:</p>
			<spartan-code class="mt-4 mb-6" [code]="_angularCdkOverlayImport" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="components-json" label="components.json" />
				<spartan-page-bottom-nav-link direction="previous" href="about" label="About" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class InstallationPage {
	protected readonly _activatedRoute = inject(ActivatedRoute);

	protected readonly _tailwindImports = tailwindImports;
	protected readonly _spartanPresetImport = spartanPresetImport;
	protected readonly _cssVariables = cssVariables;
	protected readonly _tailwindIntellisense = tailwindIntellisense;
	protected readonly _tailwindPrettierSorting = tailwindPrettierSorting;
	protected readonly _nxTailwind3 = nxTailwind3;
	protected readonly _ngTailwind3 = ngTailwind3;
	protected readonly _angularCdkOverlayImport = angularCdkOverlayImport;
}
