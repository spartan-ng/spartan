import type { RouteMeta } from '@analogjs/router';
import { InstallTabs } from '@spartan-ng/app/app/shared/layout/install-tabs';

import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodeRtlPreview } from '@spartan-ng/app/app/shared/code/code-rtl-preview';
import { RtlHeader } from '@spartan-ng/app/app/shared/code/rtl-header';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { AccordionBorders } from './accordion--borders.example';
import { AccordionCard } from './accordion--card.example';
import { AccordionDisabled } from './accordion--disabled.example';
import { AccordionMultiple } from './accordion--multiple.example';
import { AccordionRtl } from './accordion--rtl.example';
import { AccordionPreview, defaultImports, defaultSkeleton } from './accordion.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Accordion', api: 'accordion' },
	meta: metaWith(
		'spartan/ui - Accordion',
		'A vertically stacked set of interactive headings that each reveal a section of content.',
	),
	title: 'spartan/ui - Accordion',
};

@Component({
	selector: 'spartan-accordion',
	imports: [
		MainSection,
		InstallTabs,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,

		AccordionPreview,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		UIApiDocs,
		SectionSubSubHeading,
		InstallTabs,
		RtlHeader,
		CodeRtlPreview,
		AccordionMultiple,
		AccordionBorders,
		AccordionCard,
		AccordionDisabled,
		AccordionRtl,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Accordion"
				lead="A vertically stacked set of interactive headings that each reveal a section of content."
				showThemeToggle
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-accordion-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-install-tabs primitive="accordion" [showOnlyVega]="false" />

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_imports" />
				<spartan-code [code]="_skeleton" />
			</div>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__multiple" spartanH4>Multiple</h3>
			<p class="${hlmP}">
				The
				<code class="${hlmCode}">type</code>
				input can be set to 'multiple' to allow multiple items to be opened at the same time.
			</p>
			<p class="${hlmP}">
				The
				<code class="${hlmCode}">isOpened</code>
				input can be used to set the initial state of an accordion item.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-accordion-multiple />
				</div>
				<spartan-code secondTab [code]="_multipleCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<p class="${hlmP}">
				Use the
				<code class="${hlmCode}">disabled</code>
				prop on the
				<code class="${hlmCode}">hlm-accordion-item</code>
				to disable an item.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-accordion-disabled />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="examples__borders" spartanH4>Borders</h3>
			<p class="${hlmP}">
				Add
				<code class="${hlmCode}">border</code>
				to the
				<code class="${hlmCode}">hlm-accordion</code>
				and
				<code class="${hlmCode}">border-b last:border-b-0</code>
				to the
				<code class="${hlmCode}">hlm-accordion-item</code>
				to add borders to the items.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-accordion-borders />
				</div>
				<spartan-code secondTab [code]="_bordersCode()" />
			</spartan-tabs>

			<h3 id="examples__card" spartanH4>Card</h3>
			<p class="${hlmP}">
				Wrap the
				<code class="${hlmCode}">hlm-accordion</code>
				inside a
				<code class="${hlmCode}">hlm-card</code>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-accordion-card />
				</div>
				<spartan-code secondTab [code]="_cardCode()" />
			</spartan-tabs>

			<spartan-header-rtl />
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanRtlCodePreview firstTab>
					<spartan-accordion-rtl />
				</div>
				<spartan-code secondTab [code]="_rtlCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="alert" label="Alert" />
				<spartan-page-bottom-nav-link direction="previous" href="/components" label="Components" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AccordionPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('accordion');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _multipleCode = computed(() => this._snippets()['multiple']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _bordersCode = computed(() => this._snippets()['borders']);
	protected readonly _cardCode = computed(() => this._snippets()['card']);
	protected readonly _rtlCode = computed(() => this._snippets()['rtl']);
	protected readonly _imports = defaultImports;
	protected readonly _skeleton = defaultSkeleton;
}
