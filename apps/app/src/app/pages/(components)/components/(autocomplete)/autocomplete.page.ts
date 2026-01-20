import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { HlmButtonImports } from '@spartan-ng/helm/button';
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
import { metaWith } from '../../../../shared/meta/meta.util';
import { link } from '../../../../shared/typography/link';
import { AutocompleteAsyncPreview } from './autocomplete--async.preview';
import { AutocompleteClearPreview } from './autocomplete--clear.preview';
import { AutocompleteCountries } from './autocomplete--countries.example';
import { AutocompleteDisabledPreview } from './autocomplete--disabled.preview';
import { AutocompleteFormPreview } from './autocomplete--form.preview';
import { AutocompleteGroupSeparatorPreview } from './autocomplete--group-separator.preview';
import { AutocompleteGroupPreview } from './autocomplete--group.preview';
import { AutocompleteSearchFormPreview } from './autocomplete--search-form.preview';
import { AutocompleteSearchPreview } from './autocomplete--search.preview';
import {
	autocompleteDefaultConfig,
	AutocompletePreview,
	defaultImports,
	defaultSkeleton,
} from './autocomplete.preview';

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
		RouterLink,
		HlmButtonImports,
		SectionSubSubHeading,
		AutocompleteAsyncPreview,
		AutocompleteFormPreview,
		AutocompleteCountries,
		AutocompleteGroupPreview,
		AutocompleteGroupSeparatorPreview,
		AutocompleteClearPreview,
		AutocompleteDisabledPreview,
		AutocompleteSearchPreview,
		AutocompleteSearchFormPreview,
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
				component.
			</p>

			<spartan-cli-tabs
				nxCode="npx nx g @spartan-ng/cli:ui autocomplete"
				ngCode="ng g @spartan-ng/cli:ui autocomplete"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="configuration">Configuration</spartan-section-sub-heading>

			<p class="${hlmP} mb-6">
				The autocomplete can be configured via
				<code class="${hlmCode}">provideBrnAutocompleteConfig</code>
				or by passing the individual config as input. This is the default autocomplete config:
			</p>

			<spartan-code [code]="_autocompleteDefaultConfig" />

			<h3 id="config_objects" spartanH4>Objects</h3>

			<p class="${hlmP}">
				The autocomplete works out of the box with
				<code class="${hlmCode}">string</code>
				values and objects in the shape of
				<code class="${hlmCode}">&lcub; label: string; value: string; &rcub;</code>
				, the label (1) or the value (2) will be used automatically. For other object shapes provide a custom
				<code class="${hlmCode}">itemToString</code>
				function to extract the label from the object.
			</p>

			<p class="${hlmP}">
				Provide a custom
				<code class="${hlmCode}">isItemEqualToValue</code>
				function to determine if an autocomplete item value matches the current selected value. Defaults to
				<code class="${hlmCode}">Object.is</code>
				comparison.
			</p>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__clear" spartanH4>With Clear Button</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-clear-preview />
				</div>
				<spartan-code secondTab [code]="_clearCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-disabled-preview />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="examples__group" spartanH4>With Groups</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples__group_separator" spartanH4>With Group and Separators</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-group-separator-preview />
				</div>
				<spartan-code secondTab [code]="_groupSeparatorCode()" />
			</spartan-tabs>

			<h3 id="examples__object_values" spartanH4>Object values</h3>
			<p class="${hlmP} mb-6">
				Customize the selected value for object values by providing a custom
				<code class="${hlmCode}">itemToString</code>
				function.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-countries />
				</div>
				<spartan-code secondTab [code]="_countriesCode()" />
			</spartan-tabs>

			<h3 id="examples__search" spartanH4>Free-form text</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">hlm-autocomplete-search</code>
				to allow free-form text input along with option selection. The selected option is transformed to string via
				<code class="${hlmCode}">itemToString</code>
				.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-search-preview />
				</div>
				<spartan-code secondTab [code]="_searchCode()" />
			</spartan-tabs>

			<h3 id="examples__async_search" spartanH4>Async search</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-async-preview />
				</div>
				<spartan-code secondTab [code]="_asyncCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-form-preview />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<h3 id="examples__search_form" spartanH4>Form (Free-form text)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-search-form-preview />
				</div>
				<spartan-code secondTab [code]="_searchFormCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="avatar" label="Avatar" />
				<spartan-page-bottom-nav-link direction="previous" href="aspect-ratio" label="Aspect Ratio" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AutocompletePage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('autocomplete');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _searchCode = computed(() => this._snippets()['search']);
	protected readonly _clearCode = computed(() => this._snippets()['clear']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _groupSeparatorCode = computed(() => this._snippets()['groupSeparator']);
	protected readonly _countriesCode = computed(() => this._snippets()['countries']);
	protected readonly _configCode = computed(() => this._snippets()['config']);
	protected readonly _asyncCode = computed(() => this._snippets()['async']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _searchFormCode = computed(() => this._snippets()['searchForm']);
	protected readonly _transformOptionValueCode = computed(() => this._snippets()['transformOptionValue']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
	protected readonly _autocompleteDefaultConfig = autocompleteDefaultConfig;
}
