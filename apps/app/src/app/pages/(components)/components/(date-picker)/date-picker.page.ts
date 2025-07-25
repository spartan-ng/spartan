import type { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimitiveSnippetsService } from '@spartan-ng/app/app/core/services/primitive-snippets.service';
import { CodePreview } from '@spartan-ng/app/app/shared/code/code-preview';
import { MainSection } from '@spartan-ng/app/app/shared/layout/main-section';
import { HlmButton } from '@spartan-ng/helm/button';
import { hlmCode, hlmH4, hlmP, hlmUl } from '@spartan-ng/helm/typography';
import { Code } from '../../../../shared/code/code';
import { PageBottomNav } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav';
import { PageBottomNavLink } from '../../../../shared/layout/page-bottom-nav/page-bottom-nav-link';
import { PageNav } from '../../../../shared/layout/page-nav/page-nav';
import { SectionIntro } from '../../../../shared/layout/section-intro';
import { SectionSubHeading } from '../../../../shared/layout/section-sub-heading';
import { Tabs } from '../../../../shared/layout/tabs';
import { TabsCli } from '../../../../shared/layout/tabs-cli';
import { UIApiDocs } from '../../../../shared/layout/ui-docs-section/ui-docs-section';
import { metaWith } from '../../../../shared/meta/meta.util';
import { link } from '../../../../shared/typography/link';
import { DatePickerConfigExample } from './date-picker--config.example';
import { DatePickerFormMultipleExample } from './date-picker--form-multi.example';
import { DatePickerFormExample } from './date-picker--form.example';
import { DatePickerFormatExample } from './date-picker--format.example';
import { DatePickerMultipleExample } from './date-picker--multi.example';
import { DatePickerPreview, defaultImports, defaultSkeleton } from './date-picker.preview';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Date Picker', api: 'date-picker' },
	meta: metaWith('spartan/ui - Date Picker', 'A date picker component.'),
	title: 'spartan/ui - Date Picker',
};

@Component({
	selector: 'spartan-calendar',
	imports: [
		UIApiDocs,
		DatePickerPreview,
		SectionIntro,
		Tabs,
		Code,
		SectionSubHeading,
		TabsCli,
		PageBottomNav,
		PageBottomNavLink,
		CodePreview,
		MainSection,
		PageNav,
		DatePickerConfigExample,
		DatePickerFormatExample,
		DatePickerFormExample,
		DatePickerMultipleExample,
		DatePickerFormMultipleExample,
		RouterLink,
		HlmButton,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Date Picker" lead="A date picker component." />

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-preview />
				</div>
				<spartan-code secondTab [code]="_defaultCode" />
			</spartan-tabs>

			<spartan-section-sub-heading id="installation">Installation</spartan-section-sub-heading>

			<p class="${hlmP} mb-6">
				The Date Picker component is built with the
				<a routerLink="/components/popover" hlmBtn variant="link" class="${link}">Popover</a>
				and the
				<a routerLink="/components/calendar" hlmBtn variant="link" class="${link}">Calendar</a>
				components.
			</p>

			<spartan-cli-tabs
				class="mt-4"
				nxCode="npx nx g @spartan-ng/cli:ui datepicker"
				ngCode="ng g @spartan-ng/cli:ui datepicker"
			/>

			<spartan-section-sub-heading id="usage">Usage</spartan-section-sub-heading>
			<div class="space-y-4">
				<spartan-code [code]="_defaultImports" />
				<spartan-code [code]="_codeSkeleton" />
			</div>

			<spartan-section-sub-heading id="hlm-api">Helm API</spartan-section-sub-heading>
			<spartan-ui-api-docs docType="helm" />

			<spartan-section-sub-heading id="examples">Examples</spartan-section-sub-heading>
			<h3 id="examples__custom_config" class="${hlmH4} mb-2 mt-6">Custom Configs</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">provideHlmDatePickerConfig</code>
				to provide custom configs for the date picker component throughout the application.
			</p>
			<ul class="${hlmUl}">
				<li>
					<code class="${hlmCode}">autoCloseOnSelect: boolean;</code>
					if
					<code class="${hlmCode}">true</code>
					, the date picker will close when a date is selected.
				</li>
				<li>
					<code class="${hlmCode}">formatDate: (date: T) => string;</code>
					defines the default format how the date should be displayed in the UI.
				</li>
				<li>
					<code class="${hlmCode}">transformDate: (date: T) => T;</code>
					defines the default format how the date should be transformed before saving to model/form.
				</li>
			</ul>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-config />
				</div>
				<spartan-code secondTab [code]="_configCode" />
			</spartan-tabs>

			<h3 id="examples__multiple_selecton" class="${hlmH4} mb-2 mt-6">Multiple Selection</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">hlm-date-picker-multi</code>
				for multiple date selection. Limit the selectable dates using
				<code class="${hlmCode}">minSelection</code>
				and
				<code class="${hlmCode}">maxSelection</code>
				inputs.
			</p>

			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-multiple />
				</div>
				<spartan-code secondTab [code]="_multiCode" />
			</spartan-tabs>

			<h3 id="examples__format_date" class="${hlmH4} mb-2 mt-6">Format Date</h3>

			<p class="${hlmP} mb-6">
				Use
				<code class="${hlmCode}">formatDate</code>
				input to override the global date format for the date picker component.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-format />
				</div>
				<spartan-code secondTab [code]="_formatCode" />
			</spartan-tabs>

			<h3 id="examples__form" class="${hlmH4} mb-2 mt-6">Form</h3>
			<p class="${hlmP} mb-6">
				Sync the date to a form by adding
				<code class="${hlmCode}">formControlName</code>
				to
				<code class="${hlmCode}">hlm-date-picker</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-form />
				</div>
				<spartan-code secondTab [code]="_formCode" />
			</spartan-tabs>

			<h3 id="examples__form_multiple_selection" class="${hlmH4} mb-2 mt-6">Form Multiple Selection</h3>
			<p class="${hlmP} mb-6">
				Sync the dates to a form by adding
				<code class="${hlmCode}">formControlName</code>
				to
				<code class="${hlmCode}">hlm-date-picker-multi</code>
				.
			</p>
			<spartan-tabs firstTab="Preview" secondTab="Code">
				<div spartanCodePreview firstTab>
					<spartan-date-picker-form-multiple />
				</div>
				<spartan-code secondTab [code]="_formMultiCode" />
			</spartan-tabs>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="dialog" label="Dialog" />
				<spartan-page-bottom-nav-link direction="previous" href="data-table" label="Data Table" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class CardPage {
	private readonly _snippets = inject(PrimitiveSnippetsService).getSnippets('date-picker')();
	protected readonly _defaultCode = this._snippets['default'];
	protected readonly _configCode = this._snippets['config'];
	protected readonly _formCode = this._snippets['form'];
	protected readonly _formMultiCode = this._snippets['formMulti'];
	protected readonly _formatCode = this._snippets['format'];
	protected readonly _multiCode = this._snippets['multi'];
	protected readonly _defaultImports = defaultImports;
	protected readonly _codeSkeleton = defaultSkeleton;
}
