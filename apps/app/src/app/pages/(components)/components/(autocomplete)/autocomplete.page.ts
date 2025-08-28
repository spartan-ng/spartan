import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { hlmH4, hlmP } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { link } from '../../../../shared/typography/link';

import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { Tabs } from '../../../../shared/layout/tabs';
import { metaWith } from '../../../../shared/meta/meta.util';
import { AutocompleteAsync } from './autocomplete--async.example';
import { AutocompleteForm } from './autocomplete--form.example';
import { AutocompletePreview, defaultImports, defaultSkeleton } from './autocomplete.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Autocomplete', api: 'autocomplete' },
	meta: metaWith('spartan/ui - Autocomplete', 'Autocomplete input and dropdown selection with filtering options.'),
	title: 'spartan/ui - Autocomplete',
};

@Component({
	selector: 'spartan-autocomplete',
	imports: [
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
		UIApiDocs,
		AutocompletePreview,
		AutocompleteAsync,
		AutocompleteForm,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Autocomplete"
				lead="Autocomplete input and dropdown selection with filtering options."
			/>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<p class="${hlmP} mb-6">
				The Autocomplete component is built with the
				<a routerLink="/components/popover" hlmBtn variant="link" class="${link}">Popover</a>
				and the
				<a routerLink="/components/command" hlmBtn variant="link" class="${link}">Command</a>
				components.
			</p>

			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui autocomplete"
				ngCode="ng g @spartan-ng/cli:ui autocomplete"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__async" class="${hlmH4} mb-2 mt-6">Asynchronous</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-async />
				</div>
				<spartan-code secondTab [code]="_asyncCode()" />
			</spartan-tabs>

			<h3 id="examples__form" class="${hlmH4} mb-2 mt-6">Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="command" label="Command" />
				<spartan-page-bottom-nav-link direction="previous" href="collapsible" label="Collapsible" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AutocompletePage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('autocomplete');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _asyncCode = computed(() => this._snippets()['async']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
