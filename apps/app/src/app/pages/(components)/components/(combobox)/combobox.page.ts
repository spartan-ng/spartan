import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
import { hlmCode, hlmP, hlmUl } from '@spartan-ng/helm/typography';
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
import { ComboboxAsyncMultiplePreview } from './combobox--async-multiple.preview';
import { ComboboxAsyncPreview } from './combobox--async.preview';
import { ComboboxClearPreview } from './combobox--clear.preview';
import { ComboboxDisabledPreview } from './combobox--disabled.preview';
import { ComboboxFormMultiplePreview } from './combobox--form-multiple.preview';
import { ComboboxFormPreview } from './combobox--form.preview';
import { ComboboxGroupSeparatorPreview } from './combobox--group-separator.preview';
import { ComboboxGroupPreview } from './combobox--group.preview';
import { ComboboxIconAddonPreview } from './combobox--icon-addon.preview';
import { ComboboxItemToStringPreview } from './combobox--item-to-string.preview';
import { ComboboxMultipleDisabledPreview } from './combobox--multiple-disabled.preview';
import { ComboboxMultiplePreview } from './combobox--multiple.preview';
import { ComboboxPopupPreview } from './combobox--popup.preview';
import { comboboxDefaultConfig, ComboboxPreview, defaultImports, defaultSkeleton } from './combobox.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Combobox', api: 'combobox' },
	meta: metaWith('spartan/ui - Combobox', 'An input combined with a list of predefined items to select.'),
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
		SectionSubSubHeading,
		ComboboxPreview,
		TabsCli,
		UIApiDocs,
		ComboboxDisabledPreview,
		ComboboxClearPreview,
		ComboboxGroupPreview,
		ComboboxGroupSeparatorPreview,
		ComboboxIconAddonPreview,
		ComboboxFormPreview,
		ComboboxPopupPreview,
		ComboboxMultiplePreview,
		ComboboxMultipleDisabledPreview,
		ComboboxFormMultiplePreview,
		ComboboxAsyncPreview,
		ComboboxAsyncMultiplePreview,
		ComboboxItemToStringPreview,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Combobox" lead="An input combined with a list of predefined items to select." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui combobox"
				ngCode="ng g @spartan-ng/cli:ui combobox"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="configuration">Configuration</spartan-section-sub-heading>

			<p class="${hlmP} mb-6">
				The combobox can be configured via
				<code class="${hlmCode}">provideBrnComboboxConfig</code>
				or by passing the individual config as input. This is the default combobox config:
			</p>

			<spartan-code [code]="_comboboxDefaultConfig" />

			<h3 id="config_filter" spartanH4>Filter</h3>

			<p class="${hlmP}">
				The combobox matches items using
				<code class="${hlmCode}">Intl.Collator</code>
				for robust string comparison. The
				<code class="${hlmCode}">filterOptions</code>
				accepts all
				<code class="${hlmCode}">Intl.CollatorOptions</code>
				, plus a
				<code class="${hlmCode}">locale</code>
				.
			</p>

			<p class="${hlmP}">
				The default
				<code class="${hlmCode}">filter</code>
				implementation uses a
				<code class="${hlmCode}">comboboxContainsFilter</code>
				to check if the item value contains the search string. Provide a custom filter function for other filtering
				behavior.
			</p>

			<p class="${hlmP}">Built-in combobox filters are:</p>

			<ul class="${hlmUl} mb-0">
				<li>
					<code class="${hlmCode}">comboboxContainsFilter</code>
					- Returns true if the item value contains the search string.
				</li>
				<li>
					<code class="${hlmCode}">comboboxStartsWithFilter</code>
					- Returns true if the item value starts with the search string.
				</li>
				<li>
					<code class="${hlmCode}">comboboxEndsWithFilter</code>
					- Returns true if the item value ends with the search string.
				</li>
			</ul>

			<h3 id="config_objects" spartanH4>Objects</h3>

			<p class="${hlmP}">
				The combobox works out of the box with
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
				function to determine if a combobox item value matches the current selected value. Defaults to
				<code class="${hlmCode}">Object.is</code>
				comparison.
			</p>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__multiple" spartanH4>Multiple select</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-multiple-preview />
				</div>
				<spartan-code secondTab [code]="_multipleCode()" />
			</spartan-tabs>

			<h3 id="examples__objects" spartanH4>Objects (itemToString)</h3>
			<p class="${hlmP}">
				Use
				<code class="${hlmCode}">itemToString</code>
				to display resolve the item as a string label or transform the item object to a string for display. In this
				example, the value
				<code class="${hlmCode}">id</code>
				is resolved to the display value
				<code class="${hlmCode}">name</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-item-to-string-preview />
				</div>
				<spartan-code secondTab [code]="_itemToStringCode()" />
			</spartan-tabs>

			<h3 id="examples__clear" spartanH4>With Clear Button</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-clear-preview />
				</div>
				<spartan-code secondTab [code]="_clearCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled (single)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-disabled-preview />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled_multiple" spartanH4>Disabled (multiple)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-multiple-disabled-preview />
				</div>
				<spartan-code secondTab [code]="_multipleDisabledCode()" />
			</spartan-tabs>

			<h3 id="examples__group" spartanH4>With Groups</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-group-preview />
				</div>
				<spartan-code secondTab [code]="_groupCode()" />
			</spartan-tabs>

			<h3 id="examples__group_separator" spartanH4>With Groups and Separators</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-group-separator-preview />
				</div>
				<spartan-code secondTab [code]="_groupSeparatorCode()" />
			</spartan-tabs>

			<h3 id="examples__icon_addon" spartanH4>With Icon Addon</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-icon-addon-preview />
				</div>
				<spartan-code secondTab [code]="_iconAddonCode()" />
			</spartan-tabs>

			<h3 id="examples__popup" spartanH4>Popup</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-popup-preview />
				</div>
				<spartan-code secondTab [code]="_popupCode()" />
			</spartan-tabs>

			<h3 id="examples__async" spartanH4>Async search (single)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-async-preview />
				</div>
				<spartan-code secondTab [code]="_asyncCode()" />
			</spartan-tabs>

			<h3 id="examples__async_multiple" spartanH4>Async search (multiple)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-async-multiple-preview />
				</div>
				<spartan-code secondTab [code]="_asyncMultipleCode()" />
			</spartan-tabs>

			<h3 id="examples__form" spartanH4>Form (single)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-form-preview />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<h3 id="examples__form_multiple" spartanH4>Form (multiple)</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-form-multiple-preview />
				</div>
				<spartan-code secondTab [code]="_formMultipleCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="brn-api">Brain API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="brain" />

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

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
	protected readonly _multipleCode = computed(() => this._snippets()['multiple']);
	protected readonly _itemToStringCode = computed(() => this._snippets()['itemToString']);
	protected readonly _clearCode = computed(() => this._snippets()['clear']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _multipleDisabledCode = computed(() => this._snippets()['multipleDisabled']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _groupSeparatorCode = computed(() => this._snippets()['groupSeparator']);
	protected readonly _iconAddonCode = computed(() => this._snippets()['iconAddon']);
	protected readonly _popupCode = computed(() => this._snippets()['popup']);
	protected readonly _asyncCode = computed(() => this._snippets()['async']);
	protected readonly _asyncMultipleCode = computed(() => this._snippets()['asyncMultiple']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _formMultipleCode = computed(() => this._snippets()['formMultiple']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
	protected readonly _comboboxDefaultConfig = comboboxDefaultConfig;
}
