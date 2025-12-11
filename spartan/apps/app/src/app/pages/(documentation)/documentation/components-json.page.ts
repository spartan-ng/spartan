import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../shared/code/code';
import { MainSection } from '../../../shared/layout/main-section';
import { PageBottomNav } from '../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../shared/layout/section-sub-heading';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'components.json' },
	meta: metaWith('spartan - components.json', 'Manage the spartan configuration through components.json.'),
	title: 'spartan - components.json',
};

@Component({
	selector: 'spartan-components-json',
	imports: [
		MainSection,
		SectionIntro,
		PageBottomNav,
		PageBottomNavLink,
		PageNav,
		SectionSubHeading,
		Code,
		SectionSubSubHeading,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="components.json" lead="Manage the spartan configuration through components.json." />
			<p class="${hlmP}">
				Your custom configuration for the spartan CLI is stored in a file called
				<code class="${hlmCode}">components.json</code>
				and is located in the root of your workspace.
			</p>

			<p class="${hlmP}">
				<strong>Note</strong>
				: this file is only required by the spartan CLI. If you're manually copy & pasting components, you can ignore
				this file.
			</p>

			<spartan-section-sub-heading id="generation">File Generation</spartan-section-sub-heading>
			<p class="${hlmP}">
				The
				<code class="${hlmCode}">components.json</code>
				file is generated the first time you use the
				<code class="${hlmCode}">ui</code>
				command.
			</p>

			<spartan-section-sub-heading id="nx-configuration">NX Workspace Configuration</spartan-section-sub-heading>

			<spartan-code
				class="mt-3"
				language="js"
				code='
{
	"componentsPath": "libs/ui",
	"importAlias": "@spartan-ng/helm",
	"buildable": true,
	"generateAs": "library" | "entrypoint"
}'
			/>

			<spartan-section-sub-heading id="ng-configuration">Angular CLI Project Configuration</spartan-section-sub-heading>

			<spartan-code
				class="mt-3"
				language="js"
				code='
{
	"componentsPath": "libs/ui",
	"importAlias": "@spartan-ng/helm",
}'
			/>

			<spartan-section-sub-heading id="configuration">Configuration Flags</spartan-section-sub-heading>

			<h3 id="componentsPath" spartanH4>componentsPath</h3>

			<p class="${hlmP}">The base path where your components will be generated.</p>

			<h3 id="importAlias" spartanH4>importAlias</h3>

			<p class="${hlmP}">Specify the import path of the component e.g. &#64;spartan-ng/helm.</p>

			<h3 id="buildable" spartanH4>buildable (nx only)</h3>

			<p class="${hlmP}">Determines whether the generated library is buildable or not.</p>

			<h3 id="generateAs" spartanH4>generateAs (nx only)</h3>

			<p class="${hlmP}">Generate the components as a library or entrypoint.</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="changelog" label="Changelog" />
				<spartan-page-bottom-nav-link direction="previous" href="cli" label="CLI" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class sJsonPage {}
