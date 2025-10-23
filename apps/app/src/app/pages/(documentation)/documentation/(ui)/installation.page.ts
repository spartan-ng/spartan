import type { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
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

import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { HlmAlert, HlmAlertDescription, HlmAlertTitle } from '@spartan-ng/helm/alert';
import { metaWith } from '../../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Installation' },
	meta: metaWith('spartan - Installation', 'Getting up and running with spartan'),
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
	],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Installation" lead="Getting up and running with spartan." />
			<p class="${hlmP}">
				Adding
				<code class="${hlmCode}">spartan/ui</code>
				to your project requires only a couple steps!
			</p>
			<p class="${hlmP}">We support the Angular CLI & Nx! Start with installing our plugin:</p>
			<spartan-code class="mt-4" code="npm i -D @spartan-ng/cli" />
			<p class="${hlmP}">Install our brain:</p>
			<spartan-code class="mt-4" code="npm i @spartan-ng/brain" />
			<spartan-section-sub-heading id="prerequisites">Prerequisites</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				is built on top of Tailwind CSS. Make sure your application has a working Tailwind CSS setup before you
				continue. Tailwind installation instructions can be found
				<a
					class="${hlmCode} underline"
					href="https://tailwindcss.com/docs/installation/framework-guides/angular"
					target="_blank"
				>
					here.
				</a>
			</p>
			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				also builds on top of angular/cdk. To install it run the following command:
			</p>
			<spartan-code class="mt-4" code="npm i @angular/cdk" />
			<spartan-section-sub-heading id="setting-up-tailwindcss">Setup Tailwind CSS</spartan-section-sub-heading>

			<div hlmAlert variant="destructive" class="mt-6">
				<h4 hlmAlertTitle>We recommend using Tailwind CSS version 4.</h4>
				<div hlmAlertDescription>
					<p>
						Please note that we cannot guarantee full compatibility of the components with Tailwind CSS version 3, and
						some features may not function as expected.
						<a [routerLink]="[]" [relativeTo]="_activatedRoute" fragment="adding-t3-guide" class="${hlmCode} underline">
							Tailwind 3 Guide
						</a>
					</p>
				</div>
			</div>
			<div hlmAlert class="mt-6">
				<h4 hlmAlertTitle>Define layers that ng-icons styles are applied correctly</h4>
				<div hlmAlertDescription>
					<p>
						After you setup Tailwind CSS, make sure to define the layers that ng-icons styles are applied correctly. You
						can do this by adding the following code to your styles.css file:
					</p>
					<spartan-code
						class="mt-4 w-full"
						code='
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
'
					/>
				</div>
			</div>

			<p class="${hlmP}">
				You now have to add our spartan-specific configuration to your Tailwind CSS setup. To make the setup as easy as
				possible, the
				<code class="${hlmCode}">&#64;spartan-ng/brain</code>
				package comes with it own preset.
			</p>

			<h3 spartanH4 id="theme-generator">Theme Generator</h3>
			<p class="${hlmP}">If you are using Nx, we have written a plugin that will take care of the heavy lifting:</p>
			<spartan-cli-tabs
				class="mt-4 mb-6"
				nxCode="npx nx g @spartan-ng/cli:ui-theme"
				ngCode="ng g @spartan-ng/cli:ui-theme"
			/>
			<p class="${hlmP}">To learn more about the Nx plugin check out the CLI docs below.</p>
			<div class="my-2 flex items-center justify-end">
				<a routerLink="/documentation/cli" variant="outline" size="sm" hlmBtn outline="">
					CLI documentation
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>

			<h3 spartanH4 id="manual-setup">Manual Setup</h3>

			<p class="${hlmP}">If you want to install it manually, add the following line to your css file.</p>
			<spartan-code
				class="mt-4"
				code='@import "@spartan-ng/brain/hlm-tailwind-preset.css";'
				fileName="src/styles.css"
			/>

			<h3 spartanH4 id="adding-css-vars">Adding CSS variables</h3>
			<p class="${hlmP}">
				To complete your Tailwind CSS setup, you need to add our spartan-specific CSS variables to your style
				entrypoint. This is most likely a
				<code class="${hlmCode}">styles.css</code>
				in the
				<code class="${hlmCode}">src</code>
				folder of your application.
			</p>

			<p class="${hlmP}">
				If you are not using Nx (yet) you can copy the variables of the default theme below and manually add them to
				your style entrypoint, such as
				<code class="${hlmCode}">styles.css</code>
				:
			</p>

			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=":root {
  color-scheme: light;
  --font-sans: 'Geist Sans', sans-serif;
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  color-scheme: dark;
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}"
			/>
			<p class="${hlmP}">
				Also, make sure to check out the theming section to better understand the convention behind them and learn how
				to customize your theme.
			</p>

			<h3 id="intellisense" spartanH4>IntelliSense</h3>

			<p>
				You can enable autocompletion inside
				<span class="${hlmCode}">hlm</span>
				and
				<span class="${hlmCode}">cva</span>
				functions.
			</p>

			<ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
				<li>
					Install
					<a
						class="${hlmCode} underline"
						href="https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss"
						target="_blank"
						rel="noopener noreferrer"
					>
						"Tailwind CSS IntelliSense"
					</a>
					Visual Studio Code extension
				</li>
				<li>
					Add
					<a
						class="${hlmCode} underline"
						href="https://github.com/tailwindlabs/tailwindcss-intellisense?tab=readme-ov-file#tailwindcssclassfunctions"
						target="_blank"
						rel="noopener noreferrer"
					>
						tailwindCSS.classFunctions
					</a>
					to your
					<a
						class="${hlmCode} underline"
						href="https://code.visualstudio.com/docs/configure/settings"
						target="_blank"
						rel="noopener noreferrer"
					>
						settings.json
					</a>
				</li>
			</ol>

			<spartan-code
				class="mt-4"
				code='{
  "tailwindCSS.classFunctions": ["hlm", "cva"]
}'
			/>

			<h3 id="sorting-classes" spartanH4>Sorting classes</h3>

			<p class="${hlmP} text-pretty">
				You can enable automatic sorting of Tailwind CSS classes in
				<span class="${hlmCode}">hlm</span>
				and
				<span class="${hlmCode}">cva</span>
				functions with the
				<span class="${hlmCode}">prettier-plugin-tailwindcss</span>
				.
			</p>

			<ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
				<li>
					Install and configure the
					<a
						class="${hlmCode} underline"
						href="https://github.com/tailwindlabs/prettier-plugin-tailwindcss"
						target="_blank"
						rel="noopener noreferrer"
					>
						prettier-plugin-tailwindcss
					</a>

					in your project.
				</li>
				<li>
					Add
					<a
						class="${hlmCode} underline"
						href="https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file#sorting-classes-in-function-calls"
						target="_blank"
						rel="noopener noreferrer"
					>
						tailwindFunctions
					</a>
					option to your prettier config file (e.g.
					<span class="${hlmCode}">.prettierrc</span>
					):
				</li>
			</ol>

			<spartan-code
				class="mt-4"
				code='// .prettierrc
{
  "tailwindFunctions": ["hlm", "cva"]
}'
			/>

			<spartan-section-sub-heading id="adding-primitives">Adding primitives</spartan-section-sub-heading>
			<p class="${hlmP}">
				With the Nx plugin, adding primitives is as simple as running a single command. It will allow you to pick and
				choose which primitives to add to your project. It will add all brain dependencies and copy helm code into its
				own library:
			</p>
			<spartan-cli-tabs class="mt-4 mb-6" nxCode="npx nx g @spartan-ng/cli:ui" ngCode="ng g @spartan-ng/cli:ui" />
			<p class="${hlmP}">To learn more about the command line interface check out the docs below.</p>
			<div class="my-2 flex items-center justify-end">
				<a routerLink="/documentation/cli" variant="outline" size="sm" hlmBtn outline="">
					CLI documentation
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>

			<spartan-section-sub-heading id="adding-t3-guide" class="text-destructive">
				Tailwind 3 Guide (Not recommended)
			</spartan-section-sub-heading>

			<p class="${hlmP}">If you are using Tailwind 3 add the following to your config file:</p>
			<spartan-cli-tabs
				language="js"
				class="mt-4 mb-6"
				nxCode="
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
"
				ngCode="
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: [
    './src/**/*.{html,ts}',
    './REPLACE_WITH_PATH_TO_YOUR_COMPONENTS_DIRECTORY/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
"
			/>

			<p class="${hlmP}">
				If you have manually added the variables to your style entrypoint, don't forget to import the Angular CDK
				overlay styles too.
			</p>
			<spartan-code class="mt-4 mb-6" code="@import '@angular/cdk/overlay-prebuilt.css';" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="theming" label="Theming" />
				<spartan-page-bottom-nav-link direction="previous" href="/stack" label="Stack" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class InstallationPage {
	protected readonly _activatedRoute = inject(ActivatedRoute);
}
