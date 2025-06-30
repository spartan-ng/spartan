import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { CodePreviewDirective } from '../../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../../shared/code/code.component';
import { MainSectionDirective } from '../../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../../shared/layout/section-sub-heading.component';
import { TabsCliComponent } from '../../../../shared/layout/tabs-cli.component';
import { TabsComponent } from '../../../../shared/layout/tabs.component';
import { UIApiDocsComponent } from '../../../../shared/layout/ui-docs-section/ui-docs-section.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { SelectMultiplePreviewComponent } from './select--multiple.preview';
import { SelectScrollablePreviewComponent } from './select--scrollable.preview';
import { SelectValueTemplatePreviewComponent } from './select--value-template.preview';
import { defaultCode, selectMultipleCode, selectScrollableCode, selectValueTemplateCode } from './select.generated';
import { SelectPreviewComponent, defaultImports, defaultSkeleton, defaultStyles } from './select.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Select', api: 'select' },
	meta: metaWith('spartan/ui - Select', 'A control that allows the user to toggle between checked and not checked.'),
	title: 'spartan/ui - Select',
};
@Component({
	selector: 'spartan-select',
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
		SelectPreviewComponent,
		SelectMultiplePreviewComponent,
		SelectScrollablePreviewComponent,
		SelectValueTemplatePreviewComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Select" lead="Select a value from a list of options." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-select-preview />
				</div>
				<spartan-code secondTab [code]="defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui select"
				ngCode="ng g @spartan-ng/cli:ui select"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="defaultImports" />
				<spartan-code [code]="defaultSkeleton" />
				<spartan-code [code]="defaultStyles" />
			</div>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__multiple" class="${hlmH4} mb-2 mt-6">Multiple</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-select-multiple-preview />
				</div>
				<spartan-code secondTab [code]="multipleCode" />
			</spartan-tabs>
			<h3 id="examples__scrollable" class="${hlmH4} mb-2 mt-6">Scrollable with Groups</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-select-scrollable-preview />
				</div>
				<spartan-code secondTab [code]="scrollableCode" />
			</spartan-tabs>

			<h3 id="examples__value-template" class="${hlmH4} mb-2 mt-6">Value Template</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-select-value-template-preview />
				</div>
				<spartan-code secondTab [code]="valueTemplateCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="separator" label="Separator" />
				<spartan-page-bottom-nav-link direction="previous" href="scroll-area" label="Scroll Area" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SkeletonPageComponent {
	protected readonly defaultCode = defaultCode;
	protected readonly defaultSkeleton = defaultSkeleton;
	protected readonly defaultImports = defaultImports;
	protected readonly defaultStyles = defaultStyles;
	protected readonly multipleCode = selectMultipleCode;
	protected readonly scrollableCode = selectScrollableCode;
	protected readonly valueTemplateCode = selectValueTemplateCode;
}
