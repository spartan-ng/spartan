import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
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
import { RadioGroupCard } from './radio-group--card.example';
import { RadioGroupFormPreview } from './radio-group--form.example';
import { defaultImports, defaultSkeleton, RadioGroupPreview } from './radio-group.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Radio Group', api: 'radio-group' },
	meta: metaWith(
		'spartan/ui - Radio Group',
		'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.',
	),
	title: 'spartan/ui - Radio Group',
};
@Component({
	selector: 'spartan-radio-group',
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
		RadioGroupPreview,
		RadioGroupPreview,
		RadioGroupCard,
		RadioGroupFormPreview,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Radio Group"
				lead="A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-radio-group-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs nxCode="npx nx g @spartan-ng/cli:ui radio-group" ngCode="ng g @spartan-ng/cli:ui radio-group" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__card_layout" spartanH4>Card Layout</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-radio-card-preview />
				</div>
				<spartan-code secondTab [code]="_cardCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-radio-group-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="resizable" label="Resizable" />
				<spartan-page-bottom-nav-link direction="previous" href="progress" label="Progress" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class LabelPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('radio-group');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _cardCode = computed(() => this._snippets()['card']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
