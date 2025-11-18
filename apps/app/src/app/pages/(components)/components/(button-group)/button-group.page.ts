import { RouteMeta } from '@analogjs/router';
import { Component, computed, inject } from '@angular/core';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
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
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { ButtonGroupDropdownMenu } from './button-group--dropdown-menu.example';
import { ButtonGroupInputGroup } from './button-group--input-group.example';
import { ButtonGroupInput } from './button-group--input.example';
import { ButtonGroupNested } from './button-group--nested.example';
import { ButtonGroupOrientation } from './button-group--orientation.example';
import { ButtonGroupPopover } from './button-group--popover.example';
import { ButtonGroupSelect } from './button-group--select.example';
import { ButtonGroupSeparator } from './button-group--separator.example';
import { ButtonGroupSize } from './button-group--size.example';
import { ButtonGroupSplit } from './button-group--split.example';
import { ButtonGroupWithText } from './button-group--with-text.example';
import { accessibilityCode, ButtonGroupPreview, defaultImports, defaultSkeleton } from './button-group.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Button Group', api: 'button-group' },
	meta: metaWith('spartan/ui - Button Group', 'Displays a group of related buttons.'),
	title: 'spartan/ui - Button Group',
};

@Component({
	selector: 'spartan-button-group',

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
		ButtonGroupPreview,
		ButtonGroupOrientation,
		ButtonGroupSize,
		ButtonGroupNested,
		ButtonGroupSeparator,
		ButtonGroupSplit,
		ButtonGroupInput,
		ButtonGroupDropdownMenu,
		ButtonGroupSelect,
		ButtonGroupPopover,
		ButtonGroupWithText,
		ButtonGroupInputGroup,
		SectionSubSubHeading,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Button Group"
				lead="A container that groups related buttons together with consistent styling."
			/>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode()" />
			</spartan-tabs>
			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>
			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui button-group"
				ngCode="ng g @spartan-ng/cli:ui button-group"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="mt-6 space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_defaultSkeleton" />
			</div>

			<spartan-section-sub-heading id="accessibility">Accessibility</spartan-section-sub-heading>
			<ul class="my-6 ml-6 list-disc">
				<li class="mt-2">
					The
					<code class="${hlmCode} mr-0.5">HlmButtonGroup</code>
					directive has the
					<code class="${hlmCode} mr-0.5">role</code>
					attribute set to
					<code class="${hlmCode} mr-0.5">group</code>
					.
				</li>
				<li class="mt-2">
					Use
					<code class="${hlmCode} mr-0.5">Tab</code>
					to navigate between the buttons in the group.
				</li>
				<li class="mt-2">
					Use
					<code class="${hlmCode} mr-0.5">aria-label</code>
					or
					<code class="${hlmCode} mr-0.5">aria-labelledby</code>
					to label the button group.
				</li>
			</ul>
			<div class="space-y-4">
				<spartan-code [code]="_accessibilityCode" />
			</div>

			<spartan-section-sub-heading id="button-group-vs-toggle-group">
				ButtonGroup vs ToggleGroup
			</spartan-section-sub-heading>
			<ul class="my-6 ml-6 list-disc">
				<li class="mt-2">
					Use the
					<code class="${hlmCode} mr-0.5">ButtonGroup</code>
					component when you want to group buttons that perform an action.
				</li>
				<li class="mt-2">
					Use the
					<code class="${hlmCode} mr-0.5">ToggleGroup</code>
					component when you want to group buttons that toggle a state.
				</li>
			</ul>

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>

			<h3 id="examples__orientation" spartanH4>Orientation</h3>
			<p class="${hlmP} mb-2">
				Set the
				<code class="${hlmCode} mr-0.5">orientation</code>
				prop to change the button group layout.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-orientation />
				</div>
				<spartan-code secondTab [code]="_orientationCode()" />
			</spartan-tabs>

			<h3 id="examples__size" spartanH4>Size</h3>
			<p class="${hlmP} mb-2">
				Control the size of buttons using the
				<code class="${hlmCode} mr-0.5">size</code>
				prop on individual buttons.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-size />
				</div>
				<spartan-code secondTab [code]="_sizeCode()" />
			</spartan-tabs>

			<h3 id="examples__nested" spartanH4>Nested</h3>
			<p class="${hlmP} mb-2">
				Nest
				<code class="${hlmCode} mr-0.5">HlmButtonGroup</code>
				to create button groups with spacing.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-nested />
				</div>
				<spartan-code secondTab [code]="_nestedCode()" />
			</spartan-tabs>

			<h3 id="examples__separator" spartanH4>Separator</h3>
			<p class="${hlmP} mb-2">
				The
				<code class="${hlmCode} mr-0.5">HlmButtonGroupSeparator</code>
				component visually divides buttons within a group.
			</p>
			<p class="${hlmP} mb-2">
				Buttons with variant
				<code class="${hlmCode} mr-0.5">outline</code>
				do not need a separator since they have a border. For other variants, a separator is recommended to improve the
				visual hierarchy.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-separator />
				</div>
				<spartan-code secondTab [code]="_separatorCode()" />
			</spartan-tabs>

			<h3 id="examples__split" spartanH4>Split</h3>
			<p class="${hlmP} mb-2">
				Create a split button group by adding two buttons separated by a
				<code class="${hlmCode} mr-0.5">HlmButtonGroupSeparator</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-split />
				</div>
				<spartan-code secondTab [code]="_splitCode()" />
			</spartan-tabs>

			<h3 id="examples__with-text" spartanH4>With text</h3>
			<p class="${hlmP} mb-2">
				Add text to the button group using the
				<code class="${hlmCode} mr-0.5">HlmButtonGroupText</code>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-with-text />
				</div>
				<spartan-code secondTab [code]="_textCode()" />
			</spartan-tabs>

			<h3 id="examples__input" spartanH4>Input</h3>
			<p class="${hlmP} mb-2">
				Wrap an
				<code class="${hlmCode} mr-0.5">HlmInput</code>
				component with buttons.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-input />
				</div>
				<spartan-code secondTab [code]="_inputCode()" />
			</spartan-tabs>

			<h3 id="examples__input_group" spartanH4>Input Group</h3>
			<p class="${hlmP} mb-2">
				Wrap an
				<code class="${hlmCode} mr-0.5">HlmInputGroup</code>
				component to create complex input layouts
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-input-group />
				</div>
				<spartan-code secondTab [code]="_inputGroupCode()" />
			</spartan-tabs>

			<h3 id="examples__dropdown-menu" spartanH4>Dropdown Menu</h3>
			<p class="${hlmP} mb-2">
				Create a split button group with a
				<code class="${hlmCode} mr-0.5">HlmDropdownMenu</code>
				component .
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-dropdown-menu />
				</div>
				<spartan-code secondTab [code]="_dropdownMenuCode()" />
			</spartan-tabs>

			<h3 id="examples__select" spartanH4>Select</h3>
			<p class="${hlmP} mb-2">
				Pair with a
				<code class="${hlmCode} mr-0.5">Select</code>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-select />
				</div>
				<spartan-code secondTab [code]="_selectCode()" />
			</spartan-tabs>

			<h3 id="examples__popover" spartanH4>Popover</h3>
			<p class="${hlmP} mb-2">
				Use with a
				<code class="${hlmCode} mr-0.5">Popover</code>
				component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-button-group-popover />
				</div>
				<spartan-code secondTab [code]="_popoverCode()" />
			</spartan-tabs>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="calendar" label="Calendar" />
				<spartan-page-bottom-nav-link direction="previous" href="button" label="Button" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class ButtonGroupPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('button-group');
	protected readonly _defaultCode = computed(() => this._snippets()['default']);
	protected readonly _defaultImports = defaultImports;
	protected readonly _defaultSkeleton = defaultSkeleton;
	protected readonly _accessibilityCode = accessibilityCode;
	protected readonly _orientationCode = computed(() => this._snippets()['orientation']);
	protected readonly _sizeCode = computed(() => this._snippets()['size']);
	protected readonly _nestedCode = computed(() => this._snippets()['nested']);
	protected readonly _separatorCode = computed(() => this._snippets()['separator']);
	protected readonly _textCode = computed(() => this._snippets()['withText']);
	protected readonly _splitCode = computed(() => this._snippets()['split']);
	protected readonly _inputCode = computed(() => this._snippets()['input']);
	protected readonly _inputGroupCode = computed(() => this._snippets()['inputGroup']);
	protected readonly _dropdownMenuCode = computed(() => this._snippets()['dropdownMenu']);
	protected readonly _selectCode = computed(() => this._snippets()['select']);
	protected readonly _popoverCode = computed(() => this._snippets()['popover']);
}
