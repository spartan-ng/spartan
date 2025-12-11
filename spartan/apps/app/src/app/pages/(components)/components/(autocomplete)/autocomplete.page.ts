import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { CodePreview } from '../../../../shared/code/code-preview';
import { MainSection } from '../../../../shared/layout/main-section';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { link } from '../../../../shared/typography/link';

import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Tabs } from '../../../../shared/layout/tabs';
import { metaWith } from '../../../../shared/meta/meta.util';
import { AutocompleteAsync } from './autocomplete--async.example';
import { AutocompleteConfig } from './autocomplete--config.example';
import { AutocompleteCountries } from './autocomplete--countries.example';
import { AutocompleteForm } from './autocomplete--form.example';
import { AutocompleteTransformOptionValue } from './autocomplete--transform-option-value.example';
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
		AutocompleteCountries,
		AutocompleteConfig,
		RouterLink,
		HlmButtonImports,
		SectionSubSubHeading,
		AutocompleteTransformOptionValue,
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

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__custom_config" spartanH4>Custom Config</h3>

			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">provideHlmAutocompleteConfig</code>
				to define custom configurations for the autocomplete component. This is especially useful when the
				autocomplete's
				<code class="${hlmCode}">filteredOptions</code>
				contain objects rather than plain strings.
			</p>
			<ul class="${hlmUl}">
				<li>
					<code class="${hlmCode}">transformOptionToString: (option: T) => string;</code>
					defines how an option should be transformed into the string displayed in the dropdown list.
				</li>
				<li>
					<code class="${hlmCode}">transformValueToSearch: (option: T) => string;</code>
					defines how the selected option should be transformed into the string written to the search input.
				</li>
			</ul>

			<p class="${hlmP}">
				You can customize a specific instance of
				<code class="${hlmCode}">hlm-autocomplete</code>
				by passing
				<code class="${hlmCode}">transformOptionToString</code>
				and
				<code class="${hlmCode}">transformValueToSearch</code>
				directly as inputs. This allows you to modify the behavior for just that instance, without affecting all
				autocompletes configured via
				<code class="${hlmCode}">provideHlmAutocompleteConfig</code>
				.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-config />
				</div>
				<spartan-code secondTab [code]="_configCode()" />
			</spartan-tabs>

			<h3 id="examples__custom_option_template" spartanH4>Custom Option Template</h3>

			<p class="${hlmP} mb-6">
				You can customize the rendering of each option in the dropdown list by using the
				<code class="${hlmCode}">ng-template</code>
				with the
				<code class="${hlmCode}">optionTemplate</code>
				input. This is especially useful when
				<code class="${hlmCode}">filteredOptions</code>
				are objects instead of simple strings, or when you want to display additional content such as icons,
				descriptions, or custom formatting alongside the option text.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-countries />
				</div>
				<spartan-code secondTab [code]="_countriesCode()" />
			</spartan-tabs>

			<h3 id="examples__async" spartanH4>Asynchronous</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-async />
				</div>
				<spartan-code secondTab [code]="_asyncCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-form />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<h3 id="examples__transform_option_value" spartanH4>Transform option value</h3>

			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">transformOptionToValue</code>
				to transform an object value into a single value and use
				<code class="${hlmCode}">displayWith</code>
				to define how the selected value is displayed in the search input.
			</p>

			<p class="${hlmP}">
				In the following example, a list with
				<code class="${hlmCode}">id: string, label: string</code>
				objects is used as options. The selected option is transformed to its
				<code class="${hlmCode}">id</code>
				using
				<code class="${hlmCode}">transformOptionToValue</code>
				and the label is displayed in the search input using
				<code class="${hlmCode}">displayWith</code>
				.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-autocomplete-transform-option-value />
				</div>
				<spartan-code secondTab [code]="_transformOptionValueCode()" />
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
	protected readonly _countriesCode = computed(() => this._snippets()['countries']);
	protected readonly _configCode = computed(() => this._snippets()['config']);
	protected readonly _asyncCode = computed(() => this._snippets()['async']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _transformOptionValueCode = computed(() => this._snippets()['transformOptionValue']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
