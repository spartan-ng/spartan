import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';

import { metaWith } from '../../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Installation' },
	meta: metaWith('spartan - Installation', 'Getting up and running with spartan'),
	title: 'spartan - Installation',
};

@Component({
	selector: 'spartan-installation',
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		SectionSubHeadingComponent,
		CodeComponent,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		RouterLink,
		TabsCliComponent,
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
			<spartan-section-sub-heading id="prerequisites">Prerequisites</spartan-section-sub-heading>
			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				is built on top of TailwindCSS. Make sure your application has a working TailwindCSS setup before you continue.
				Tailwind installation instructions can be found
				<a class="${hlmCode}" href="https://tailwindcss.com/docs/installation/framework-guides/angular" target="_blank">
					here.
				</a>
			</p>
			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				also builds on top of angular/cdk. To install it run the following command:
			</p>
			<spartan-code class="mt-4" code="npm i @angular/cdk" />
			<spartan-section-sub-heading id="setting-up-tailwind">Setup Tailwind</spartan-section-sub-heading>
			<p class="${hlmP}">
				You now have to add our spartan-specific configuration to your TailwindCSS setup. To make the setup as easy as
				possible, the
				<code class="${hlmCode}">&#64;spartan-ng/brain</code>
				package comes with it own preset.
			</p>
			<p class="${hlmP}">If you are using Tailwind 3 add the following to your config file:</p>
			<spartan-cli-tabs
				language="js"
				class="mb-6 mt-4"
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

			<p class="${hlmP}">If you are using Tailwind 4 add the following import to your global stylesheet:</p>

			<spartan-code class="mt-4" code="@import '@spartan-ng/brain/hlm-tailwind-preset.css';" />

			<spartan-section-sub-heading id="adding-css-vars">Adding CSS variables</spartan-section-sub-heading>
			<p class="${hlmP}">
				To complete your TailwindCSS setup, you need to add our spartan-specific CSS variables to your style entrypoint.
				This is most likely a
				<code class="${hlmCode}">styles.css</code>
				in the
				<code class="${hlmCode}">src</code>
				folder of your application.
			</p>
			<p class="${hlmP}">
				Again, if you are using Nx, we have written a plugin that will take care of the heavy lifting:
			</p>
			<spartan-cli-tabs
				class="mb-6 mt-4"
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
			<p class="${hlmP}">
				If you are not using Nx (yet) you can copy the variables of the default theme below and manually add them to
				your style entrypoint, such as
				<code class="${hlmCode}">styles.css</code>
				:
			</p>
			<spartan-code
				class="mb-6 mt-4"
				code="
:root {
	--font-sans: 'Geist Sans', sans-serif;
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
  color-scheme: light;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
  color-scheme: dark;
}

@layer base {
  * {
    @apply border-border;
  }
}
"
			/>
			<p class="${hlmP}">
				If you have manually added the variables to your style entrypoint, don't forget to import the Angular CDK
				overlay styles too.
			</p>
			<spartan-code class="mb-6 mt-4" code="@import '@angular/cdk/overlay-prebuilt.css';" />
			<p class="${hlmP}">
				Also, make sure to check out the theming section to better understand the convention behind them and learn how
				to customize your theme.
			</p>

			<spartan-section-sub-heading id="adding-primitives">Adding primitives</spartan-section-sub-heading>
			<p class="${hlmP}">
				With the Nx plugin, adding primitives is as simple as running a single command. It will allow you to pick and
				choose which primitives to add to your project. It will add all brain dependencies and copy helm code into its
				own library:
			</p>
			<spartan-cli-tabs class="mb-6 mt-4" nxCode="npx nx g @spartan-ng/cli:ui" ngCode="ng g @spartan-ng/cli:ui" />
			<p class="${hlmP}">To learn more about the command line interface check out the docs below.</p>
			<div class="my-2 flex items-center justify-end">
				<a routerLink="/documentation/cli" variant="outline" size="sm" hlmBtn outline="">
					CLI documentation
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="theming" label="Theming" />
				<spartan-page-bottom-nav-link direction="previous" href="/stack" label="Stack" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class InstallationPageComponent {}
