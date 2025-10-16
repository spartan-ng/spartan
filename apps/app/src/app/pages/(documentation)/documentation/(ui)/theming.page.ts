import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmCode, hlmCode, hlmP } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Theming' },
	meta: metaWith('spartan - Theming', 'Using CSS Variables for theming.'),
	title: 'spartan - Theming',
};

@Component({
	selector: 'spartan-theming',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		Code,
		HlmAlertImports,
		HlmCode,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Theming" lead="Using CSS Variables for theming." />

			<div hlmAlert variant="destructive" class="mt-6">
				<h4 hlmAlertTitle>We recommend using Tailwind CSS version 4.</h4>
				<div hlmAlertDescription>
					<p>
						Please note that we cannot guarantee full compatibility of the components with Tailwind CSS version 3, and
						some features may not function as expected.
					</p>
				</div>
			</div>

			<p class="${hlmP}">
				<code class="${hlmCode}">spartan/ui</code>
				is built on TailwindCSS with custom CSS variables:
			</p>
			<spartan-code class="mt-6" code='<div class="bg-background text-foreground">spartan</div>' />

			<spartan-section-sub-heading id="convention">Convention</spartan-section-sub-heading>

			<p class="${hlmP}">
				As shadcn, we use a simple
				<code class="${hlmCode}">background</code>
				and
				<code class="${hlmCode}">foreground</code>
				convention for colors. The
				<code class="${hlmCode}">background</code>
				variable is used for the background color of the component and the
				<code class="${hlmCode}">foreground</code>
				variable is used for the text color.
			</p>
			<div class="mt-6" hlmAlert>
				<div hlmAlertDescription>
					<p>
						The
						<code class="${hlmCode}">background</code>
						suffix is omitted when the variable is used for the background color of the component.
					</p>
				</div>
			</div>
			<p class="${hlmP}">Given the following CSS variables:</p>
			<spartan-code
				class="mt-6"
				code="
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
"
			/>
			<p class="${hlmP}">
				The
				<code class="${hlmCode}">background</code>
				color of the following component will be
				<code class="${hlmCode}">hsl(var(--primary))</code>
				and the
				<code class="${hlmCode}">foreground</code>
				color will be
				<code class="${hlmCode}">hsl(var(--primary-foreground))</code>
				.
			</p>
			<spartan-code class="mt-6" code='<div class="bg-primary text-primary-foreground">Hello</div>' />
			<div class="mt-6 text-sm" hlmAlert>
				<div hlmAlertDescription>
					<p>
						<span class="font-semibold">CSS variables must be defined without color space function.</span>
						See the
						<a
							class="font-medium underline"
							href="https://tailwindcss.com/docs/customizing-colors#using-css-variables"
							target="_blank"
						>
							Tailwind CSS documentation
						</a>
						for more information.
					</p>
				</div>
			</div>

			<spartan-section-sub-heading id="list-of-variables">List of variables</spartan-section-sub-heading>

			<p class="${hlmP}">Here's the list of variables available for customization:</p>

			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=":root {
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

			<spartan-section-sub-heading id="list-of-variables">Adding new colors</spartan-section-sub-heading>

			<p class="${hlmP}">To add new colors, you need to add them to your CSS file.</p>

			<spartan-code
				fileName="styles.css"
				code=":root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}"
			/>
			<p class="${hlmP}">
				You can now use the
				<span hlmCode>warning</span>
				utility class in your components.
			</p>

			<spartan-code code='<div class="bg-warning text-warning-foreground"</div>' />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dark-mode" label="Dark Mode" />
				<spartan-page-bottom-nav-link direction="previous" href="installation" label="Installation" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ThemingPage {}
