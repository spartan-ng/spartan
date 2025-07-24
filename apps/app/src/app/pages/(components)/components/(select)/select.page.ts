import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { SelectMultiplePreview } from './select--multiple.preview';
import { SelectScrollablePreview } from './select--scrollable.preview';
import { SelectValueTemplatePreview } from './select--value-template.preview';
import { defaultCode, selectMultipleCode, selectScrollableCode, selectValueTemplateCode } from './select.generated';
import { SelectPreview, defaultImports, defaultSkeleton, defaultStyles } from './select.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Select', api: 'select' },
	meta: metaWith('spartan/ui - Select', 'A control that allows the user to toggle between checked and not checked.'),
	title: 'spartan/ui - Select',
};
@Component({
	selector: 'spartan-select',
	imports: [
		UIApiDocs,
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		TabsCli,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		SelectPreview,
		SelectMultiplePreview,
		SelectScrollablePreview,
		SelectValueTemplatePreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Select" lead="Select a value from a list of options." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-select-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui select"
				ngCode="ng g @spartan-ng/cli:ui select"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
				<spartan-code [code]="_defaultStyles" />
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
				<spartan-code secondTab [code]="_multipleCode" />
			</spartan-tabs>
			<h3 id="examples__scrollable" class="${hlmH4} mb-2 mt-6">Scrollable with Groups</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-select-scrollable-preview />
				</div>
				<spartan-code secondTab [code]="_scrollableCode" />
			</spartan-tabs>

			<h3 id="examples__value-template" class="${hlmH4} mb-2 mt-6">Value Template</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-select-value-template-preview />
				</div>
				<spartan-code secondTab [code]="_valueTemplateCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="separator" label="Separator" />
				<spartan-page-bottom-nav-link direction="previous" href="scroll-area" label="Scroll Area" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class SkeletonPage {
	protected readonly _defaultCode = defaultCode;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultStyles = defaultStyles;
	protected readonly _multipleCode = selectMultipleCode;
	protected readonly _scrollableCode = selectScrollableCode;
	protected readonly _valueTemplateCode = selectValueTemplateCode;
}
