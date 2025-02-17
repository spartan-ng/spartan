import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { CodeComponent } from '@spartan-ng/app/app/shared/code/code.component';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '@spartan-ng/app/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '@spartan-ng/app/app/shared/layout/section-sub-heading.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmAlertDirective } from '@spartan-ng/ui-alert-helm';
import { hlmCode, hlmH4, hlmP, hlmSmall } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Theming' },
	meta: metaWith('spartan - Theming', 'Using CSS Variables for theming.'),
	title: 'spartan - Theming',
};

@Component({
	selector: 'spartan-theming',
	standalone: true,
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		SectionSubHeadingComponent,
		CodeComponent,
		HlmAlertDirective,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Theming" lead="Using CSS Variables for theming." />
			<section>
				<p class="${hlmP}">
					<code class="${hlmCode}">spartan/ui</code>
					is built on TailwindCSS with custom CSS variables:
				</p>
				<spartan-code class="mt-4" code='<div class="bg-background text-foreground">spartan</div>' />
			</section>
			<spartan-section-sub-heading id="convention">Convention</spartan-section-sub-heading>
			<section>
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
				<div class="mt-4" hlmAlert>
					The
					<code class="${hlmCode}">background</code>
					suffix is omitted when the variable is used for the background color of the component.
				</div>
				<p class="${hlmP}">Given the following CSS variables:</p>
				<spartan-code
					class="mt-4"
					code="
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;
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
				<spartan-code class="mt-4" code='<div class="bg-primary text-primary-foreground">Hello</div>' />
				<div class="mt-4 text-sm" hlmAlert>
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
			</section>

			<spartan-section-sub-heading id="list-of-variables">List of variables</spartan-section-sub-heading>
			<section>
				<p class="${hlmP}">Here's the list of variables available for customization:</p>
				<div class="mt-4 flex">
					<div class="border-border ml-4 mr-8 w-1 border-r"></div>
					<div class="flex-1">
						<div class="${hlmSmall} mt-8">
							Default background color of &#60;body&#62;,... etc.
							<spartan-code
								class="mt-4"
								code="
--background: 0 0% 100%;
--foreground: 222.2 47.4% 11.2%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Muted backgrounds such as &#60;hlm-skeleton/&#62;
							<spartan-code
								class="mt-4"
								code="
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Background color for &#60;div hlmCard&#62;...&#60;/&#62;
							<spartan-code
								class="mt-4"
								code="
--card: 0 0% 100%;
--card-foreground: 222.2 47.4% 11.2%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Background color for popovers such as &#60;brn-popover&#62;...&#60;/&#62;
							<spartan-code
								class="mt-4"
								code="
--popover: 0 0% 100%;
--popover-foreground: 222.2 47.4% 11.2%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Default border color
							<spartan-code
								class="mt-4"
								code="
--border: 214.3 31.8% 91.4%
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Border color for inputs such as &#60;input hlmInput /&#62;, &#60;textarea hlmInput &#62;...&#60;/&#62;
							<spartan-code
								class="mt-4"
								code="
--input: 214.3 31.8% 91.4%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Primary colors for &#60;button hlmBtn /&#62;
							<spartan-code
								class="mt-4"
								code="
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Secondary colors for &#60;button hlmBtn /&#62;
							<spartan-code
								class="mt-4"
								code="
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Used for accents such as hover effects on &#60;brnMenuItem hlm/&#62;
							<spartan-code
								class="mt-4"
								code="
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;

"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Used for destructive actions such as &#60;button hlmBtn variant="destructive" /&#62;
							<spartan-code
								class="mt-4"
								code="
--destructive: 0 100% 50%;
--destructive-foreground: 210 40% 98%;

"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Used for focus ring
							<spartan-code
								class="mt-4"
								code="
--ring: 215 20.2% 65.1%;
"
							/>
						</div>

						<div class="${hlmSmall} mt-8">
							Border radius for cards, inputs and buttons
							<spartan-code
								class="mt-4"
								code="
--radius: 0.5rem;
"
							/>
						</div>
					</div>
				</div>
			</section>
			<spartan-section-sub-heading id="new-colors">Adding new colors</spartan-section-sub-heading>
			<section>
				<p class="${hlmP}">
					To add new colors, you need to add them to your CSS file and to your
					<code class="${hlmCode}">tailwind.config.js</code>
					file.
				</p>
				<h4 class="${hlmH4} mt-6">app/src/styles.css</h4>
				<spartan-code
					class="mt-4"
					code="
:root {
  --warning: 38 92% 50%;
  --warning-foreground: 48 96% 89%;
}

.dark {
  --warning: 48 96% 89%;
  --warning-foreground: 38 92% 50%;
}
"
				/>
				<h4 class="${hlmH4} mt-6">tailwind.config.js</h4>
				<spartan-code
					class="mt-4"
					code='
module.exports = {
  theme: {
    extend: {
      colors: {
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
      },
    },
  },
}
'
				/>
				<p class="${hlmP}">
					You can now use the
					<code class="${hlmCode}">warning</code>
					utility class in your components.
				</p>
				<spartan-code
					class="mt-4"
					code='
        <div class="bg-warning text-warning-foreground">Warning</div>
        '
				/>
			</section>

			<spartan-section-sub-heading id="other-color-formats">Other color formats</spartan-section-sub-heading>
			<section>
				<p class="${hlmP}">
					We recommend using
					<a
						href="https://www.smashingmagazine.com/2021/07/hsl-colors-css/"
						target="_blank"
						class="font-medium underline"
					>
						HSL colors
					</a>
					for theming but you can also use other color formats if you prefer.
				</p>
				<p class="${hlmP}">
					See the
					<a
						href="https://tailwindcss.com/docs/customizing-colors#using-css-variables"
						target="_blank"
						class="font-medium underline"
					>
						Tailwind CSS documentation
					</a>
					for more information on using
					<code class="${hlmCode}">rgb</code>
					,
					<code class="${hlmCode}">rgba</code>
					or
					<code class="${hlmCode}">hsl</code>
					colors.
				</p>
			</section>
			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dark-mode" label="Dark Mode" />
				<spartan-page-bottom-nav-link direction="previous" href="installation" label="Installation" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ThemingPageComponent {}
