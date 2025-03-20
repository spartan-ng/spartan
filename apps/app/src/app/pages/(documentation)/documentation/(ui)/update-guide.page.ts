import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '@spartan-ng/app/app/shared/layout/section-intro.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Update Guide' },
	meta: metaWith('spartan - Update Guide', 'Keep your components up to date.'),
	title: 'spartan - Update Guide',
};

@Component({
	selector: 'spartan-update-guide',
	standalone: true,
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		TabsCliComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Update Guide" lead="Keep your components up to date." />
			<section>
				<p class="${hlmP}">
					Spartan consists of two main parts: Helm and Brain. Brain is published to NPM, while Helm projects reside
					within your repository.
				</p>

				<p class="${hlmP}">
					To update Brain, you can simply use your preferred package manager. However, we recommend using our
					Healthcheck tool to ensure that any automated migrations are applied.
				</p>

				<p class="${hlmP}">
					Updating Helm can also be automated using our
					<code class="${hlmCode}">migrate-helm-libraries</code>
					schematic. If you have made manual changes to your components, you may need to update them manually. The
					schematic can replace your components with the latest version, but note that any customizations will be lost.
				</p>

				<spartan-cli-tabs
					class="mb-6 mt-4"
					nxCode="nx g @spartan-ng/cli:migrate-helm-libraries"
					ngCode="ng g @spartan-ng/cli:migrate-helm-libraries"
				/>
			</section>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/components" label="Components" />
				<spartan-page-bottom-nav-link direction="previous" href="health-checks" label="Health Checks" />
			</spartan-page-bottom-nav>
		</section>

		<spartan-page-nav />
	`,
})
export default class UpdateGuidePageComponent {}
