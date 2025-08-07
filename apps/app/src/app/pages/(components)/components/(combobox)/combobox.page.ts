import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { hlmCode, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';

import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';

import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { Tabs } from '../../../../shared/layout/tabs';
import { metaWith } from '../../../../shared/meta/meta.util';
import { ComboboxPreview } from './combobox.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Combobox' },
	meta: metaWith('spartan/ui - Combobox', 'Autocomplete input and command palette with a list of suggestions.'),
	title: 'spartan/ui - Combobox',
};

@Component({
	selector: 'spartan-combobox',
	imports: [
		MainSection,
		Code,
		SectionIntro,
		SectionSubHeading,
		Tabs,
		CodePreview,
		PageNav,
		PageBottomNav,
		PageBottomNavLink,
		ComboboxPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Combobox"
				lead="Autocomplete input and command palette with a list of suggestions."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP}">
				The Combobox is built using a composition of the
				<code class="${hlmCode}">brn-popover</code>
				and the
				<code class="${hlmCode}">brn-command</code>
				components.
			</p>
			<p class="${hlmP}">See installation instructions for the Popover and the Command components.</p>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultCode()" />
			</div>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="command" label="Command" />
				<spartan-page-bottom-nav-link direction="previous" href="collapsible" label="Collapsible" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ComboboxPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('combobox');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
}
