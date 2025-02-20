import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import {} from '@spartan-ng/ui-icon-helm';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodeComponent } from '../../../shared/code/code.component';
import { MainSectionDirective } from '../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../shared/layout/section-sub-heading.component';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'components.json' },
	meta: metaWith('spartan - components.json', 'Manage the spartan configuration through components.json.'),
	title: 'spartan - components.json',
};

@Component({
	selector: 'spartan-components-json',
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		SectionSubHeadingComponent,
		CodeComponent,
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

			<spartan-section-sub-heading id="generation">Configuration</spartan-section-sub-heading>

			<h3 id="componentsPath" class="${hlmH4} mt-12">componentsPath</h3>

			<p class="${hlmP}">The base path where your components will be generated.</p>
			<spartan-code
				class="mt-3"
				language="js"
				code='
{
	"componentsPath": "libs/ui"
}'
			/>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="changelog" label="Changelog" />
				<spartan-page-bottom-nav-link direction="previous" href="cli" label="CLI" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class ComponentsJsonPageComponent {}
