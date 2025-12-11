import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { Code } from '@spartan-ng/app/app/shared/code/code';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { PageBottomNav } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav';
import { SectionIntro } from '@spartan-ng/app/app/shared/layout/section-intro';
import { SectionSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-heading';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';

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
		SectionSubSubHeading,
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
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.985 0 0);
  --sidebar-primary-foreground: oklch(0.205 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
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

			<spartan-section-sub-heading id="base-colors">Base Colors</spartan-section-sub-heading>

			<h3 id="color-neutral" spartanH4>Neutral</h3>

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
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.985 0 0);
  --sidebar-primary-foreground: oklch(0.205 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}"
			/>

			<h3 id="color-stone" spartanH4>Stone</h3>

			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=":root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.147 0.004 49.25);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.147 0.004 49.25);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.147 0.004 49.25);
  --primary: oklch(0.216 0.006 56.043);
  --primary-foreground: oklch(0.985 0.001 106.423);
  --secondary: oklch(0.97 0.001 106.424);
  --secondary-foreground: oklch(0.216 0.006 56.043);
  --muted: oklch(0.97 0.001 106.424);
  --muted-foreground: oklch(0.553 0.013 58.071);
  --accent: oklch(0.97 0.001 106.424);
  --accent-foreground: oklch(0.216 0.006 56.043);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.923 0.003 48.717);
  --input: oklch(0.923 0.003 48.717);
  --ring: oklch(0.709 0.01 56.259);
  --sidebar: oklch(0.985 0.001 106.423);
  --sidebar-foreground: oklch(0.147 0.004 49.25);
  --sidebar-primary: oklch(0.216 0.006 56.043);
  --sidebar-primary-foreground: oklch(0.985 0.001 106.423);
  --sidebar-accent: oklch(0.97 0.001 106.424);
  --sidebar-accent-foreground: oklch(0.216 0.006 56.043);
  --sidebar-border: oklch(0.923 0.003 48.717);
  --sidebar-ring: oklch(0.709 0.01 56.259);
}

.dark {
  --background: oklch(0.147 0.004 49.25);
  --foreground: oklch(0.985 0.001 106.423);
  --card: oklch(0.216 0.006 56.043);
  --card-foreground: oklch(0.985 0.001 106.423);
  --popover: oklch(0.216 0.006 56.043);
  --popover-foreground: oklch(0.985 0.001 106.423);
  --primary: oklch(0.923 0.003 48.717);
  --primary-foreground: oklch(0.216 0.006 56.043);
  --secondary: oklch(0.268 0.007 34.298);
  --secondary-foreground: oklch(0.985 0.001 106.423);
  --muted: oklch(0.268 0.007 34.298);
  --muted-foreground: oklch(0.709 0.01 56.259);
  --accent: oklch(0.268 0.007 34.298);
  --accent-foreground: oklch(0.985 0.001 106.423);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.553 0.013 58.071);
  --sidebar: oklch(0.216 0.006 56.043);
  --sidebar-foreground: oklch(0.985 0.001 106.423);
  --sidebar-primary: oklch(0.985 0.001 106.423);
  --sidebar-primary-foreground: oklch(0.216 0.006 56.043);
  --sidebar-accent: oklch(0.268 0.007 34.298);
  --sidebar-accent-foreground: oklch(0.985 0.001 106.423);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.553 0.013 58.071);
}"
			/>

			<h3 id="color-zinc" spartanH4>Zinc</h3>

			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=":root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.21 0.006 285.885);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.705 0.015 286.067);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.985 0 0);
  --sidebar-primary-foreground: oklch(0.21 0.006 285.885);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.552 0.016 285.938);
}"
			/>

			<h3 id="color-gray" spartanH4>Gray</h3>

			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=":root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.13 0.028 261.692);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.13 0.028 261.692);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.13 0.028 261.692);
  --primary: oklch(0.21 0.034 264.665);
  --primary-foreground: oklch(0.985 0.002 247.839);
  --secondary: oklch(0.967 0.003 264.542);
  --secondary-foreground: oklch(0.21 0.034 264.665);
  --muted: oklch(0.967 0.003 264.542);
  --muted-foreground: oklch(0.551 0.027 264.364);
  --accent: oklch(0.967 0.003 264.542);
  --accent-foreground: oklch(0.21 0.034 264.665);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.928 0.006 264.531);
  --input: oklch(0.928 0.006 264.531);
  --ring: oklch(0.707 0.022 261.325);
  --sidebar: oklch(0.985 0.002 247.839);
  --sidebar-foreground: oklch(0.13 0.028 261.692);
  --sidebar-primary: oklch(0.21 0.034 264.665);
  --sidebar-primary-foreground: oklch(0.985 0.002 247.839);
  --sidebar-accent: oklch(0.967 0.003 264.542);
  --sidebar-accent-foreground: oklch(0.21 0.034 264.665);
  --sidebar-border: oklch(0.928 0.006 264.531);
  --sidebar-ring: oklch(0.707 0.022 261.325);
}

.dark {
  --background: oklch(0.13 0.028 261.692);
  --foreground: oklch(0.985 0.002 247.839);
  --card: oklch(0.21 0.034 264.665);
  --card-foreground: oklch(0.985 0.002 247.839);
  --popover: oklch(0.21 0.034 264.665);
  --popover-foreground: oklch(0.985 0.002 247.839);
  --primary: oklch(0.928 0.006 264.531);
  --primary-foreground: oklch(0.21 0.034 264.665);
  --secondary: oklch(0.278 0.033 256.848);
  --secondary-foreground: oklch(0.985 0.002 247.839);
  --muted: oklch(0.278 0.033 256.848);
  --muted-foreground: oklch(0.707 0.022 261.325);
  --accent: oklch(0.278 0.033 256.848);
  --accent-foreground: oklch(0.985 0.002 247.839);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --sidebar: oklch(0.21 0.034 264.665);
  --sidebar-foreground: oklch(0.985 0.002 247.839);
  --sidebar-primary: oklch(0.985 0.002 247.839);
  --sidebar-primary-foreground: oklch(0.21 0.034 264.665);
  --sidebar-accent: oklch(0.278 0.033 256.848);
  --sidebar-accent-foreground: oklch(0.985 0.002 247.839);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}"
			/>

			<h3 id="color-slate" spartanH4>Slate</h3>

			<spartan-code
				class="mt-6"
				fileName="styles.css"
				code=":root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.984 0.003 247.858);
  --sidebar-primary-foreground: oklch(0.208 0.042 265.755);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}"
			/>

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
