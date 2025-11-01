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
	meta: metaWith('spartan - Theming', 'Customize colors with CSS variables'),
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
			<spartan-section-intro
				name="Theming"
				lead="Customize your design system with CSS variables. No theming API required."
			/>

			<p class="${hlmP}">
				spartan/ui uses CSS variables for theming. Change colors across your entire application by updating values in
				your
				<code class="${hlmCode}">styles.css</code>
				file - no component props, no complex configuration.
			</p>

			<spartan-code class="mt-6" code='<div class="bg-background text-foreground">Themed content</div>' />

			<spartan-section-sub-heading id="how-it-works">How it works</spartan-section-sub-heading>

			<p class="${hlmP}">
				CSS variables are defined in your
				<code class="${hlmCode}">styles.css</code>
				and referenced in Tailwind utility classes. Update the variable, and every component using that color updates
				automatically.
			</p>

			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=":root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}"
			/>

			<p class="${hlmP}">Use the color in your markup with Tailwind classes:</p>

			<spartan-code class="mt-6" code='<button class="bg-primary text-primary-foreground">Click me</button>' />

			<spartan-section-sub-heading id="convention">Color naming convention</spartan-section-sub-heading>

			<p class="${hlmP}">
				spartan follows a
				<code class="${hlmCode}">background</code>
				and
				<code class="${hlmCode}">foreground</code>
				convention for semantic color pairs. Each background color has a corresponding foreground color for text that
				sits on top of it.
			</p>

			<div class="mt-6 grid gap-4 md:grid-cols-2">
				<div>
					<p class="mb-2 text-sm font-semibold">Background colors:</p>
					<ul class="space-y-1 text-sm">
						<li><code class="${hlmCode}">bg-primary</code></li>
						<li><code class="${hlmCode}">bg-secondary</code></li>
						<li><code class="${hlmCode}">bg-destructive</code></li>
						<li><code class="${hlmCode}">bg-muted</code></li>
					</ul>
				</div>
				<div>
					<p class="mb-2 text-sm font-semibold">Foreground colors:</p>
					<ul class="space-y-1 text-sm">
						<li><code class="${hlmCode}">text-primary-foreground</code></li>
						<li><code class="${hlmCode}">text-secondary-foreground</code></li>
						<li><code class="${hlmCode}">text-destructive-foreground</code></li>
						<li><code class="${hlmCode}">text-muted-foreground</code></li>
					</ul>
				</div>
			</div>

			<div class="mt-6" hlmAlert>
				<div hlmAlertDescription>
					<p>
						The
						<code class="${hlmCode}">-background</code>
						suffix is omitted from CSS variable names. The variable
						<code class="${hlmCode}">--primary</code>
						maps to the class
						<code class="${hlmCode}">bg-primary</code>
						.
					</p>
				</div>
			</div>

			<spartan-section-sub-heading id="available-variables">Available variables</spartan-section-sub-heading>

			<p class="${hlmP}">
				Here are all CSS variables you can customize. Define them in
				<code class="${hlmCode}">:root</code>
				for light mode and
				<code class="${hlmCode}">.dark</code>
				for dark mode:
			</p>

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

			<div class="mt-6 text-sm" hlmAlert>
				<div hlmAlertDescription>
					<p>
						<span class="font-semibold">Use OKLCH without the color space function.</span>
						Define variables as
						<code class="${hlmCode}">oklch(0.5 0.2 180)</code>
						, not
						<code class="${hlmCode}">oklch(0.5, 0.2, 180)</code>
						. See the
						<a
							class="font-medium underline"
							href="https://tailwindcss.com/docs/customizing-colors#using-css-variables"
							target="_blank"
						>
							Tailwind documentation
						</a>
						for details.
					</p>
				</div>
			</div>

			<spartan-section-sub-heading id="adding-colors">Adding custom colors</spartan-section-sub-heading>

			<p class="${hlmP}">Add new semantic colors by defining the CSS variable and registering it with Tailwind:</p>

			<spartan-code
				class="mt-6"
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

			<p class="${hlmP}">Use the new color with Tailwind classes:</p>

			<spartan-code class="mt-6" code='<div class="bg-warning text-warning-foreground">Warning message</div>' />

			<spartan-section-sub-heading id="tailwind-version">Tailwind CSS version</spartan-section-sub-heading>

			<div hlmAlert variant="destructive" class="mt-4 mb-6">
				<h4 hlmAlertTitle>Use Tailwind CSS v4</h4>
				<div hlmAlertDescription>
					<p>
						spartan/ui is optimized for Tailwind CSS v4. Some theming features may not work correctly with v3. We
						recommend
						<a href="https://tailwindcss.com/docs/upgrade-guide" target="_blank" class="font-medium underline">
							upgrading to v4
						</a>
						for the best experience.
					</p>
				</div>
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dark-mode" label="Dark Mode" />
				<spartan-page-bottom-nav-link direction="previous" href="installation" label="Installation" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ThemingPage {}
