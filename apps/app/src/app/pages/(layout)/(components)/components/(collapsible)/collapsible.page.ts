import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { CodePreviewDirective } from '../../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../../shared/layout/main-section.directive';

import { PageBottomNavLinkComponent } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../../shared/meta/meta.util';
import { defaultCode } from './collapsible.generated';
import { CollapsiblePreviewComponent, defaultImports, defaultSkeleton } from './collapsible.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Collapsible', api: 'collapsible' },
	meta: metaWith('spartan/ui - Collapsible', 'An interactive component which expands/collapses a panel.'),
	title: 'spartan/ui - Collapsible',
};

@Component({
	selector: 'spartan-collapsible',
	imports: [
		UIApiDocsComponent,
		MainSectionDirective,
		CodeComponent,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		TabsComponent,
		TabsCliComponent,
		CodePreviewDirective,
		PageNavComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		CollapsiblePreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Collapsible" lead="An interactive component which expands/collapses a panel." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-collapsible-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui collapsible"
				ngCode="ng g @spartan-ng/cli:ui collapsible"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="combobox" label="Combobox" />
				<spartan-page-bottom-nav-link direction="previous" href="checkbox" label="Checkbox" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CollapsiblePageComponent {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
