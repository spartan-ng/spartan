import type { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { TabsCli } from '@spartan-ng/app/app/shared/layout/tabs-cli';
import { UIApiDocs } from '@spartan-ng/app/app/shared/layout/ui-docs-section/ui-docs-section';
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
import { ComboboxClearPreview } from './combobox--clear.preview';
import { ComboboxDisabledPreview } from './combobox--disabled.preview';
import { ComboboxFormPreview } from './combobox--form.preview';
import { ComboboxGroupSeparatorPreview } from './combobox--group-separator.preview';
import { ComboboxGroupPreview } from './combobox--group.preview';
import { ComboboxIconAddonPreview } from './combobox--icon-addon.preview';
import { ComboboxMultipleDisabledPreview } from './combobox--multiple-disabled.preview';
import { ComboboxMultipleFormPreview } from './combobox--multiple-form.preview';
import { ComboboxMultiplePreview } from './combobox--multiple.preview';
import { ComboboxPopupPreview } from './combobox--popup.preview';
import { ComboboxPreview, defaultImports, defaultSkeleton } from './combobox.preview';

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
		ComboboxMultipleFormPreview,
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

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__clear" spartanH4>With Clear Button</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-clear-preview />
				</div>
				<spartan-code secondTab [code]="_clearCode()" />
			</spartan-tabs>

			<h3 id="examples__disabled" spartanH4>Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-disabled-preview />
				</div>
				<spartan-code secondTab [code]="_disabledCode()" />
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

			<h3 id="examples__form" spartanH4>Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-form-preview />
				</div>
				<spartan-code secondTab [code]="_formCode()" />
			</spartan-tabs>

			<h3 id="examples__multiple" spartanH4>Multiple</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-multiple-preview />
				</div>
				<spartan-code secondTab [code]="_multipleCode()" />
			</spartan-tabs>

			<h3 id="examples__multiple_disabled" spartanH4>Multiple Disabled</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-multiple-disabled-preview />
				</div>
				<spartan-code secondTab [code]="_multipleDisabledCode()" />
			</spartan-tabs>

			<h3 id="examples__multiple_form" spartanH4>Multiple Form</h3>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-combobox-multiple-form-preview />
				</div>
				<spartan-code secondTab [code]="_multipleFormCode()" />
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
	protected readonly _clearCode = computed(() => this._snippets()['clear']);
	protected readonly _disabledCode = computed(() => this._snippets()['disabled']);
	protected readonly _groupCode = computed(() => this._snippets()['group']);
	protected readonly _groupSeparatorCode = computed(() => this._snippets()['groupSeparator']);
	protected readonly _iconAddonCode = computed(() => this._snippets()['iconAddon']);
	protected readonly _popupCode = computed(() => this._snippets()['popup']);
	protected readonly _formCode = computed(() => this._snippets()['form']);
	protected readonly _multipleCode = computed(() => this._snippets()['multiple']);
	protected readonly _multipleDisabledCode = computed(() => this._snippets()['multipleDisabled']);
	protected readonly _multipleFormCode = computed(() => this._snippets()['multipleForm']);
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _defaultImports = defaultImports;
}
